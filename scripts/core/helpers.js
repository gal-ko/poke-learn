const SCREENS = {};

function addScreen(s) {
  SCREENS[s.id || s.screen] = {
    elementId: s.elementId || ((s.id || s.screen) + '-game'),
    display: s.display || 'block',
    showBack: s.showBack !== undefined ? s.showBack : true,
    showProfile: s.showProfile !== undefined ? s.showProfile : true,
    hideUsername: s.hideUsername || false,
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

function sprite(id) {
  return `sprites/${id}.png`;
}

const MAX_SPRITE_SCALE = 1;

function spriteScale(id, targetRatio) {
  targetRatio = targetRatio || 0.55;
  const pad = SPRITE_PAD[id];
  if (!pad) return 1;
  const opaqueW = SPRITE_SIZE - pad[3] - pad[1];
  const opaqueH = SPRITE_SIZE - pad[0] - pad[2];
  const maxDim = Math.max(opaqueW, opaqueH);
  const target = SPRITE_SIZE * targetRatio;
  return +Math.min(target / maxDim, MAX_SPRITE_SCALE).toFixed(2);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(a) {
  return a[Math.floor(Math.random() * a.length)];
}

const HEBREW_TO_ENGLISH_KEYS = {
  'ש':'A','נ':'B','ב':'C','ג':'D','ק':'E','כ':'F','ע':'G','י':'H','ן':'I','ח':'J',
  'ל':'K','ך':'L','צ':'M','מ':'N','ם':'O','פ':'P','/':'Q','ר':'R','ד':'S','א':'T',
  'ו':'U','ה':'V','\'':'W','ס':'X','ט':'Y','ז':'Z'
};

function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const pronMap = (typeof POKEMON_PRONUNCIATION !== 'undefined') ? POKEMON_PRONUNCIATION : {};
  let output = pronMap[text];
  if (!output) {
    output = text.replace(/[A-Z][a-z'-]*/g, w => pronMap[w] || w);
  }
  const u = new SpeechSynthesisUtterance(output);
  u.lang = 'en-US';
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}
