# Poke-Learn

A free, Pokemon-themed English learning app for Hebrew-speaking kids.

**[Play now](https://gal-ko.github.io/poke-learn/)**

## Features

- **6 learning activities** — Spelling, Match, Sentence Completion, Vocabulary, Alphabet, and Pokedex
- **Hebrew RTL support** — fully right-to-left UI with Hebrew instructions and translations
- **Text-to-speech** — hear English words pronounced out loud
- **Gamification** — earn stars, evolve your avatar, track your progress
- **Themes & layouts** — choose from multiple Pokemon-themed color schemes

## Project Structure

```
poke-learn/
├── index.html              # Entry point — loads CSS and all scripts in order
├── sprites/                # Pokemon artwork (sourced from PokeAPI)
├── tools/                  # Helper scripts for asset processing
└── src/
    ├── main.js             # App initialization and event wiring
    ├── config/             # Static configuration (themes, layouts, screens, cards)
    ├── data/               # Domain data (Pokemon list, types, sprite metadata)
    ├── core/               # Infrastructure (state, event bus, screen registry, router)
    ├── services/           # Cross-cutting capabilities (speech, sprites, keyboard)
    ├── ui/                 # Shared UI systems (theme, layout, rewards, evolution, top bar)
    ├── utils/              # Pure utility functions (array, color, strings)
    ├── styles/             # CSS — variables, base, animations, responsive, layout themes
    │   └── layouts/        # Layout-specific styles (classic, material)
    └── features/           # One folder per screen/activity
        ├── profile/        # User profile and setup
        ├── menu/           # Game menu and layout renderers
        ├── vocabulary/     # Word learning
        ├── spelling/       # Spelling game
        ├── memory/         # Name-to-image matching
        ├── sentence-completion/  # Fill-in-the-blank
        ├── alphabet/       # Letter exploration
        └── pokedex/        # Pokemon reference
```

Each feature folder contains its own `index.js` (logic), `template.js` (HTML), optional `data.js`, and co-located CSS.

## Legal Note

Pokemon and Pokemon character names are trademarks of Nintendo, Game Freak, and The Pokemon Company. Sprite assets are sourced from [PokeAPI/sprites](https://github.com/PokeAPI/sprites). This is a non-commercial educational project — no revenue or ads.
