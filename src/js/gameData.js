/* ============================================
   EGG SIMULATOR - GAME DATA
   Static game configuration and definitions
   ============================================ */

const GameData = {
  /**
   * Egg type definitions
   * Each egg type has different visuals and multipliers
   */
  eggTypes: [
    {
      id: 'regular',
      name: 'Regular Egg',
      multiplier: 1,
      gradient: 'linear-gradient(160deg, #fffef5 0%, #fff9e6 20%, #ffefc2 40%, #ffc857 70%, #f4a634 100%)',
      unlockRequirement: 0,
      description: 'A humble beginning'
    },
    {
      id: 'brown',
      name: 'Brown Egg',
      multiplier: 1.5,
      gradient: 'linear-gradient(160deg, #f5e6d3 0%, #e6d5c3 20%, #d4b896 40%, #c4a882 70%, #a08060 100%)',
      unlockRequirement: 1000,
      description: 'Farm fresh quality'
    },
    {
      id: 'blue',
      name: 'Blue Egg',
      multiplier: 2,
      gradient: 'linear-gradient(160deg, #e6f3ff 0%, #cce5ff 20%, #99ccff 40%, #66b3ff 70%, #3399ff 100%)',
      unlockRequirement: 10000,
      description: 'Rare and beautiful'
    },
    {
      id: 'green',
      name: 'Jade Egg',
      multiplier: 3,
      gradient: 'linear-gradient(160deg, #e6fff0 0%, #ccffe0 20%, #99ffc2 40%, #66ff99 70%, #33cc66 100%)',
      unlockRequirement: 100000,
      description: 'Ancient wisdom'
    },
    {
      id: 'purple',
      name: 'Mystic Egg',
      multiplier: 5,
      gradient: 'linear-gradient(160deg, #f3e6ff 0%, #e6ccff 20%, #cc99ff 40%, #b366ff 70%, #9933ff 100%)',
      unlockRequirement: 1000000,
      description: 'Touched by magic'
    },
    {
      id: 'rainbow',
      name: 'Rainbow Egg',
      multiplier: 10,
      gradient: 'linear-gradient(160deg, #ff6b6b 0%, #ffd93d 20%, #6bcb77 40%, #4d96ff 60%, #9b59b6 80%, #ff6b6b 100%)',
      unlockRequirement: 10000000,
      description: 'Legendary beauty'
    },
    {
      id: 'cosmic',
      name: 'Cosmic Egg',
      multiplier: 25,
      gradient: 'linear-gradient(160deg, #0a0a20 0%, #1a1a40 20%, #2a2a60 40%, #4a4a80 60%, #6a6aa0 80%, #8a8ac0 100%)',
      unlockRequirement: 100000000,
      description: 'Born from stars'
    },
    {
      id: 'golden',
      name: 'Golden Egg',
      multiplier: 50,
      gradient: 'linear-gradient(160deg, #fffef5 0%, #fff9c4 20%, #ffd700 40%, #ffb700 70%, #cc9900 100%)',
      unlockRequirement: 1000000000,
      description: 'Ultimate perfection'
    }
  ],

  /**
   * Upgrade definitions
   * Upgrades improve click power or provide bonuses
   */
  upgrades: [
    {
      id: 'stronger_clicks',
      name: 'Stronger Clicks',
      description: 'Double your clicking power',
      baseCost: 100,
      costMultiplier: 2.5,
      effect: { type: 'click_multiplier', value: 2 },
      maxLevel: 20,
      icon: 'C'
    },
    {
      id: 'golden_touch',
      name: 'Golden Touch',
      description: '+10% chance for golden clicks (5x value)',
      baseCost: 500,
      costMultiplier: 3,
      effect: { type: 'golden_chance', value: 0.1 },
      maxLevel: 10,
      icon: 'G'
    },
    {
      id: 'egg_polish',
      name: 'Egg Polish',
      description: '+25% to all egg production',
      baseCost: 1000,
      costMultiplier: 2.8,
      effect: { type: 'production_multiplier', value: 0.25 },
      maxLevel: 15,
      icon: 'P'
    },
    {
      id: 'lucky_egg',
      name: 'Lucky Egg',
      description: '+5% critical click chance (10x value)',
      baseCost: 2500,
      costMultiplier: 3.5,
      effect: { type: 'crit_chance', value: 0.05 },
      maxLevel: 10,
      icon: 'L'
    },
    {
      id: 'egg_magnet',
      name: 'Egg Magnet',
      description: '+1 egg per second passively',
      baseCost: 5000,
      costMultiplier: 2.2,
      effect: { type: 'passive_eggs', value: 1 },
      maxLevel: 50,
      icon: 'M'
    },
    {
      id: 'time_warp',
      name: 'Time Warp',
      description: 'Producers work 10% faster',
      baseCost: 10000,
      costMultiplier: 3,
      effect: { type: 'speed_multiplier', value: 0.1 },
      maxLevel: 10,
      icon: 'T'
    },
    {
      id: 'egg_overflow',
      name: 'Egg Overflow',
      description: 'Clicks also give 1% of eggs per second',
      baseCost: 25000,
      costMultiplier: 4,
      effect: { type: 'click_eps_bonus', value: 0.01 },
      maxLevel: 10,
      icon: 'O'
    },
    {
      id: 'prestige_power',
      name: 'Prestige Power',
      description: '+10% bonus from golden eggs',
      baseCost: 100000,
      costMultiplier: 5,
      effect: { type: 'prestige_bonus', value: 0.1 },
      maxLevel: 10,
      icon: 'X'
    }
  ],

  /**
   * Producer definitions
   * Producers generate eggs automatically
   */
  producers: [
    {
      id: 'chicken',
      name: 'Chicken',
      description: 'A simple hen laying eggs',
      baseCost: 50,
      costMultiplier: 1.15,
      baseProduction: 1,
      icon: 'H'
    },
    {
      id: 'coop',
      name: 'Chicken Coop',
      description: 'Houses multiple chickens',
      baseCost: 300,
      costMultiplier: 1.15,
      baseProduction: 5,
      icon: 'C'
    },
    {
      id: 'farm',
      name: 'Egg Farm',
      description: 'Industrial egg production',
      baseCost: 2000,
      costMultiplier: 1.15,
      baseProduction: 25,
      icon: 'F'
    },
    {
      id: 'factory',
      name: 'Egg Factory',
      description: 'Automated egg assembly line',
      baseCost: 15000,
      costMultiplier: 1.15,
      baseProduction: 100,
      icon: 'A'
    },
    {
      id: 'lab',
      name: 'Egg Laboratory',
      description: 'Scientific egg synthesis',
      baseCost: 100000,
      costMultiplier: 1.15,
      baseProduction: 500,
      icon: 'L'
    },
    {
      id: 'portal',
      name: 'Egg Portal',
      description: 'Imports eggs from other dimensions',
      baseCost: 1000000,
      costMultiplier: 1.15,
      baseProduction: 2500,
      icon: 'P'
    },
    {
      id: 'singularity',
      name: 'Egg Singularity',
      description: 'Bends reality to create eggs',
      baseCost: 10000000,
      costMultiplier: 1.15,
      baseProduction: 15000,
      icon: 'S'
    },
    {
      id: 'universe',
      name: 'Egg Universe',
      description: 'An entire universe of eggs',
      baseCost: 100000000,
      costMultiplier: 1.15,
      baseProduction: 100000,
      icon: 'U'
    }
  ],

  /**
   * Achievement definitions
   */
  achievements: [
    // Egg count achievements
    { id: 'first_egg', name: 'First Egg', description: 'Collect your first egg', condition: { type: 'total_eggs', value: 1 }, icon: '1' },
    { id: 'hundred_eggs', name: 'Egg Collector', description: 'Collect 100 eggs', condition: { type: 'total_eggs', value: 100 }, icon: 'C' },
    { id: 'thousand_eggs', name: 'Egg Hoarder', description: 'Collect 1,000 eggs', condition: { type: 'total_eggs', value: 1000 }, icon: 'H' },
    { id: 'million_eggs', name: 'Egg Millionaire', description: 'Collect 1,000,000 eggs', condition: { type: 'total_eggs', value: 1000000 }, icon: 'M' },
    { id: 'billion_eggs', name: 'Egg Billionaire', description: 'Collect 1,000,000,000 eggs', condition: { type: 'total_eggs', value: 1000000000 }, icon: 'B' },
    
    // Click achievements
    { id: 'first_click', name: 'Clicker', description: 'Click the egg', condition: { type: 'total_clicks', value: 1 }, icon: 'K' },
    { id: 'hundred_clicks', name: 'Dedicated Clicker', description: 'Click 100 times', condition: { type: 'total_clicks', value: 100 }, icon: 'D' },
    { id: 'thousand_clicks', name: 'Click Master', description: 'Click 1,000 times', condition: { type: 'total_clicks', value: 1000 }, icon: 'T' },
    { id: 'ten_thousand_clicks', name: 'Click Legend', description: 'Click 10,000 times', condition: { type: 'total_clicks', value: 10000 }, icon: 'L' },
    
    // Producer achievements
    { id: 'first_chicken', name: 'Farmer', description: 'Buy your first chicken', condition: { type: 'producer_owned', producer: 'chicken', value: 1 }, icon: 'F' },
    { id: 'chicken_army', name: 'Chicken Army', description: 'Own 50 chickens', condition: { type: 'producer_owned', producer: 'chicken', value: 50 }, icon: 'A' },
    { id: 'first_factory', name: 'Industrialist', description: 'Build an egg factory', condition: { type: 'producer_owned', producer: 'factory', value: 1 }, icon: 'I' },
    { id: 'first_portal', name: 'Dimensional', description: 'Open an egg portal', condition: { type: 'producer_owned', producer: 'portal', value: 1 }, icon: 'P' },
    { id: 'first_universe', name: 'Cosmic Creator', description: 'Create an egg universe', condition: { type: 'producer_owned', producer: 'universe', value: 1 }, icon: 'U' },
    
    // Upgrade achievements
    { id: 'first_upgrade', name: 'Upgraded', description: 'Purchase your first upgrade', condition: { type: 'total_upgrades', value: 1 }, icon: 'U' },
    { id: 'ten_upgrades', name: 'Enhanced', description: 'Purchase 10 upgrades', condition: { type: 'total_upgrades', value: 10 }, icon: 'E' },
    { id: 'max_upgrade', name: 'Maxed Out', description: 'Max out any upgrade', condition: { type: 'max_upgrade', value: 1 }, icon: 'X' },
    
    // Prestige achievements
    { id: 'first_prestige', name: 'Reborn', description: 'Prestige for the first time', condition: { type: 'prestige_count', value: 1 }, icon: 'R' },
    { id: 'five_prestige', name: 'Experienced', description: 'Prestige 5 times', condition: { type: 'prestige_count', value: 5 }, icon: 'V' },
    { id: 'golden_collector', name: 'Golden Collector', description: 'Collect 100 golden eggs', condition: { type: 'golden_eggs', value: 100 }, icon: 'G' },
    
    // Egg type achievements
    { id: 'unlock_blue', name: 'Rare Find', description: 'Unlock the Blue Egg', condition: { type: 'egg_unlocked', egg: 'blue' }, icon: 'B' },
    { id: 'unlock_rainbow', name: 'Rainbow Seeker', description: 'Unlock the Rainbow Egg', condition: { type: 'egg_unlocked', egg: 'rainbow' }, icon: 'W' },
    { id: 'unlock_golden', name: 'Golden Age', description: 'Unlock the Golden Egg', condition: { type: 'egg_unlocked', egg: 'golden' }, icon: 'G' },
    
    // Special achievements
    { id: 'speed_demon', name: 'Speed Demon', description: 'Click 10 times in 1 second', condition: { type: 'clicks_per_second', value: 10 }, icon: 'S' },
    { id: 'patient', name: 'Patient', description: 'Play for 1 hour', condition: { type: 'play_time', value: 3600 }, icon: 'P' },
    { id: 'dedicated', name: 'Dedicated', description: 'Play for 10 hours', condition: { type: 'play_time', value: 36000 }, icon: 'D' }
  ],

  /**
   * Prestige configuration
   */
  prestige: {
    baseRequirement: 1000000, // Eggs needed for first golden egg
    scalingFactor: 1.5,      // How much harder each golden egg is
    bonusPerGoldenEgg: 0.01  // 1% bonus per golden egg
  },

  /**
   * Game balance constants
   */
  balance: {
    baseClickValue: 1,
    critMultiplier: 10,
    goldenMultiplier: 5,
    offlineEarningsRate: 0.1, // 10% of normal rate while offline
    maxOfflineHours: 24,
    autoSaveInterval: 30000  // 30 seconds
  }
};

// Freeze the data to prevent accidental modifications
Object.freeze(GameData);
Object.freeze(GameData.eggTypes);
Object.freeze(GameData.upgrades);
Object.freeze(GameData.producers);
Object.freeze(GameData.achievements);
Object.freeze(GameData.prestige);
Object.freeze(GameData.balance);

// Export for use in other modules
window.GameData = GameData;

