const AppState = {
  getUsername() {
    return localStorage.getItem('pokemon-username') || '';
  },
  setUsername(name) {
    localStorage.setItem('pokemon-username', name);
  },

  getStars() {
    return parseInt(localStorage.getItem('pokemon-stars') || '0');
  },
  setStars(n) {
    localStorage.setItem('pokemon-stars', n.toString());
  },

  getGamesCompleted() {
    return parseInt(localStorage.getItem('pokemon-games') || '0');
  },
  incrementGamesCompleted() {
    const n = this.getGamesCompleted() + 1;
    localStorage.setItem('pokemon-games', n.toString());
    return n;
  },

  getAvatar() {
    return parseInt(localStorage.getItem('pokemon-avatar') || '0');
  },
  setAvatar(id) {
    localStorage.setItem('pokemon-avatar', id.toString());
  },

  getLastEvoLevel() {
    return parseInt(localStorage.getItem('pokemon-evo-level') || '0');
  },
  setLastEvoLevel(n) {
    localStorage.setItem('pokemon-evo-level', n.toString());
  },

  getTheme() {
    const saved = localStorage.getItem('pokemon-theme');
    if (saved && THEMES[saved]) return saved;
    const avatarId = this.getAvatar();
    if (avatarId) {
      const match = getThemeForPokemon(avatarId);
      if (match) return match;
    }
    return Object.keys(THEMES)[0];
  },
  setTheme(id) {
    localStorage.setItem('pokemon-theme', id);
  },

  getLayout() {
    const saved = localStorage.getItem('pokemon-layout');
    if (saved && LAYOUTS[saved]) return saved;
    return Object.keys(LAYOUTS)[0];
  },
  setLayout(id) {
    localStorage.setItem('pokemon-layout', id);
  },

  resetProgress() {
    localStorage.removeItem('pokemon-username');
    localStorage.removeItem('pokemon-stars');
    localStorage.removeItem('pokemon-games');
    localStorage.removeItem('pokemon-avatar');
    localStorage.removeItem('pokemon-evo-level');
    localStorage.removeItem('pokemon-theme');
    localStorage.removeItem('pokemon-layout');
  }
};
