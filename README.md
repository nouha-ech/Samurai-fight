# Samurai Fight Game

![image](https://github.com/user-attachments/assets/8716bbef-644d-4d75-96bc-c698a91659c7)

A 2-player samurai dueling game built with [Kaboom.js](https://kaboomjs.com/), featuring animated characters, a health bar, and a countdown timer.

## Game Overview

**Samurai Fight Game** pits two players in a timed battle (60 second). Each can move, jump, and attack with custom animations. The game ends when a player’s health reaches zero or the timer runs out, declaring the player with the most health the winner.

## Installation

1. Clone the repo and install dependencies:
   ```bash
   git clone [<repository-url>](https://github.com/nouha-ech/Samurai-fight)
   npm install
   npm start
   ```

## Controls keys

- **for Player 1 (on left)**: `A` (left), `D` (right), `W` (jump), `Space` (attack)
- **Player 2 (on right)**: `←` (left), `→` (right), `↑` (jump), `↓` (attack)

## Core Features
![image](https://github.com/user-attachments/assets/ca2a1a9d-a69a-4ff6-9374-20a6d41a88fe)


- **Animations**: Idle, jump, attack, and death animations for both players.
- **Health and Timer**: Players lose health with each hit. The timer ends the game when it reaches zero.
- **Environment**: Parallax backgrounds, ground layers, and obstacles.

## Functions

- `makePlayer(...)`: Creates players with animations and health.
- `run(...)`: Moves players with a running animation.
- `attack(...)`: Triggers attack animation and creates hitboxes.
- `declareWinner(...)`: Determines winner based on health or time remaining.


