function sprite(id) {
  return `sprites/${id}.png`;
}

var MAX_SPRITE_SCALE = 1;

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
