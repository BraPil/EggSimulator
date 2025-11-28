/* ============================================
   EGG SIMULATOR - PARTICLE SYSTEM
   ============================================ */

/**
 * Particle System for visual effects
 */
const ParticleSystem = {
  particles: [],
  canvas: null,
  ctx: null,
  enabled: true,
  animationId: null,
  
  /**
   * Initialize the particle system
   */
  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particleCanvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 50;
    `;
    
    document.getElementById('app').appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.startLoop();
  },

  /**
   * Resize canvas to match window
   */
  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);
  },

  /**
   * Start the animation loop
   */
  startLoop() {
    const loop = () => {
      this.update();
      this.render();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  },

  /**
   * Stop the animation loop
   */
  stopLoop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  /**
   * Update all particles
   */
  update() {
    const dt = 1 / 60; // Assume 60fps
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Update position
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      
      // Apply gravity
      p.vy += p.gravity * dt;
      
      // Update life
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      
      // Update size
      if (p.shrink) {
        p.size *= 0.98;
      }
      
      // Update rotation
      p.rotation += p.rotationSpeed * dt;
      
      // Remove dead particles
      if (p.life <= 0 || p.size < 0.1) {
        this.particles.splice(i, 1);
      }
    }
  },

  /**
   * Render all particles
   */
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (!this.enabled) return;
    
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = p.alpha;
      
      if (p.type === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.fill();
      } else if (p.type === 'star') {
        this.drawStar(0, 0, p.size, p.color);
      } else if (p.type === 'square') {
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      } else if (p.type === 'ring') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
      }
      
      this.ctx.restore();
    }
  },

  /**
   * Draw a star shape
   */
  drawStar(x, y, size, color) {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size / 2;
    
    this.ctx.beginPath();
    
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes - Math.PI / 2;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        this.ctx.moveTo(px, py);
      } else {
        this.ctx.lineTo(px, py);
      }
    }
    
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  },

  /**
   * Create a particle
   * @param {Object} options - Particle options
   */
  createParticle(options) {
    const defaults = {
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 10,
      color: '#f4a634',
      type: 'circle',
      life: 1,
      maxLife: 1,
      gravity: 0,
      shrink: false,
      rotation: 0,
      rotationSpeed: 0,
      alpha: 1
    };
    
    this.particles.push({ ...defaults, ...options, maxLife: options.life || 1 });
  },

  /**
   * Create a burst of particles at a position
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} options - Burst options
   */
  burst(x, y, options = {}) {
    if (!this.enabled) return;
    
    const count = options.count || 10;
    const colors = options.colors || ['#f4a634', '#ffc857', '#ff9500'];
    const speed = options.speed || 200;
    const size = options.size || 8;
    const life = options.life || 0.8;
    const gravity = options.gravity || 300;
    const types = options.types || ['circle'];
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Utils.random(-0.3, 0.3);
      const velocity = Utils.random(speed * 0.5, speed);
      
      this.createParticle({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: Utils.random(size * 0.5, size),
        color: colors[Utils.randomInt(0, colors.length - 1)],
        type: types[Utils.randomInt(0, types.length - 1)],
        life: Utils.random(life * 0.5, life),
        gravity,
        shrink: true,
        rotation: Utils.random(0, Math.PI * 2),
        rotationSpeed: Utils.random(-5, 5)
      });
    }
  },

  /**
   * Create click effect particles
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {boolean} isCrit - Is critical hit
   */
  clickEffect(x, y, isCrit = false) {
    if (!this.enabled) return;
    
    const colors = isCrit 
      ? ['#ffd700', '#ffe44d', '#ffb700', '#fff'] 
      : ['#f4a634', '#ffc857', '#ff9500', '#fff9e6'];
    
    this.burst(x, y, {
      count: isCrit ? 20 : 12,
      colors,
      speed: isCrit ? 300 : 200,
      size: isCrit ? 12 : 8,
      life: isCrit ? 1 : 0.7,
      gravity: 400,
      types: isCrit ? ['circle', 'star'] : ['circle']
    });
    
    // Add expanding ring
    this.createParticle({
      x,
      y,
      size: 10,
      color: isCrit ? '#ffd700' : '#f4a634',
      type: 'ring',
      life: 0.4,
      vx: 0,
      vy: 0,
      gravity: 0
    });
    
    // Animate ring expansion
    const ringParticle = this.particles[this.particles.length - 1];
    const expandRing = () => {
      if (ringParticle.life > 0) {
        ringParticle.size += 8;
        requestAnimationFrame(expandRing);
      }
    };
    expandRing();
  },

  /**
   * Create prestige effect
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  prestigeEffect(x, y) {
    if (!this.enabled) return;
    
    const colors = ['#ffd700', '#ffe44d', '#ffb700', '#fff', '#f4a634'];
    
    // Multiple bursts
    for (let burst = 0; burst < 3; burst++) {
      setTimeout(() => {
        this.burst(x, y, {
          count: 30,
          colors,
          speed: 400 + burst * 100,
          size: 15,
          life: 1.5,
          gravity: 200,
          types: ['circle', 'star', 'square']
        });
      }, burst * 100);
    }
    
    // Sparkle trail
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const angle = Utils.random(0, Math.PI * 2);
        const dist = Utils.random(50, 200);
        this.createParticle({
          x: x + Math.cos(angle) * dist,
          y: y + Math.sin(angle) * dist,
          size: Utils.random(3, 8),
          color: colors[Utils.randomInt(0, colors.length - 1)],
          type: 'star',
          life: Utils.random(0.5, 1),
          vx: Utils.random(-50, 50),
          vy: Utils.random(-100, -200),
          gravity: 100,
          rotationSpeed: Utils.random(-10, 10)
        });
      }, i * 20);
    }
  },

  /**
   * Create ambient floating particles
   */
  createAmbientParticles() {
    if (!this.enabled) return;
    
    const colors = ['rgba(244, 166, 52, 0.3)', 'rgba(255, 200, 87, 0.3)', 'rgba(45, 212, 191, 0.2)'];
    
    for (let i = 0; i < 20; i++) {
      this.createParticle({
        x: Utils.random(0, window.innerWidth),
        y: Utils.random(0, window.innerHeight),
        vx: Utils.random(-20, 20),
        vy: Utils.random(-30, -10),
        size: Utils.random(2, 5),
        color: colors[Utils.randomInt(0, colors.length - 1)],
        type: 'circle',
        life: Utils.random(3, 6),
        gravity: -5,
        shrink: false
      });
    }
  },

  /**
   * Enable/disable particle system
   * @param {boolean} enabled - Enable state
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.particles = [];
    }
  },

  /**
   * Clear all particles
   */
  clear() {
    this.particles = [];
  }
};

// Export for use in other modules
window.ParticleSystem = ParticleSystem;

