function alphabetTemplate() {
  return `
    <div class="game-screen" id="alphabet-game">
      <div class="game-header">
        <div class="game-title-row"><h2 class="pixel">אלף-בית</h2><button class="info-toggle" onclick="const i=this.closest('.game-header').querySelector('.game-info');i.classList.toggle('show');if(i.classList.contains('show')){const b=this.getBoundingClientRect(),r=i.getBoundingClientRect();i.style.setProperty('--arrow-x',(b.left+b.width/2-r.left)+'px')}"><svg class="mi"><use href="#i-info"/></svg></button></div>
        <div class="game-info">
          <div class="info-controls">השתמש בחצים או במקלדת כדי לדפדף בין האותיות</div>
          <div class="info-motivation"><svg class="mi"><use href="#i-auto_awesome"/></svg> ארבוק יודע שהכל מתחיל מ-A!</div>
        </div>
      </div>
      <div class="abc-letter-nav" id="abcLetterNav"></div>
      <div class="abc-hero-wrap">
        <button class="abc-arrow abc-arrow-left" onclick="abcPrev()" aria-label="Previous">‹</button>
        <div class="abc-hero" id="abcHero"></div>
        <button class="abc-arrow abc-arrow-right" onclick="abcNext()" aria-label="Next">›</button>
      </div>
      <div class="abc-count" id="abcCount"></div>
      <div class="abc-pokemon-grid" id="abcPokemonGrid"></div>
    </div>`;
}
