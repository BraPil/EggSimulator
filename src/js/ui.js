/* ============================================
   EGG SIMULATOR - UI MANAGEMENT
   ============================================ */

const UI = {
  elements: {},
  currentTab: 'upgrades',

  init() {
    this.cacheElements();
    this.bindEvents();
    this.updateAll();
  },

  cacheElements() {
    this.elements = {
      // Screens
      menuScreen: Utils.$('#menuScreen'),
      gameScreen: Utils.$('#gameScreen'),
      // HUD
      eggCount: Utils.$('#eggCount'),
      goldenEggCount: Utils.$('#goldenEggCount'),
      prestigeLevel: Utils.$('#prestigeLevel'),
      perClickStat: Utils.$('#perClickStat'),
      perSecondStat: Utils.$('#perSecondStat'),
      multiplierDisplay: Utils.$('#multiplierDisplay'),
      // Egg
      mainEgg: Utils.$('#mainEgg'),
      eggContainer: Utils.$('#eggContainer'),
      clickEffects: Utils.$('#clickEffects'),
      // Panels
      upgradesPanel: Utils.$('#upgradesPanel'),
      producersPanel: Utils.$('#producersPanel'),
      // Modals
      settingsModal: Utils.$('#settingsModal'),
      achievementsModal: Utils.$('#achievementsModal'),
      prestigeModal: Utils.$('#prestigeModal'),
      eggTypesModal: Utils.$('#eggTypesModal'),
      // Buttons
      btnNewGame: Utils.$('#btnNewGame'),
      btnContinue: Utils.$('#btnContinue'),
      btnSettings: Utils.$('#btnSettings'),
      btnAchievements: Utils.$('#btnAchievements'),
      btnPause: Utils.$('#btnPause'),
      btnGameSettings: Utils.$('#btnGameSettings'),
      btnPrestige: Utils.$('#btnPrestige'),
      // Settings
      masterVolume: Utils.$('#masterVolume'),
      sfxVolume: Utils.$('#sfxVolume'),
      musicVolume: Utils.$('#musicVolume'),
      particlesEnabled: Utils.$('#particlesEnabled'),
      screenShakeEnabled: Utils.$('#screenShakeEnabled'),
      numberFormat: Utils.$('#numberFormat'),
      // Achievement
      achievementPopup: Utils.$('#achievementPopup'),
      achievementName: Utils.$('#achievementName'),
      achievementsGrid: Utils.$('#achievementsGrid'),
      achievementCount: Utils.$('#achievementCount'),
      achievementTotal: Utils.$('#achievementTotal'),
      // Prestige
      prestigeReward: Utils.$('#prestigeReward'),
      newMultiplier: Utils.$('#newMultiplier'),
      // Egg Types
      eggTypesGrid: Utils.$('#eggTypesGrid'),
      // Notifications
      notifications: Utils.$('#notifications')
    };
  },

  bindEvents() {
    // Menu buttons
    this.elements.btnNewGame.addEventListener('click', () => this.startGame(true));
    this.elements.btnContinue.addEventListener('click', () => this.startGame(false));
    this.elements.btnSettings.addEventListener('click', () => this.openModal('settings'));
    this.elements.btnAchievements.addEventListener('click', () => this.openModal('achievements'));
    
    // Egg click
    this.elements.eggContainer.addEventListener('click', (e) => this.handleEggClick(e));
    
    // HUD buttons
    this.elements.btnPause.addEventListener('click', () => this.pauseGame());
    this.elements.btnGameSettings.addEventListener('click', () => this.openModal('settings'));
    
    // Tab buttons
    Utils.$$('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });
    
    // Modal closes
    Utils.$$('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllModals());
    });
    Utils.$$('.modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', () => this.closeAllModals());
    });
    
    // Settings
    this.elements.masterVolume.addEventListener('input', (e) => {
      GameState.settings.masterVolume = e.target.value / 100;
      GameState.applySettings();
      e.target.nextElementSibling.textContent = e.target.value + '%';
    });
    this.elements.sfxVolume.addEventListener('input', (e) => {
      GameState.settings.sfxVolume = e.target.value / 100;
      GameState.applySettings();
      e.target.nextElementSibling.textContent = e.target.value + '%';
    });
    this.elements.musicVolume.addEventListener('input', (e) => {
      GameState.settings.musicVolume = e.target.value / 100;
      GameState.applySettings();
      e.target.nextElementSibling.textContent = e.target.value + '%';
    });
    this.elements.particlesEnabled.addEventListener('change', (e) => {
      GameState.settings.particlesEnabled = e.target.checked;
      GameState.applySettings();
    });
    this.elements.screenShakeEnabled.addEventListener('change', (e) => {
      GameState.settings.screenShakeEnabled = e.target.checked;
    });
    this.elements.numberFormat.addEventListener('change', (e) => {
      GameState.settings.numberFormat = e.target.value;
      this.updateAll();
    });
    
    // Save/Load buttons
    Utils.$('#btnExportSave').addEventListener('click', () => this.exportSave());
    Utils.$('#btnImportSave').addEventListener('click', () => this.importSave());
    Utils.$('#btnResetGame').addEventListener('click', () => this.resetGame());
    
    // Prestige button
    this.elements.btnPrestige.addEventListener('click', () => this.handlePrestige());
  },

  startGame(isNew) {
    if (isNew) {
      GameState.reset();
    }
    AudioManager.init();
    AudioManager.resume();
    this.elements.menuScreen.classList.remove('active');
    this.elements.gameScreen.classList.add('active');
    this.renderUpgrades();
    this.renderProducers();
    this.updateEggAppearance();
    this.updateAll();
  },

  pauseGame() {
    GameState.save();
    this.elements.gameScreen.classList.remove('active');
    this.elements.menuScreen.classList.add('active');
    if (GameState.hasSave()) {
      this.elements.btnContinue.style.display = 'block';
    }
  },

  handleEggClick(e) {
    const result = GameState.handleClick();
    AudioManager.resume();
    
    if (result.isCrit) {
      AudioManager.playCritical();
      this.createClickEffect(e, result.value, true);
      if (GameState.settings.screenShakeEnabled) {
        this.screenShake();
      }
    } else {
      AudioManager.playClick();
      this.createClickEffect(e, result.value, false);
    }
    
    // Egg animation
    this.elements.mainEgg.style.animation = 'none';
    this.elements.mainEgg.offsetHeight;
    this.elements.mainEgg.style.animation = 'eggBounce 0.3s ease-out';
    
    // Particles
    const rect = this.elements.mainEgg.getBoundingClientRect();
    ParticleSystem.clickEffect(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      result.isCrit
    );
    
    this.updateAll();
  },

  createClickEffect(e, value, isCrit) {
    const container = this.elements.clickEffects;
    const rect = this.elements.eggContainer.getBoundingClientRect();
    
    const number = Utils.createElement('div', {
      className: `click-number ${isCrit ? 'crit' : ''}`,
      style: {
        left: (e.clientX - rect.left) + 'px',
        top: (e.clientY - rect.top) + 'px'
      }
    }, '+' + Utils.formatNumber(value, GameState.settings.numberFormat));
    
    container.appendChild(number);
    setTimeout(() => number.remove(), 1000);
  },

  screenShake() {
    document.body.style.animation = 'none';
    document.body.offsetHeight;
    document.body.style.animation = 'gentleShake 0.2s ease-out';
  },

  switchTab(tab) {
    this.currentTab = tab;
    Utils.$$('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    if (tab === 'prestige') {
      this.openModal('prestige');
    } else if (tab === 'eggs') {
      this.openModal('eggTypes');
    }
  },

  openModal(modalType) {
    this.closeAllModals();
    const modal = Utils.$(`#${modalType}Modal`);
    if (modal) {
      modal.classList.add('active');
      if (modalType === 'achievements') this.renderAchievements();
      if (modalType === 'prestige') this.updatePrestigeModal();
      if (modalType === 'eggTypes') this.renderEggTypes();
    }
  },

  closeAllModals() {
    Utils.$$('.modal').forEach(modal => modal.classList.remove('active'));
  },

  renderUpgrades() {
    const panel = this.elements.upgradesPanel;
    panel.innerHTML = '';
    
    GameData.upgrades.forEach((upgrade, index) => {
      const level = GameState.state.upgrades[upgrade.id] || 0;
      const cost = GameState.getUpgradeCost(upgrade.id);
      const canAfford = GameState.state.eggs >= cost;
      const isMaxed = level >= upgrade.maxLevel;
      
      const card = Utils.createElement('div', {
        className: `upgrade-card ${!canAfford && !isMaxed ? 'disabled' : ''} ${isMaxed ? 'purchased' : ''}`,
        style: { animationDelay: (index * 50) + 'ms' },
        onClick: () => {
          if (!isMaxed && GameState.purchaseUpgrade(upgrade.id)) {
            AudioManager.playPurchase();
            this.renderUpgrades();
            this.updateAll();
          } else if (!canAfford) {
            AudioManager.playError();
          }
        }
      });
      
      card.innerHTML = `
        <div class="card-icon upgrade-icon">${upgrade.icon}</div>
        <div class="card-info">
          <div class="card-name">${upgrade.name}</div>
          <div class="card-description">${upgrade.description}</div>
        </div>
        <div class="card-stats">
          <div class="card-cost ${canAfford ? 'affordable' : 'expensive'}">
            ${isMaxed ? 'MAXED' : Utils.formatNumber(cost, GameState.settings.numberFormat)}
          </div>
          <div class="card-owned">Level ${level}/${upgrade.maxLevel}</div>
        </div>
      `;
      
      panel.appendChild(card);
    });
  },

  renderProducers() {
    const panel = this.elements.producersPanel;
    panel.innerHTML = '';
    
    GameData.producers.forEach((producer, index) => {
      const count = GameState.state.producers[producer.id] || 0;
      const cost = GameState.getProducerCost(producer.id);
      const canAfford = GameState.state.eggs >= cost;
      const production = producer.baseProduction * count;
      
      const card = Utils.createElement('div', {
        className: `producer-card ${!canAfford ? 'disabled' : ''}`,
        style: { animationDelay: (index * 50) + 'ms' },
        onClick: () => {
          if (GameState.purchaseProducer(producer.id)) {
            AudioManager.playPurchase();
            this.renderProducers();
            this.updateAll();
          } else {
            AudioManager.playError();
          }
        }
      });
      
      card.innerHTML = `
        <div class="card-icon producer-icon">${producer.icon}</div>
        <div class="card-info">
          <div class="card-name">${producer.name}</div>
          <div class="card-description">${producer.description}</div>
        </div>
        <div class="card-stats">
          <div class="card-cost ${canAfford ? 'affordable' : 'expensive'}">
            ${Utils.formatNumber(cost, GameState.settings.numberFormat)}
          </div>
          <div class="card-owned">Owned: ${count}</div>
          ${count > 0 ? `<div class="card-production">+${Utils.formatNumber(production, GameState.settings.numberFormat)}/s</div>` : ''}
        </div>
      `;
      
      panel.appendChild(card);
    });
  },

  renderAchievements() {
    const grid = this.elements.achievementsGrid;
    grid.innerHTML = '';
    
    const counts = GameState.getAchievementCount();
    this.elements.achievementCount.textContent = counts.unlocked;
    this.elements.achievementTotal.textContent = counts.total;
    
    GameData.achievements.forEach(achievement => {
      const unlocked = GameState.state.achievements[achievement.id];
      
      const card = Utils.createElement('div', {
        className: `achievement-card ${unlocked ? 'unlocked' : 'locked'}`
      });
      
      card.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-name">${unlocked ? achievement.name : '???'}</div>
        <div class="achievement-description">${unlocked ? achievement.description : 'Keep playing to unlock'}</div>
      `;
      
      grid.appendChild(card);
    });
  },

  renderEggTypes() {
    const grid = this.elements.eggTypesGrid;
    grid.innerHTML = '';
    
    GameData.eggTypes.forEach(eggType => {
      const unlocked = GameState.state.unlockedEggTypes.includes(eggType.id);
      const isActive = GameState.state.currentEggType === eggType.id;
      
      const card = Utils.createElement('div', {
        className: `egg-type-card ${unlocked ? '' : 'locked'} ${isActive ? 'active' : ''}`,
        onClick: () => {
          if (unlocked && GameState.changeEggType(eggType.id)) {
            AudioManager.playPurchase();
            this.updateEggAppearance();
            this.renderEggTypes();
            this.updateAll();
          }
        }
      });
      
      card.innerHTML = `
        <div class="egg-type-preview" style="background: ${eggType.gradient}"></div>
        <div class="egg-type-name">${unlocked ? eggType.name : '???'}</div>
        <div class="egg-type-multiplier">${unlocked ? 'x' + eggType.multiplier : ''}</div>
        ${!unlocked ? `<div class="egg-type-requirement">Requires ${Utils.formatNumber(eggType.unlockRequirement, 'short')} eggs</div>` : ''}
      `;
      
      grid.appendChild(card);
    });
  },

  updateEggAppearance() {
    const eggType = GameData.eggTypes.find(e => e.id === GameState.state.currentEggType);
    if (eggType) {
      this.elements.mainEgg.style.background = eggType.gradient;
    }
  },

  updatePrestigeModal() {
    const reward = GameState.getPrestigeReward();
    const newMult = 1 + ((GameState.state.goldenEggs + reward) * GameData.prestige.bonusPerGoldenEgg);
    
    this.elements.prestigeReward.textContent = Utils.formatNumber(reward, GameState.settings.numberFormat);
    this.elements.newMultiplier.textContent = 'x' + newMult.toFixed(2);
    this.elements.btnPrestige.disabled = reward <= 0;
  },

  handlePrestige() {
    if (GameState.prestige()) {
      AudioManager.playPrestige();
      const rect = this.elements.mainEgg.getBoundingClientRect();
      ParticleSystem.prestigeEffect(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );
      this.closeAllModals();
      this.renderUpgrades();
      this.renderProducers();
      this.updateAll();
      this.showNotification('Prestige Complete!', 'You have been reborn with new power', 'success');
    }
  },

  showAchievement(achievement) {
    this.elements.achievementName.textContent = achievement.name;
    this.elements.achievementPopup.classList.remove('show');
    void this.elements.achievementPopup.offsetWidth;
    this.elements.achievementPopup.classList.add('show');
    setTimeout(() => {
      this.elements.achievementPopup.classList.remove('show');
    }, 4000);
  },

  showNotification(title, message, type = 'info') {
    const notification = Utils.createElement('div', {
      className: `notification ${type}`
    });
    
    notification.innerHTML = `
      <div class="notification-icon">${type === 'success' ? 'V' : type === 'warning' ? '!' : 'i'}</div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
    `;
    
    this.elements.notifications.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('removing');
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  },

  exportSave() {
    const saveData = GameState.exportSave();
    navigator.clipboard.writeText(saveData).then(() => {
      this.showNotification('Save Exported', 'Save data copied to clipboard', 'success');
    });
  },

  importSave() {
    const saveData = prompt('Paste your save data:');
    if (saveData && GameState.importSave(saveData)) {
      this.showNotification('Save Imported', 'Your progress has been restored', 'success');
      this.renderUpgrades();
      this.renderProducers();
      this.updateEggAppearance();
      this.updateAll();
    } else if (saveData) {
      this.showNotification('Import Failed', 'Invalid save data', 'error');
    }
  },

  resetGame() {
    if (confirm('Are you sure you want to reset ALL progress? This cannot be undone!')) {
      GameState.reset();
      this.showNotification('Game Reset', 'All progress has been cleared', 'warning');
      this.pauseGame();
    }
  },

  updateAll() {
    const format = GameState.settings.numberFormat;
    
    this.elements.eggCount.textContent = Utils.formatNumber(GameState.state.eggs, format);
    this.elements.goldenEggCount.textContent = Utils.formatNumber(GameState.state.goldenEggs, format);
    this.elements.prestigeLevel.textContent = GameState.state.prestigeCount;
    this.elements.perClickStat.textContent = Utils.formatNumber(GameState.getClickValue(), format);
    this.elements.perSecondStat.textContent = Utils.formatNumber(GameState.getEggsPerSecond(), format);
    
    const mult = GameState.getPrestigeMultiplier();
    if (mult > 1) {
      this.elements.multiplierDisplay.classList.add('visible');
      this.elements.multiplierDisplay.querySelector('.mult-value').textContent = 'x' + mult.toFixed(2);
    } else {
      this.elements.multiplierDisplay.classList.remove('visible');
    }
  }
};

window.UI = UI;

