var LAYOUT_RENDERERS = {};
var activeLayoutId = 'classic';
var layoutFontLink = null;

function resolveLayout() {
  const saved = AppState.getLayout();
  if (saved && LAYOUTS[saved]) return saved;
  return Object.keys(LAYOUTS)[0];
}

function getActiveLayout() {
  return LAYOUT_RENDERERS[activeLayoutId] || LAYOUT_RENDERERS.classic || {};
}

function applyLayout(id) {
  const layout = LAYOUTS[id];
  if (!layout) return;

  const prev = getActiveLayout();
  if (prev.cleanupMenu) prev.cleanupMenu();

  activeLayoutId = id;

  document.documentElement.className =
    document.documentElement.className.replace(/\blayout-\S+/g, '').trim();
  document.documentElement.classList.add('layout-' + id);

  if (layoutFontLink) layoutFontLink.remove();
  if (layout.fontUrl) {
    layoutFontLink = document.createElement('link');
    layoutFontLink.rel = 'stylesheet';
    layoutFontLink.href = layout.fontUrl;
    document.head.appendChild(layoutFontLink);
  } else {
    layoutFontLink = null;
  }

  AppState.setLayout(id);
}
