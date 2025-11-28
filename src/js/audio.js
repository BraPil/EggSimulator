/* ============================================
   EGG SIMULATOR - AUDIO SYSTEM
   ============================================ */

/**
 * Audio Manager for handling all game sounds
 * Uses Web Audio API for high-quality audio synthesis
 */
const AudioManager = {
  context: null,
  masterGain: null,
  sfxGain: null,
  musicGain: null,
  initialized: false,
  
  // Volume settings (0-1)
  volumes: {
    master: 0.8,
    sfx: 1.0,
    music: 0.6
  },

  /**
   * Initialize the audio system
   */
  init() {
    if (this.initialized) return;
    
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create gain nodes
      this.masterGain = this.context.createGain();
      this.sfxGain = this.context.createGain();
      this.musicGain = this.context.createGain();
      
      // Connect gain chain
      this.sfxGain.connect(this.masterGain);
      this.musicGain.connect(this.masterGain);
      this.masterGain.connect(this.context.destination);
      
      // Set initial volumes
      this.updateVolumes();
      
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  },

  /**
   * Resume audio context (required after user interaction)
   */
  async resume() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  },

  /**
   * Update all volume levels
   */
  updateVolumes() {
    if (!this.initialized) return;
    
    this.masterGain.gain.value = this.volumes.master;
    this.sfxGain.gain.value = this.volumes.sfx;
    this.musicGain.gain.value = this.volumes.music;
  },

  /**
   * Set master volume
   * @param {number} value - Volume (0-1)
   */
  setMasterVolume(value) {
    this.volumes.master = Utils.clamp(value, 0, 1);
    this.updateVolumes();
  },

  /**
   * Set SFX volume
   * @param {number} value - Volume (0-1)
   */
  setSfxVolume(value) {
    this.volumes.sfx = Utils.clamp(value, 0, 1);
    this.updateVolumes();
  },

  /**
   * Set music volume
   * @param {number} value - Volume (0-1)
   */
  setMusicVolume(value) {
    this.volumes.music = Utils.clamp(value, 0, 1);
    this.updateVolumes();
  },

  /**
   * Play a synthesized click sound
   */
  playClick() {
    if (!this.initialized) return;
    this.resume();
    
    const now = this.context.currentTime;
    
    // Create oscillator for the click
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start(now);
    osc.stop(now + 0.1);
  },

  /**
   * Play a critical hit sound
   */
  playCritical() {
    if (!this.initialized) return;
    this.resume();
    
    const now = this.context.currentTime;
    
    // Higher pitched, more exciting sound
    const osc1 = this.context.createOscillator();
    const osc2 = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.exponentialRampToValueAtTime(600, now + 0.15);
    
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1800, now);
    osc2.frequency.exponentialRampToValueAtTime(900, now + 0.15);
    
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.2);
    osc2.stop(now + 0.2);
  },

  /**
   * Play purchase sound
   */
  playPurchase() {
    if (!this.initialized) return;
    this.resume();
    
    const now = this.context.currentTime;
    
    // Ascending tone
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.15);
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start(now);
    osc.stop(now + 0.2);
  },

  /**
   * Play error/denied sound
   */
  playError() {
    if (!this.initialized) return;
    this.resume();
    
    const now = this.context.currentTime;
    
    // Low buzz
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start(now);
    osc.stop(now + 0.15);
  },

  /**
   * Play achievement unlock sound
   */
  playAchievement() {
    if (!this.initialized) return;
    this.resume();
    
    const now = this.context.currentTime;
    
    // Triumphant fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    notes.forEach((freq, i) => {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = now + i * 0.1;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  },

  /**
   * Play prestige sound
   */
  playPrestige() {
    if (!this.initialized) return;
    this.resume();
    
    const now = this.context.currentTime;
    
    // Epic whoosh with shimmer
    const osc1 = this.context.createOscillator();
    const osc2 = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(100, now);
    osc1.frequency.exponentialRampToValueAtTime(2000, now + 0.5);
    
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(200, now);
    osc2.frequency.exponentialRampToValueAtTime(4000, now + 0.5);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(8000, now + 0.3);
    filter.frequency.exponentialRampToValueAtTime(2000, now + 0.5);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  },

  /**
   * Play UI hover sound
   */
  playHover() {
    if (!this.initialized) return;
    this.resume();
    
    const now = this.context.currentTime;
    
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = 600;
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.connect(gain);
    gain.connect(this.sfxGain);
    
    osc.start(now);
    osc.stop(now + 0.05);
  },

  /**
   * Play level up sound
   */
  playLevelUp() {
    if (!this.initialized) return;
    this.resume();
    
    const now = this.context.currentTime;
    
    // Ascending arpeggio
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
    
    notes.forEach((freq, i) => {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      const startTime = now + i * 0.08;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }
};

// Export for use in other modules
window.AudioManager = AudioManager;

