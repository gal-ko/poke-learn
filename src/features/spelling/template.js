function spellingTemplate() {
  return `
    <div class="game-screen" id="spelling-game">
      <div class="game-header">
        <div class="game-title-row"><h2 class="pixel">איית את המילה</h2><button class="info-toggle" onclick="const i=this.closest('.game-header').querySelector('.game-info');i.classList.toggle('show');if(i.classList.contains('show')){const b=this.getBoundingClientRect(),r=i.getBoundingClientRect();i.style.setProperty('--arrow-x',(b.left+b.width/2-r.left)+'px')}"><svg class="mi"><use href="#i-info"/></svg></button></div>
        <div class="game-info">
          <div class="info-controls">לחץ, גרור או הקלד אותיות כדי לאיית את המילה</div>
          <div class="info-motivation"><svg class="mi"><use href="#i-local_fire_department"/></svg> צ'ריזארד מאמין בך - אתה תצליח!</div>
        </div>
      </div>
      <div class="toggle-bar">
        <button class="btn-tertiary active" data-diff="easy" onclick="setSpellDiff('easy')">${DIFF_LABEL_EASY}</button>
        <button class="btn-tertiary" data-diff="medium" onclick="setSpellDiff('medium')">${DIFF_LABEL_MEDIUM}</button>
        <button class="btn-tertiary" data-diff="hard" onclick="setSpellDiff('hard')">${DIFF_LABEL_HARD}</button>
      </div>
      <span class="poke-sprite pokemon-sprite-sm" id="spellSprite"></span>
      <div id="spellHint" style="color:var(--accent);margin:8px 0;font-size:15px"></div>
      <div class="spelling-slots" id="spellSlots"></div>
      <div class="letter-tiles" id="letterTiles"></div>
      <div style="text-align:center;margin-top:14px">
        <button class="btn btn-secondary" onclick="initSpelling()">החלף מילה</button>
      </div>
    </div>`;
}
