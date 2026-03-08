const LAYOUT_RENDERERS = {};
let activeLayoutId = 'classic';
let layoutLink = null;
let layoutFontLink = null;

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
  layoutFontLink = document.createElement('link');
  layoutFontLink.rel = 'stylesheet';
  layoutFontLink.href = layout.fontUrl;
  document.head.appendChild(layoutFontLink);

  if (layoutLink) layoutLink.remove();
  if (layout.css) {
    layoutLink = document.createElement('link');
    layoutLink.rel = 'stylesheet';
    layoutLink.href = layout.css;
    document.head.appendChild(layoutLink);
  }

  AppState.setLayout(id);
}
