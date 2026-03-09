var LAYOUT_RENDERERS = {};
var activeLayoutId = 'classic';

function resolveLayout() {
  return 'classic';
}

function getActiveLayout() {
  return LAYOUT_RENDERERS.classic || {};
}

function applyLayout(id) {
  activeLayoutId = 'classic';
  document.documentElement.className =
    document.documentElement.className.replace(/\blayout-\S+/g, '').trim();
  document.documentElement.classList.add('layout-classic');
  AppState.setLayout('classic');
}
