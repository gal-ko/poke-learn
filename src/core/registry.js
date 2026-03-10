var SCREENS = {};

function addScreen(s) {
  SCREENS[s.id || s.screen] = {
    elementId: s.elementId || ((s.id || s.screen) + '-game'),
    display: s.display || 'block',
    showBack: s.showBack !== undefined ? s.showBack : true,
    showProfile: s.showProfile !== undefined ? s.showProfile : true,
    init: null,
    cleanup: null
  };
}

APP_SCREENS.forEach(addScreen);
MENU_CARDS.forEach(addScreen);

function registerScreen(id, opts) {
  if (!SCREENS[id]) return;
  if (opts.init) SCREENS[id].init = opts.init;
  if (opts.cleanup) SCREENS[id].cleanup = opts.cleanup;
}
