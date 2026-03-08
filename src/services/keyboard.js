var HEBREW_TO_ENGLISH_KEYS = {
  'ש':'A','נ':'B','ב':'C','ג':'D','ק':'E','כ':'F','ע':'G','י':'H','ן':'I','ח':'J',
  'ל':'K','ך':'L','צ':'M','מ':'N','ם':'O','פ':'P','/':'Q','ר':'R','ד':'S','א':'T',
  'ו':'U','ה':'V','\'':'W','ס':'X','ט':'Y','ז':'Z'
};

document.addEventListener('keydown', function(e) {
  if (e.key === 'Backspace') {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (currentScreen !== 'menu' && currentScreen !== 'profile') {
      e.preventDefault();
      goHome();
    }
  }
});
