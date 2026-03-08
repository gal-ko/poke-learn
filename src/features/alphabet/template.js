function alphabetTemplate() {
  return `
    <div class="game-screen" id="alphabet-game">
      <div class="game-header">
        <h2 class="pixel">אלף-בית</h2>
        <div class="game-info">
          <div class="info-controls"><svg class="mi"><use href="#i-info"/></svg> השתמש בחצים או במקלדת כדי לדפדף בין האותיות</div>
          <div class="info-motivation"><svg class="mi"><use href="#i-auto_awesome"/></svg> אפילו מג'יקארפ התחיל מ-A!</div>
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
