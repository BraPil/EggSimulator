# Egg Simulator: The AAA Video Game

A visually stunning, feature-rich browser-based idle/clicker game built with vanilla HTML, CSS, and JavaScript.

---

## Features

### Core Gameplay
- **Click to Collect**: Tap the egg to collect eggs
- **Critical Hits**: Chance for 10x damage clicks
- **Golden Clicks**: Chance for 5x value clicks
- **Passive Production**: Buy producers for automatic egg generation

### Progression Systems
- **8 Egg Types**: From Regular to Golden, each with increasing multipliers
- **8 Upgrades**: Enhance clicking power, critical chance, production speed, and more
- **8 Producers**: From humble Chickens to reality-bending Egg Universes
- **Prestige System**: Reset progress for permanent Golden Egg multipliers

### Visual Excellence
- Animated gradient background with floating orbs
- Particle effects on every click
- Smooth CSS animations throughout
- Responsive design for all screen sizes

### Audio
- Synthesized sound effects using Web Audio API
- Separate volume controls for master, SFX, and music

### Save System
- Automatic saving every 30 seconds
- Manual export/import functionality
- Offline progress calculation (up to 24 hours)

### Achievements
- 25 achievements to unlock
- Categories: Eggs, Clicks, Producers, Upgrades, Prestige, Special

---

## Getting Started

### Quick Start

1. Open `src/index.html` in a modern web browser
2. Click "New Game" to start
3. Click the egg to collect eggs!

### Using a Local Server (Recommended)

For the best experience, serve the files using a local server:

```bash
# Using Python 3
cd src
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server src

# Using PHP
cd src
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

---

## Game Guide

### Basics
- **Click the Egg**: Each click generates eggs based on your click power
- **Buy Producers**: Producers generate eggs automatically
- **Buy Upgrades**: Upgrades improve clicking and production

### Egg Types
Unlock new egg types by collecting total eggs:
- Regular Egg (x1) - Start
- Brown Egg (x1.5) - 1,000 eggs
- Blue Egg (x2) - 10,000 eggs
- Jade Egg (x3) - 100,000 eggs
- Mystic Egg (x5) - 1,000,000 eggs
- Rainbow Egg (x10) - 10,000,000 eggs
- Cosmic Egg (x25) - 100,000,000 eggs
- Golden Egg (x50) - 1,000,000,000 eggs

### Prestige
When you have collected enough eggs, you can prestige to:
- Reset your eggs, upgrades, and producers
- Earn Golden Eggs based on total eggs collected
- Gain permanent multipliers (1% per Golden Egg)

---

## Technical Details

### Architecture
- **Vanilla JavaScript**: No frameworks or dependencies
- **CSS Custom Properties**: Themeable design system
- **Web Audio API**: Synthesized sound effects
- **Canvas API**: Particle effects system
- **Local Storage**: Save game persistence

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### File Structure
```
src/
  index.html          # Main HTML structure
  css/
    main.css          # Core styles and theme
    animations.css    # Animation keyframes
    components.css    # UI components
  js/
    utils.js          # Utility functions
    audio.js          # Audio system
    particles.js      # Particle effects
    gameData.js       # Static game data
    gameState.js      # State management
    ui.js             # UI rendering
    main.js           # Game loop
```

---

## Project Protocols

This project uses a structured protocol system for AI-assisted development:

- `protocols/master_protocol.md` - Central protocol and prime directive
- `protocols/*_sub_protocol.md` - Sub-protocols for specific tasks
- `indexes/` - Tool and reference material indexes
- `logs/` - Session and task logs

See `.vscode/copilot-instructions.md` for full details.

---

## Credits

Created as part of the Egg Simulator project.

**Version**: 1.0.0
**Last Updated**: 2025-11-28

---

## License

This project is provided as-is for educational and entertainment purposes.
