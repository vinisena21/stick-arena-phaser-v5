# Stick Arena Phaser V5

Jogo web de luta estilo anime/ninja usando React + Vite + Phaser.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra o link que aparecer no terminal.

## Render

Build Command:

```bash
npm install && npm run build
```

Publish Directory:

```bash
dist
```

## Estrutura

```txt
src/
├── main.jsx
├── game.js
├── data/
│   ├── characters.js
│   ├── maps.js
│   └── weapons.js
├── scenes/
│   ├── BootScene.js
│   ├── MenuScene.js
│   ├── SelectScene.js
│   └── BattleScene.js
└── systems/
    ├── CombatSystem.js
    └── MobileControls.js
```

## Controles PC

- A/D: mover
- W: pular
- S: agachar
- J: ataque leve
- K: ataque forte
- L: especial
- Shift: dash
- B: defesa
