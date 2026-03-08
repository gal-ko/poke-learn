function vocabularyTemplate() {
  return `
    <div class="game-screen" id="vocabulary-game">
      <div class="game-header">
        <h2 class="pixel">מילון</h2>
        <div class="game-info">
          <div class="info-controls"><svg class="mi"><use href="#i-info"/></svg> השתמש בעכבר או במקלדת לדפדף ולשמוע</div>
          <div class="info-motivation"><svg class="mi"><use href="#i-bolt"/></svg> פיקאצ'ו למד 50 מילים ביום אחד!</div>
        </div>
      </div>
      <div class="toggle-bar" id="categoryTabs"></div>
      <div class="vocab-card" id="vocabCard">
        <span class="poke-sprite pokemon-sprite" id="vocabSprite"></span>
        <div class="english-word" id="vocabEnglish"></div>
        <div class="hebrew-word" id="vocabHebrew"></div>
        <div class="category-label" id="vocabCategory"></div>
        <div style="margin-top:12px">
          <button class="speak-btn" onclick="speakWord()" title="הקשב"><svg class="mi"><use href="#i-volume_up"/></svg></button>
        </div>
      </div>
      <div class="vocab-nav">
        <button class="btn btn-secondary" onclick="vocabPrev()">→ הקודם</button>
        <button class="btn btn-primary" onclick="vocabNext()">הבא ←</button>
      </div>
    </div>`;
}
