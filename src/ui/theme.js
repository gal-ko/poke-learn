function resolveTheme() {
  const saved = AppState.getTheme();
  if (saved && THEMES[saved]) return saved;
  const avatarId = AppState.getAvatar();
  if (avatarId) {
    const match = getThemeForPokemon(avatarId);
    if (match) return match;
  }
  return getThemeForPokemon(STARTER_POKEMON_IDS[0]) || Object.keys(THEMES)[0];
}

function applyTheme(id) {
  const theme = THEMES[id];
  if (!theme) return;
  const root = document.documentElement.style;
  root.setProperty('--bg-deep',      theme.bgDeep);
  root.setProperty('--bg-mid',       theme.bgMid);
  root.setProperty('--bg-surface',   theme.bgSurface);
  root.setProperty('--bg-deep-rgb',  hexToRgb(theme.bgDeep));
  root.setProperty('--accent',       theme.accent);
  root.setProperty('--accent-hover', theme.accentHover);
  root.setProperty('--accent-rgb',   hexToRgb(theme.accent));
  document.querySelector('html').style.background = theme.bgDeep;
  AppState.setTheme(id);
}

function getThemeForPokemon(pokemonId) {
  return Object.keys(THEMES).find(id => THEMES[id].pokemonId === pokemonId);
}

function applyThemeForPokemon(pokemonId) {
  const themeId = getThemeForPokemon(pokemonId);
  if (themeId) applyTheme(themeId);
}
