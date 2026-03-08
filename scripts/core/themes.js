function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
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
