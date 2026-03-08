var currentScreen = 'profile';

var _buildMenu = null;
function setBuildMenu(fn) { _buildMenu = fn; }

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

function showScreen(name, pushState) {
  hideAllScreens();
  updateTopbar();

  const titleBtn = document.getElementById('titleBtn');
  titleBtn.onclick = AppState.getUsername() ? goHome : null;

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
  if (name === 'menu' && _buildMenu) _buildMenu();
  if (screen.init) screen.init();

  if (pushState !== false) {
    const hash = name === 'menu' ? '' : '#' + name;
    history.pushState({ screen: name }, '', location.pathname + hash);
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
