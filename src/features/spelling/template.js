function spellingTemplate() {
  return `
    <div class="game-screen" id="spelling-game">
      <div class="game-header">
        <h2 class="pixel">איית את המילה</h2>
        <div class="game-info">
          <div class="info-controls"><svg class="mi"><use href="#i-info"/></svg> לחץ, גרור או הקלד אותיות כדי לאיית את המילה</div>
          <div class="info-motivation"><svg class="mi"><use href="#i-local_fire_department"/></svg> צ'רמנדר מאמין בך - אתה תצליח!</div>
        </div>
      </div>
      <div class="toggle-bar">
        <button class="btn-tertiary active" data-diff="easy" onclick="setSpellDiff('easy')">קל (3-5 אותיות)</button>
        <button class="btn-tertiary" data-diff="medium" onclick="setSpellDiff('medium')">בינוני (5-7 אותיות)</button>
        <button class="btn-tertiary" data-diff="hard" onclick="setSpellDiff('hard')">קשה (7+ אותיות)</button>
      </div>
      <span class="poke-sprite pokemon-sprite-sm" id="spellSprite"></span>
      <div id="spellHint" style="color:var(--accent);margin:8px 0;font-size:15px"></div>
      <div class="spelling-slots" id="spellSlots"></div>
      <div class="letter-tiles" id="letterTiles"></div>
      <div style="text-align:center;margin-top:14px">
        <button class="btn btn-secondary" onclick="initSpelling()">דלג</button>
      </div>
    </div>`;
}
