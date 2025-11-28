/* ============================================
   EGG SIMULATOR - UTILITY FUNCTIONS
   ============================================ */

/**
 * Utility namespace for common helper functions
 */
const Utils = {
  /**
   * Format large numbers for display
   * @param {number} num - The number to format
   * @param {string} format - Format type: 'standard', 'scientific', 'short'
   * @returns {string} Formatted number string
   */
  formatNumber(num, format = 'short') {
    if (num === null || num === undefined || isNaN(num)) return '0';
    
    if (format === 'scientific') {
      if (num < 1000) return Math.floor(num).toString();
      return num.toExponential(2);
    }
    
    if (format === 'standard') {
      return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    }
    
    // Short format (default)
    const suffixes = [
      { value: 1e33, suffix: 'D' },
      { value: 1e30, suffix: 'N' },
      { value: 1e27, suffix: 'O' },
      { value: 1e24, suffix: 'Sp' },
      { value: 1e21, suffix: 'Sx' },
      { value: 1e18, suffix: 'Qi' },
      { value: 1e15, suffix: 'Qa' },
      { value: 1e12, suffix: 'T' },
      { value: 1e9, suffix: 'B' },
      { value: 1e6, suffix: 'M' },
      { value: 1e3, suffix: 'K' }
    ];
    
    for (const { value, suffix } of suffixes) {
      if (num >= value) {
        const formatted = (num / value).toFixed(2);
        // Remove trailing zeros
        return parseFloat(formatted).toString() + suffix;
      }
    }
    
    return Math.floor(num).toLocaleString('en-US');
  },

  /**
   * Generate a unique ID
   * @returns {string} Unique identifier
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Clamp a value between min and max
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Clamped value
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  /**
   * Linear interpolation between two values
   * @param {number} start - Start value
   * @param {number} end - End value
   * @param {number} t - Interpolation factor (0-1)
   * @returns {number} Interpolated value
   */
  lerp(start, end, t) {
    return start + (end - start) * t;
  },

  /**
   * Easing function - ease out cubic
   * @param {number} t - Input (0-1)
   * @returns {number} Eased output
   */
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  },

  /**
   * Easing function - ease in out cubic
   * @param {number} t - Input (0-1)
   * @returns {number} Eased output
   */
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },

  /**
   * Get random number in range
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  random(min, max) {
    return Math.random() * (max - min) + min;
  },

  /**
   * Get random integer in range
   * @param {number} min - Minimum value (inclusive)
   * @param {number} max - Maximum value (inclusive)
   * @returns {number} Random integer
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Check if a random event should occur
   * @param {number} chance - Probability (0-1)
   * @returns {boolean} Whether event occurred
   */
  chance(probability) {
    return Math.random() < probability;
  },

  /**
   * Debounce a function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in ms
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle a function
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in ms
   * @returns {Function} Throttled function
   */
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Deep clone an object
   * @param {Object} obj - Object to clone
   * @returns {Object} Cloned object
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Get current timestamp
   * @returns {number} Unix timestamp in milliseconds
   */
  now() {
    return Date.now();
  },

  /**
   * Format time duration
   * @param {number} ms - Duration in milliseconds
   * @returns {string} Formatted duration
   */
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  },

  /**
   * Create DOM element with attributes
   * @param {string} tag - HTML tag name
   * @param {Object} attrs - Attributes to set
   * @param {string|Element|Array} children - Child content
   * @returns {Element} Created element
   */
  createElement(tag, attrs = {}, children = null) {
    const element = document.createElement(tag);
    
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(element.style, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (key === 'dataset') {
        Object.assign(element.dataset, value);
      } else {
        element.setAttribute(key, value);
      }
    }
    
    if (children !== null) {
      if (Array.isArray(children)) {
        children.forEach(child => {
          if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
          } else if (child instanceof Element) {
            element.appendChild(child);
          }
        });
      } else if (typeof children === 'string') {
        element.textContent = children;
      } else if (children instanceof Element) {
        element.appendChild(children);
      }
    }
    
    return element;
  },

  /**
   * Query selector shorthand
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element
   * @returns {Element|null} Found element
   */
  $(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * Query selector all shorthand
   * @param {string} selector - CSS selector
   * @param {Element} parent - Parent element
   * @returns {NodeList} Found elements
   */
  $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
  },

  /**
   * Add event listener shorthand
   * @param {Element|string} target - Element or selector
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   * @param {Object} options - Event options
   */
  on(target, event, handler, options = {}) {
    const element = typeof target === 'string' ? this.$(target) : target;
    if (element) {
      element.addEventListener(event, handler, options);
    }
  },

  /**
   * Remove event listener shorthand
   * @param {Element|string} target - Element or selector
   * @param {string} event - Event name
   * @param {Function} handler - Event handler
   */
  off(target, event, handler) {
    const element = typeof target === 'string' ? this.$(target) : target;
    if (element) {
      element.removeEventListener(event, handler);
    }
  },

  /**
   * Add class to element
   * @param {Element|string} target - Element or selector
   * @param {string} className - Class name
   */
  addClass(target, className) {
    const element = typeof target === 'string' ? this.$(target) : target;
    if (element) element.classList.add(className);
  },

  /**
   * Remove class from element
   * @param {Element|string} target - Element or selector
   * @param {string} className - Class name
   */
  removeClass(target, className) {
    const element = typeof target === 'string' ? this.$(target) : target;
    if (element) element.classList.remove(className);
  },

  /**
   * Toggle class on element
   * @param {Element|string} target - Element or selector
   * @param {string} className - Class name
   * @param {boolean} force - Force add/remove
   */
  toggleClass(target, className, force) {
    const element = typeof target === 'string' ? this.$(target) : target;
    if (element) element.classList.toggle(className, force);
  },

  /**
   * Check if element has class
   * @param {Element|string} target - Element or selector
   * @param {string} className - Class name
   * @returns {boolean} Has class
   */
  hasClass(target, className) {
    const element = typeof target === 'string' ? this.$(target) : target;
    return element ? element.classList.contains(className) : false;
  },

  /**
   * Local storage wrapper with JSON support
   */
  storage: {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn('Storage get error:', e);
        return defaultValue;
      }
    },
    
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn('Storage set error:', e);
        return false;
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.warn('Storage remove error:', e);
        return false;
      }
    },
    
    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (e) {
        console.warn('Storage clear error:', e);
        return false;
      }
    }
  }
};

// Export for use in other modules
window.Utils = Utils;

