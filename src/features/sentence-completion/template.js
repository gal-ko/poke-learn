function sentenceCompletionTemplate() {
  return `
    <div class="game-screen" id="sentence-completion-game">
      <div class="game-header">
        <div class="game-title-row"><h2 class="pixel">השלם את המשפט</h2><button class="info-toggle" onclick="const i=this.closest('.game-header').querySelector('.game-info');i.classList.toggle('show');if(i.classList.contains('show')){const b=this.getBoundingClientRect(),r=i.getBoundingClientRect();i.style.setProperty('--arrow-x',(b.left+b.width/2-r.left)+'px')}"><svg class="mi"><use href="#i-info"/></svg></button></div>
        <div class="game-info">
          <div class="info-controls">בחר את התשובה הנכונה כדי להשלים את המשפט</div>
          <div class="info-motivation"><svg class="mi"><use href="#i-menu_book"/></svg> סלופוק קורא לאט... אבל תמיד מצליח!</div>
        </div>
      </div>
      <div class="toggle-bar" id="readCategoryBar"></div>
      <div class="reading-card" id="readingCard">
        <span class="poke-sprite pokemon-sprite" id="readSprite"></span>
        <div class="reading-text" id="readingText"></div>
        <button class="speak-btn" onclick="speakReading()" title="הקשב"><svg class="mi"><use href="#i-volume_up"/></svg></button>
        <div class="quiz-area" id="quizArea"></div>
      </div>
      <div style="text-align:center;margin-top:14px">
        <button class="btn btn-secondary" onclick="nextReading()">דלג</button>
      </div>
    </div>`;
}
