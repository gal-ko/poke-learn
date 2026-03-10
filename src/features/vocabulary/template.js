function vocabularyTemplate() {
  return `
    <div class="game-screen" id="vocabulary-game">
      <div class="game-header">
        <div class="game-title-row"><h2 class="pixel">אוצר מילים</h2><button class="info-toggle" onclick="const i=this.closest('.game-header').querySelector('.game-info');i.classList.toggle('show');if(i.classList.contains('show')){const b=this.getBoundingClientRect(),r=i.getBoundingClientRect();i.style.setProperty('--arrow-x',(b.left+b.width/2-r.left)+'px')}"><svg class="mi"><use href="#i-info"/></svg></button></div>
        <div class="game-info">
          <div class="info-controls">השתמש בעכבר או במקלדת לדפדף ולשמוע</div>
          <div class="info-motivation"><svg class="mi"><use href="#i-auto_awesome"/></svg> דראוזי חולם על מילים חדשות!</div>
        </div>
      </div>
      <div class="toggle-bar" id="categoryTabs"></div>
      <div class="vocab-card" id="vocabCard">
        <span class="poke-sprite pokemon-sprite" id="vocabSprite"></span>
        <div class="english-word" id="vocabEnglish"></div>
        <div class="hebrew-word" id="vocabHebrew"></div>
        <div class="category-label" id="vocabCategory"></div>
        <div style="margin-top:6px">
          <button class="speak-btn" onclick="speakWord()" title="הקשב"><svg class="mi"><use href="#i-volume_up"/></svg></button>
        </div>
      </div>
      <div class="vocab-nav">
        <button class="btn btn-secondary" onclick="vocabPrev()">→ הקודם</button>
        <button class="btn btn-primary" onclick="vocabNext()">הבא ←</button>
      </div>
    </div>`;
}
