function spriteUrl(id) {
  return 'sprites/' + id + '.png';
}

function sprite(id, extraClass, extraStyle) {
  var pos = SPRITE_POS[id];
  if (!pos) return '';
  var xPct = SPRITE_SHEET_COLS <= 1 ? '0' : (pos[0] / (SPRITE_SHEET_COLS - 1) * 100) + '%';
  var yPct = SPRITE_SHEET_ROWS <= 1 ? '0' : (pos[1] / (SPRITE_SHEET_ROWS - 1) * 100) + '%';
  var cls = 'poke-sprite' + (extraClass ? ' ' + extraClass : '');
  var style = 'background-position:' + xPct + ' ' + yPct;
  if (extraStyle) style += ';' + extraStyle;
  return '<span class="' + cls + '" style="' + style + '"></span>';
}

function setSprite(el, id) {
  var pos = SPRITE_POS[id];
  if (!pos || !el) return;
  if (!el.classList.contains('poke-sprite')) el.classList.add('poke-sprite');
  var xPct = SPRITE_SHEET_COLS <= 1 ? '0' : (pos[0] / (SPRITE_SHEET_COLS - 1) * 100) + '%';
  var yPct = SPRITE_SHEET_ROWS <= 1 ? '0' : (pos[1] / (SPRITE_SHEET_ROWS - 1) * 100) + '%';
  el.style.backgroundPosition = xPct + ' ' + yPct;
}

var MAX_SPRITE_SCALE = 1;

function spriteScale(id, targetRatio) {
  targetRatio = targetRatio || 0.55;
  var pad = SPRITE_PAD[id];
  if (!pad) return 1;
  var opaqueW = SPRITE_SIZE - pad[3] - pad[1];
  var opaqueH = SPRITE_SIZE - pad[0] - pad[2];
  var maxDim = Math.max(opaqueW, opaqueH);
  var target = SPRITE_SIZE * targetRatio;
  return +Math.min(target / maxDim, MAX_SPRITE_SCALE).toFixed(2);
}
