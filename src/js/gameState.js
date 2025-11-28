/* ============================================
   EGG SIMULATOR - GAME STATE MANAGEMENT
   ============================================ */

/**
 * Game State Manager
 * Handles all game state, calculations, and persistence
 */
const GameState = {
  // Current game state
  state: null,
  
  // Settings
  settings: {
    particlesEnabled: true,
    screenShakeEnabled: true,
    numberFormat: 'short',
    masterVolume: 0.8,
    sfxVolume: 1.0,
    musicVolume: 0.6
  },
  
  // Runtime stats (not saved)
  runtime: {
    clicksThisSecond: 0,
    lastClickTime: 0,
    sessionStartTime: 0
  },

  /**
   * Initialize default game state
   * @returns {Object} Default state object
   */
  getDefaultState() {
    return {
      // Resources
      eggs: 0,
      totalEggs: 0,
      goldenEggs: 0,
      
      // Stats
      totalClicks: 0,
      totalPlayTime: 0,
      prestigeCount: 0,
      
      // Current egg type
      currentEggType: 'regular',
      unlockedEggTypes: ['regular'],
      
      // Upgrades (id -> level)
      upgrades: {},
      
      // Producers (id -> count)
      producers: {},
      
      // Achievements (id -> unlocked)
      achievements: {},
      
      // Timestamps
      lastSaveTime: Date.now(),
      lastOnlineTime: Date.now(),
      gameStartTime: Date.now()
    };
  },

  /**
   * Initialize game state
   */
  init() {
    this.runtime.sessionStartTime = Date.now();
    this.load();
    this.calculateOfflineProgress();
  },

  /**
   * Load game state from storage
   */
  load() {
    const savedState = Utils.storage.get('eggSimulator_state');
    const savedSettings = Utils.storage.get('eggSimulator_settings');
    
    if (savedState) {
      // Merge saved state with defaults to handle new properties
      this.state = { ...this.getDefaultState(), ...savedState };
    } else {
      this.state = this.getDefaultState();
    }
    
    if (savedSettings) {
      this.settings = { ...this.settings, ...savedSettings };
    }
    
    // Apply settings
    this.applySettings();
  },

  /**
   * Save game state to storage
   */
  save() {
    this.state.lastSaveTime = Date.now();
    this.state.lastOnlineTime = Date.now();
    this.state.totalPlayTime += (Date.now() - this.runtime.sessionStartTime) / 1000;
    this.runtime.sessionStartTime = Date.now();
    
    Utils.storage.set('eggSimulator_state', this.state);
    Utils.storage.set('eggSimulator_settings', this.settings);
  },

  /**
   * Apply current settings
   */
  applySettings() {
    AudioManager.setMasterVolume(this.settings.masterVolume);
    AudioManager.setSfxVolume(this.settings.sfxVolume);
    AudioManager.setMusicVolume(this.settings.musicVolume);
    ParticleSystem.setEnabled(this.settings.particlesEnabled);
  },

  /**
   * Calculate offline progress
   */
  calculateOfflineProgress() {
    if (!this.state.lastOnlineTime) return;
    
    const offlineTime = Date.now() - this.state.lastOnlineTime;
    const maxOfflineTime = GameData.balance.maxOfflineHours * 60 * 60 * 1000;
    const effectiveOfflineTime = Math.min(offlineTime, maxOfflineTime);
    
    if (effectiveOfflineTime > 60000) { // At least 1 minute offline
      const offlineSeconds = effectiveOfflineTime / 1000;
      const eggsPerSecond = this.getEggsPerSecond();
      const offlineEarnings = Math.floor(
        eggsPerSecond * offlineSeconds * GameData.balance.offlineEarningsRate
      );
      
      if (offlineEarnings > 0) {
        this.addEggs(offlineEarnings);
        
        // Show notification
        setTimeout(() => {
          UI.showNotification(
            'Welcome Back!',
            `You earned ${Utils.formatNumber(offlineEarnings, this.settings.numberFormat)} eggs while away`,
            'success'
          );
        }, 1000);
      }
    }
  },

  /**
   * Reset game state
   */
  reset() {
    Utils.storage.remove('eggSimulator_state');
    this.state = this.getDefaultState();
    this.runtime.sessionStartTime = Date.now();
  },

  /**
   * Export save data
   * @returns {string} Base64 encoded save data
   */
  exportSave() {
    const data = {
      state: this.state,
      settings: this.settings,
      version: '1.0.0'
    };
    return btoa(JSON.stringify(data));
  },

  /**
   * Import save data
   * @param {string} saveString - Base64 encoded save data
   * @returns {boolean} Success
   */
  importSave(saveString) {
    try {
      const data = JSON.parse(atob(saveString));
      if (data.state) {
        this.state = { ...this.getDefaultState(), ...data.state };
      }
      if (data.settings) {
        this.settings = { ...this.settings, ...data.settings };
      }
      this.save();
      this.applySettings();
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  },

  /**
   * Check if save exists
   * @returns {boolean} Has save
   */
  hasSave() {
    return Utils.storage.get('eggSimulator_state') !== null;
  },

  // ============================================
  // CALCULATIONS
  // ============================================

  /**
   * Get current click value
   * @returns {number} Eggs per click
   */
  getClickValue() {
    let value = GameData.balance.baseClickValue;
    
    // Apply egg type multiplier
    const eggType = GameData.eggTypes.find(e => e.id === this.state.currentEggType);
    if (eggType) {
      value *= eggType.multiplier;
    }
    
    // Apply upgrade multipliers
    const strongerClicks = this.state.upgrades['stronger_clicks'] || 0;
    if (strongerClicks > 0) {
      const upgrade = GameData.upgrades.find(u => u.id === 'stronger_clicks');
      value *= Math.pow(upgrade.effect.value, strongerClicks);
    }
    
    // Apply prestige bonus
    value *= this.getPrestigeMultiplier();
    
    // Apply click EPS bonus
    const clickEpsBonus = this.state.upgrades['egg_overflow'] || 0;
    if (clickEpsBonus > 0) {
      const upgrade = GameData.upgrades.find(u => u.id === 'egg_overflow');
      value += this.getEggsPerSecond() * upgrade.effect.value * clickEpsBonus;
    }
    
    return Math.floor(value);
  },

  /**
   * Get eggs per second from all producers
   * @returns {number} EPS
   */
  getEggsPerSecond() {
    let eps = 0;
    
    // Producer production
    for (const producer of GameData.producers) {
      const count = this.state.producers[producer.id] || 0;
      if (count > 0) {
        eps += producer.baseProduction * count;
      }
    }
    
    // Passive eggs from upgrades
    const passiveEggs = this.state.upgrades['egg_magnet'] || 0;
    if (passiveEggs > 0) {
      const upgrade = GameData.upgrades.find(u => u.id === 'egg_magnet');
      eps += upgrade.effect.value * passiveEggs;
    }
    
    // Production multiplier
    const productionMult = this.state.upgrades['egg_polish'] || 0;
    if (productionMult > 0) {
      const upgrade = GameData.upgrades.find(u => u.id === 'egg_polish');
      eps *= 1 + (upgrade.effect.value * productionMult);
    }
    
    // Speed multiplier
    const speedMult = this.state.upgrades['time_warp'] || 0;
    if (speedMult > 0) {
      const upgrade = GameData.upgrades.find(u => u.id === 'time_warp');
      eps *= 1 + (upgrade.effect.value * speedMult);
    }
    
    // Apply egg type multiplier
    const eggType = GameData.eggTypes.find(e => e.id === this.state.currentEggType);
    if (eggType) {
      eps *= eggType.multiplier;
    }
    
    // Apply prestige bonus
    eps *= this.getPrestigeMultiplier();
    
    return eps;
  },

  /**
   * Get prestige multiplier
   * @returns {number} Multiplier
   */
  getPrestigeMultiplier() {
    let mult = 1 + (this.state.goldenEggs * GameData.prestige.bonusPerGoldenEgg);
    
    // Apply prestige power upgrade
    const prestigePower = this.state.upgrades['prestige_power'] || 0;
    if (prestigePower > 0) {
      const upgrade = GameData.upgrades.find(u => u.id === 'prestige_power');
      mult *= 1 + (upgrade.effect.value * prestigePower);
    }
    
    return mult;
  },

  /**
   * Get golden egg chance
   * @returns {number} Chance (0-1)
   */
  getGoldenChance() {
    let chance = 0;
    const goldenTouch = this.state.upgrades['golden_touch'] || 0;
    if (goldenTouch > 0) {
      const upgrade = GameData.upgrades.find(u => u.id === 'golden_touch');
      chance = upgrade.effect.value * goldenTouch;
    }
    return Math.min(chance, 0.5); // Cap at 50%
  },

  /**
   * Get critical chance
   * @returns {number} Chance (0-1)
   */
  getCritChance() {
    let chance = 0;
    const luckyEgg = this.state.upgrades['lucky_egg'] || 0;
    if (luckyEgg > 0) {
      const upgrade = GameData.upgrades.find(u => u.id === 'lucky_egg');
      chance = upgrade.effect.value * luckyEgg;
    }
    return Math.min(chance, 0.5); // Cap at 50%
  },

  /**
   * Get upgrade cost
   * @param {string} upgradeId - Upgrade ID
   * @returns {number} Cost
   */
  getUpgradeCost(upgradeId) {
    const upgrade = GameData.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return Infinity;
    
    const level = this.state.upgrades[upgradeId] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
  },

  /**
   * Get producer cost
   * @param {string} producerId - Producer ID
   * @returns {number} Cost
   */
  getProducerCost(producerId) {
    const producer = GameData.producers.find(p => p.id === producerId);
    if (!producer) return Infinity;
    
    const count = this.state.producers[producerId] || 0;
    return Math.floor(producer.baseCost * Math.pow(producer.costMultiplier, count));
  },

  /**
   * Get golden eggs earned on prestige
   * @returns {number} Golden eggs
   */
  getPrestigeReward() {
    const base = GameData.prestige.baseRequirement;
    const scaling = GameData.prestige.scalingFactor;
    
    if (this.state.totalEggs < base) return 0;
    
    return Math.floor(Math.pow(this.state.totalEggs / base, 1 / scaling));
  },

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * Add eggs
   * @param {number} amount - Eggs to add
   */
  addEggs(amount) {
    this.state.eggs += amount;
    this.state.totalEggs += amount;
    this.checkEggTypeUnlocks();
  },

  /**
   * Spend eggs
   * @param {number} amount - Eggs to spend
   * @returns {boolean} Success
   */
  spendEggs(amount) {
    if (this.state.eggs >= amount) {
      this.state.eggs -= amount;
      return true;
    }
    return false;
  },

  /**
   * Handle egg click
   * @returns {Object} Click result
   */
  handleClick() {
    const now = Date.now();
    
    // Track clicks per second
    if (now - this.runtime.lastClickTime > 1000) {
      this.runtime.clicksThisSecond = 0;
    }
    this.runtime.clicksThisSecond++;
    this.runtime.lastClickTime = now;
    
    // Calculate click value
    let value = this.getClickValue();
    let isCrit = false;
    let isGolden = false;
    
    // Check for critical
    if (Utils.chance(this.getCritChance())) {
      value *= GameData.balance.critMultiplier;
      isCrit = true;
    }
    // Check for golden (only if not crit)
    else if (Utils.chance(this.getGoldenChance())) {
      value *= GameData.balance.goldenMultiplier;
      isGolden = true;
    }
    
    // Add eggs
    this.addEggs(value);
    this.state.totalClicks++;
    
    // Check achievements
    this.checkAchievements();
    
    return { value, isCrit, isGolden };
  },

  /**
   * Purchase upgrade
   * @param {string} upgradeId - Upgrade ID
   * @returns {boolean} Success
   */
  purchaseUpgrade(upgradeId) {
    const upgrade = GameData.upgrades.find(u => u.id === upgradeId);
    if (!upgrade) return false;
    
    const currentLevel = this.state.upgrades[upgradeId] || 0;
    if (currentLevel >= upgrade.maxLevel) return false;
    
    const cost = this.getUpgradeCost(upgradeId);
    if (!this.spendEggs(cost)) return false;
    
    this.state.upgrades[upgradeId] = currentLevel + 1;
    this.checkAchievements();
    
    return true;
  },

  /**
   * Purchase producer
   * @param {string} producerId - Producer ID
   * @returns {boolean} Success
   */
  purchaseProducer(producerId) {
    const cost = this.getProducerCost(producerId);
    if (!this.spendEggs(cost)) return false;
    
    this.state.producers[producerId] = (this.state.producers[producerId] || 0) + 1;
    this.checkAchievements();
    
    return true;
  },

  /**
   * Change egg type
   * @param {string} eggTypeId - Egg type ID
   * @returns {boolean} Success
   */
  changeEggType(eggTypeId) {
    if (!this.state.unlockedEggTypes.includes(eggTypeId)) return false;
    
    this.state.currentEggType = eggTypeId;
    return true;
  },

  /**
   * Perform prestige
   * @returns {boolean} Success
   */
  prestige() {
    const reward = this.getPrestigeReward();
    if (reward <= 0) return false;
    
    // Add golden eggs
    this.state.goldenEggs += reward;
    this.state.prestigeCount++;
    
    // Reset progress (keep golden eggs, achievements, unlocked egg types)
    const keepGoldenEggs = this.state.goldenEggs;
    const keepAchievements = this.state.achievements;
    const keepUnlockedEggs = this.state.unlockedEggTypes;
    const keepPrestigeCount = this.state.prestigeCount;
    const keepGameStartTime = this.state.gameStartTime;
    const keepTotalPlayTime = this.state.totalPlayTime;
    
    // Reset state
    this.state = this.getDefaultState();
    
    // Restore kept values
    this.state.goldenEggs = keepGoldenEggs;
    this.state.achievements = keepAchievements;
    this.state.unlockedEggTypes = keepUnlockedEggs;
    this.state.prestigeCount = keepPrestigeCount;
    this.state.gameStartTime = keepGameStartTime;
    this.state.totalPlayTime = keepTotalPlayTime;
    
    this.checkAchievements();
    
    return true;
  },

  /**
   * Check and unlock egg types
   */
  checkEggTypeUnlocks() {
    for (const eggType of GameData.eggTypes) {
      if (!this.state.unlockedEggTypes.includes(eggType.id)) {
        if (this.state.totalEggs >= eggType.unlockRequirement) {
          this.state.unlockedEggTypes.push(eggType.id);
          UI.showNotification(
            'New Egg Unlocked!',
            `You unlocked the ${eggType.name}!`,
            'success'
          );
          this.checkAchievements();
        }
      }
    }
  },

  /**
   * Check and unlock achievements
   */
  checkAchievements() {
    for (const achievement of GameData.achievements) {
      if (this.state.achievements[achievement.id]) continue;
      
      let unlocked = false;
      const condition = achievement.condition;
      
      switch (condition.type) {
        case 'total_eggs':
          unlocked = this.state.totalEggs >= condition.value;
          break;
        case 'total_clicks':
          unlocked = this.state.totalClicks >= condition.value;
          break;
        case 'producer_owned':
          unlocked = (this.state.producers[condition.producer] || 0) >= condition.value;
          break;
        case 'total_upgrades':
          const totalUpgrades = Object.values(this.state.upgrades).reduce((a, b) => a + b, 0);
          unlocked = totalUpgrades >= condition.value;
          break;
        case 'max_upgrade':
          unlocked = GameData.upgrades.some(u => 
            (this.state.upgrades[u.id] || 0) >= u.maxLevel
          );
          break;
        case 'prestige_count':
          unlocked = this.state.prestigeCount >= condition.value;
          break;
        case 'golden_eggs':
          unlocked = this.state.goldenEggs >= condition.value;
          break;
        case 'egg_unlocked':
          unlocked = this.state.unlockedEggTypes.includes(condition.egg);
          break;
        case 'clicks_per_second':
          unlocked = this.runtime.clicksThisSecond >= condition.value;
          break;
        case 'play_time':
          const totalTime = this.state.totalPlayTime + 
            (Date.now() - this.runtime.sessionStartTime) / 1000;
          unlocked = totalTime >= condition.value;
          break;
      }
      
      if (unlocked) {
        this.state.achievements[achievement.id] = true;
        UI.showAchievement(achievement);
        AudioManager.playAchievement();
      }
    }
  },

  /**
   * Get achievement count
   * @returns {Object} { unlocked, total }
   */
  getAchievementCount() {
    const unlocked = Object.keys(this.state.achievements).length;
    const total = GameData.achievements.length;
    return { unlocked, total };
  },

  /**
   * Game tick - called every frame
   * @param {number} deltaTime - Time since last tick in seconds
   */
  tick(deltaTime) {
    // Add passive eggs
    const eps = this.getEggsPerSecond();
    if (eps > 0) {
      this.addEggs(eps * deltaTime);
    }
    
    // Check time-based achievements
    this.checkAchievements();
  }
};

// Export for use in other modules
window.GameState = GameState;

