/* ============================================
   EGG SIMULATOR - MAIN ENTRY POINT
   The AAA Experience
   ============================================ */

/**
 * Main Game Controller
 */
const Game = {
  lastTime: 0,
  accumulator: 0,
  tickRate: 1 / 60, // 60 updates per second
  autoSaveTimer: 0,
  isRunning: false,

  /**
   * Initialize the game
   */
  init() {
    console.log('Egg Simulator v1.0.0 - Initializing...');
    
    // Initialize systems
    GameState.init();
    ParticleSystem.init();
    UI.init();
    
    // Check for existing save
    if (GameState.hasSave()) {
      Utils.$('#btnContinue').style.display = 'block';
    }
    
    // Start ambient particles
    setInterval(() => {
      if (this.isRunning) {
        ParticleSystem.createAmbientParticles();
      }
    }, 3000);
    
    // Start game loop
    this.lastTime = performance.now();
    this.isRunning = true;
    requestAnimationFrame((time) => this.gameLoop(time));
    
    console.log('Egg Simulator initialized successfully!');
  },

  /**
   * Main game loop
   * @param {number} currentTime - Current timestamp
   */
  gameLoop(currentTime) {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    // Clamp delta time to prevent huge jumps
    const clampedDelta = Math.min(deltaTime, 0.1);
    
    this.accumulator += clampedDelta;
    
    // Fixed timestep updates
    while (this.accumulator >= this.tickRate) {
      this.update(this.tickRate);
      this.accumulator -= this.tickRate;
    }
    
    // Auto-save
    this.autoSaveTimer += clampedDelta;
    if (this.autoSaveTimer >= GameData.balance.autoSaveInterval / 1000) {
      GameState.save();
      this.autoSaveTimer = 0;
    }
    
    // Continue loop
    requestAnimationFrame((time) => this.gameLoop(time));
  },

  /**
   * Update game state
   * @param {number} dt - Delta time in seconds
   */
  update(dt) {
    // Only update if game screen is active
    if (Utils.hasClass('#gameScreen', 'active')) {
      GameState.tick(dt);
      UI.updateAll();
    }
  }
};

// Start game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Game.init();
});

// Save on page unload
window.addEventListener('beforeunload', () => {
  GameState.save();
});

// Export for debugging
window.Game = Game;

