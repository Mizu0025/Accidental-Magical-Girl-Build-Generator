# 👑 Accidental Magical Girl Build Generator

A single-page application (SPA) for generating random character builds based on the "Accidental Magical Girl" CYOA (Choose Your Own Adventure). Roll the dice and discover your magical girl destiny!

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

- **Random Build Generation**: Roll 11d20 to generate a complete magical girl character
- **Interactive Table Display**: View all rolled results in an organized, easy-to-read table
- **Copy to Clipboard**: Export your build in a formatted text format with a single click
- **Responsive Design**: Beautiful blue-themed UI that works on all screen sizes
- **Visual Feedback**: Smooth animations and state changes for better UX

## 🎲 What Gets Generated

Each build includes:

1. **Age** (6-16 years old, immortal)
2. **Body Type** (Underdeveloped, Average, or Overdeveloped)
3. **Specialization** (Fire, Ice, Air, Spirit, and 16 more options)
4. **Weapon** (Melee, Ranged, Mystic, or Fist)
5. **Outfit** (Skimpy, Flowing, Elaborate, or Uniform)
6. **Power** (10 unique magical abilities)
7. **Perks** (5 perks: 2 Combat, 2 Support, 1 Wildcard)

Each category provides stat bonuses and unique characteristics to create a complete character profile.

## 🚀 Getting Started

### Prerequisites

No build tools or dependencies required! This is a vanilla HTML/CSS/JavaScript application.

### Installation

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Mizu0025/Accidental-Magical-Girl-Build-Generator.git
   cd AccidentalMahou
   ```

2. Open `index.html` in your web browser:
   ```bash
   # On Linux
   xdg-open index.html
   
   # On macOS
   open index.html
   
   # On Windows
   start index.html
   ```

   Or simply double-click `index.html` in your file explorer.

### Usage

1. Click the **"Generate Build"** button to roll a new character
2. Review your results in the table that appears
3. Use the **"Toggle Perk 5"** button to switch between Combat and Support options for the wildcard perk
4. Click **"Copy to Clipboard"** to export your build in text format
5. Generate as many builds as you like!

## 📁 Project Structure

```
AccidentalMahou/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Core application logic
├── accidentalMahou.md  # CYOA reference guide
└── README.md           # This file
```

## 🎨 Design Features

- **Modern Blue Theme**: Cohesive color scheme with gradient accents
- **Glassmorphism Effects**: Subtle backdrop blur and transparency
- **Smooth Animations**: Fade-in effects and button state transitions
- **Responsive Layout**: Adapts to different screen sizes
- **Text Wrapping**: Ensures all content is readable without cutoff
- **Dynamic Container**: Expands only after build generation

## 🔧 Technical Details

### Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox, gradients, and animations
- **Vanilla JavaScript**: No frameworks or libraries required

### Key Features

- **Dice Rolling**: Cryptographically random number generation using `Math.random()`
- **Data-Driven**: All CYOA data stored in structured JavaScript objects
- **State Management**: Tracks current build including both perk options
- **Clipboard API**: Modern browser clipboard integration
- **Event-Driven**: Responsive UI updates based on user interactions

### Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript (2015+)
- CSS Grid and Flexbox
- Clipboard API
- CSS Custom Properties (Variables)

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 📋 Export Format

When you copy a build to clipboard, it's formatted like this:

```
Dice rolls: 12 8 15 3 19 7 14 6 11 2 18

Age: 12 years old
Gender: Female
Body: Average
Specialisation: Water
Weapon: Melee
Outfit: Uniform
Power: Focused Assault
Perk 1: Ally (+1 Any)
Perk 2: Flexibility † (+1 AGI)
Perk 3: Closure † (+1 LCK)
Perk 4: Fated † (+1 LCK)
Perk 5A (Combat): Sorcery † (+1 MAG)
```

## 🎯 Roadmap

Potential future enhancements:

- [ ] Stat calculator to show final stat totals
- [ ] Coin spending system (Bronze, Silver, Gold)
- [ ] Build saving/loading functionality
- [ ] Share builds via URL
- [ ] Dark mode toggle
- [ ] Print-friendly stylesheet
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2025 Mizu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- Based on the "Accidental Magical Girl" CYOA
- Inspired by the magical girl genre and tabletop RPG character creation
- Built with ❤️ for the CYOA community

## 📞 Contact

- **GitHub**: [@Mizu0025](https://github.com/Mizu0025)
- **Repository**: [Accidental-Magical-Girl-Build-Generator](https://github.com/Mizu0025/Accidental-Magical-Girl-Build-Generator)

## 🐛 Known Issues

None at this time! If you find a bug, please open an issue on GitHub.

---

**Enjoy rolling your magical destiny!** ✨🎲
