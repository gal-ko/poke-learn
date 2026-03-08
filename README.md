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
├── index.html          # App entry point
├── styles/             # CSS — core variables, per-screen layouts, themes, animations
├── scripts/
│   ├── core/           # App bootstrap, state management, rewards, evolution
│   ├── data/           # Pokemon data and sprite metadata
│   ├── games/          # One folder per activity (spelling, memory, vocabulary, …)
│   ├── manifests/      # Config registries for themes, layouts, screens
│   └── layouts/        # Menu renderers
├── sprites/            # Pokemon artwork (sourced from PokeAPI)
└── tools/              # Helper scripts for asset processing
```

## Legal Note

Pokemon and Pokemon character names are trademarks of Nintendo, Game Freak, and The Pokemon Company. Sprite assets are sourced from [PokeAPI/sprites](https://github.com/PokeAPI/sprites). This is a non-commercial educational project — no revenue or ads.
