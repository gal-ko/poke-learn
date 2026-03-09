var AppState = {
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
    return localStorage.getItem('pokemon-theme') || null;
  },
  setTheme(id) {
    localStorage.setItem('pokemon-theme', id);
  },

  getLayout() {
    return localStorage.getItem('pokemon-layout') || null;
  },
  setLayout(id) {
    localStorage.setItem('pokemon-layout', id);
  },

  resetProgress() {
    ['username', 'stars', 'games', 'avatar', 'evo-level', 'theme'].forEach(
      key => localStorage.removeItem('pokemon-' + key)
    );
  }
};
