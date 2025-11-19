# Accidental Magical Girl Build Generator

A React-based interactive build generator for the "Accidental Magical Girl" CYOA (Choose Your Own Adventure). This application allows users to roll for character stats, abilities, and equipment, and then modify their build using a coin-based system.

## Features

### 🎲 Character Generation
- **Automated Rolling**: Rolls 11d20 to generate your character's Age, Body Type, Specialization, Weapon, Outfit, Power, and 5 Perks.
- **Visual Feedback**: Displays rolls and their corresponding results clearly.
- **Stats Calculation**: Automatically calculates STR, AGI, VIT, MAG, and LCK based on your rolls and choices.

### 🪙 Coin System
Modify your build using the Bronze, Silver, and Gold coin mechanics:
- **Bronze Coins**: Small adjustments (e.g., +/- 1 to Age, reroll specific sections).
- **Silver Coins**: Moderate changes (e.g., choose specific Age, choose Body Type, choose Weapon category).
- **Gold Coins**: Major upgrades (e.g., Second Weapon, Second Power, Bonus Perks).
- **Stat Boosts**: Spend coins directly to increase stats (Bronze +1, Silver +2, Gold +4).

### ✨ Origin System
Select from various Origins, each with unique bonuses and negatives:
- **Contract**: Free picks on Uniform and Perk 5.
- **Smug**: Free picks for every choice (but fewer coins).
- **Weapon**: Free pick for Weapon + stat bonus.
- **Emergency**: Free picks on combat perks.
- **Artifact**: Replace perk with artifact.
- **Death**: Extra Silver coin.

### 🛠️ Advanced Mechanics
- **Free Pick System**: Origins like "Smug" or "Contract" allow you to bypass rolls and choose any option for specific categories.
- **Granular Undo**: Undo individual coin spends, including specific stat boosts, without resetting your entire build.
- **Smart Choices**: Context-aware modals for complex choices (e.g., selecting a specific stat for the "Oddball" specialization).

## Tech Stack
- **Frontend**: React, TypeScript, Vite
- **Styling**: CSS Modules / Vanilla CSS
- **State Management**: React Hooks

## Setup & Running

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Project Structure
- `src/components`: React components (BuildRoller, RollSection, etc.)
- `src/utils`: Helper functions for mechanics, state management, and calculations.
- `src/data`: Static game data (tables for Weapons, Powers, Perks, etc.).

## License
This project is a fan-made tool for the Accidental Magical Girl CYOA.
