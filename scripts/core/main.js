let currentScreen = 'profile';

function runCleanups() {
  Object.values(SCREENS).forEach(s => { if (s.cleanup) s.cleanup(); });
}

function hideAllScreens() {
  Object.values(SCREENS).forEach(s => {
    const el = document.getElementById(s.elementId);
    if (el) {
      el.style.display = 'none';
      el.classList.remove('transition-fade', 'transition-slide-up', 'transition-warp');
    }
  });
  runCleanups();

  const layout = getActiveLayout();
  if (layout.cleanupMenu) layout.cleanupMenu();

  window.scrollTo(0, 0);
}

function updateTopbar() {
  const name = AppState.getUsername();
  const hasUser = !!name;
  document.getElementById('topbarUsername').textContent = name || '';
  document.getElementById('starCount').parentElement.style.display = hasUser ? '' : 'none';
  const titleBtn = document.getElementById('titleBtn');
  titleBtn.style.cursor = hasUser ? 'pointer' : 'default';
  titleBtn.onclick = hasUser ? goHome : null;
  const avatarId = AppState.getAvatar();
  if (avatarId) {
    const evolvedId = getEvolutionStage(avatarId, AppState.getStars());
    document.getElementById('topbarAvatar').src = sprite(evolvedId);
  }
}

function showScreen(name, pushState) {
  hideAllScreens();
  updateTopbar();

  const screen = SCREENS[name];
  if (!screen) return;

  const el = document.getElementById(screen.elementId);
  if (el) {
    el.style.display = screen.display;
    const layout = getActiveLayout();
    if (layout.transitionClass) {
      el.classList.add(layout.transitionClass);
    }
  }

  const backBtn = document.getElementById('backBtn');
  const profileBtn = document.getElementById('profileBtn');
  backBtn.style.display = screen.showBack ? 'inline-block' : 'none';
  if (screen.showBack) backBtn.onclick = () => showScreen('menu');
  profileBtn.style.display = screen.showProfile ? 'inline-flex' : 'none';
  if (screen.hideUsername) document.getElementById('topbarUsername').textContent = '';

  currentScreen = name;
  if (name === 'menu') { menuFocusIdx = -1; buildMenu(); }
  if (screen.init) screen.init();

  if (pushState !== false) {
    const hash = name === 'menu' ? '' : '#' + name;
    history.pushState({ screen: name }, '', location.pathname + hash);
  }
}

function buildMenu() {
  const menuEl = document.getElementById('menuScreen');
  if (!menuEl) return;

  const layout = getActiveLayout();
  if (layout.renderMenu) {
    layout.renderMenu(menuEl);
  } else {
    const renderCard = c => `
      <div class="game-card" onclick="startGame('${c.screen}')">
        <img src="${sprite(c.spriteId)}" alt="">
        <h3 class="pixel">${c.title}</h3>
        <p>${c.description}</p>
        <span class="card-stars">${c.stars}</span>
      </div>`;

    menuEl.innerHTML = `
      <h2 class="pixel">למד אנגלית עם פוקימון</h2>
      <p>בחר משחק כדי להתחיל ללמוד</p>
      <div class="game-grid">${MENU_CARDS.filter(c => c.group === 'scored').map(renderCard).join('')}</div>
      <div class="game-grid game-grid-free">${MENU_CARDS.filter(c => c.group === 'free').map(renderCard).join('')}</div>
    `;
  }
}

function showMenu() {
  showScreen('menu');
}

function goHome() {
  if (currentScreen !== 'menu') {
    showScreen('menu');
  }
}

function startGame(mode, pushState) {
  showScreen(mode, pushState);
}

function navigateToHash(hash) {
  const screen = hash.replace('#', '');
  if (SCREENS[screen]) {
    showScreen(screen, false);
  } else {
    showScreen(AppState.getUsername() ? 'menu' : 'profile', false);
  }
}

window.addEventListener('popstate', () => {
  navigateToHash(location.hash);
});

let menuFocusIdx = -1;

function getMenuCards() {
  return Array.from(document.querySelectorAll('#menuScreen .game-card'));
}

function updateMenuFocus() {
  const cards = getMenuCards();
  cards.forEach((c, i) => c.classList.toggle('focused', i === menuFocusIdx));
  if (cards[menuFocusIdx]) cards[menuFocusIdx].scrollIntoView({ block: 'nearest' });
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Backspace') {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (currentScreen !== 'menu' && currentScreen !== 'profile') {
      e.preventDefault();
      goHome();
    }
    return;
  }

  if (currentScreen !== 'menu') return;
  const cards = getMenuCards();
  if (!cards.length) return;

  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' ||
      e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    const cols = Math.round(cards[0].parentElement.clientWidth /
      cards[0].getBoundingClientRect().width);

    let dir = 0;
    if (e.key === 'ArrowRight') dir = -1;
    else if (e.key === 'ArrowLeft') dir = 1;
    else if (e.key === 'ArrowUp') dir = -cols;
    else if (e.key === 'ArrowDown') dir = cols;

    if (menuFocusIdx === -1) { menuFocusIdx = 0; }
    else { menuFocusIdx = Math.max(0, Math.min(cards.length - 1, menuFocusIdx + dir)); }
    updateMenuFocus();
    return;
  }

  if (e.key === 'Enter' || e.key === ' ') {
    if (menuFocusIdx === -1) return;
    e.preventDefault();
    cards[menuFocusIdx].click();
    return;
  }
});

onStarsChanged = () => {
  if (evoTimer) clearTimeout(evoTimer);
  evoTimer = setTimeout(checkStarEvolution, 3500);
};

onEvoComplete = () => updateTopbar();

function init() {
  applyTheme(AppState.getTheme());
  applyLayout(AppState.getLayout());
  buildMenu();
  document.getElementById('starCount').textContent = stars;
  syncEvoLevel();

  if (location.hash && AppState.getUsername()) {
    navigateToHash(location.hash);
  } else if (AppState.getUsername()) {
    showScreen('menu');
  } else {
    showScreen('profile');
  }
}

init();
