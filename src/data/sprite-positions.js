var SPRITE_SHEET_COLS = 16;
var SPRITE_SHEET_ROWS = 10;

function getSpritePos(id) {
  return [id % SPRITE_SHEET_COLS, Math.floor(id / SPRITE_SHEET_COLS)];
}
