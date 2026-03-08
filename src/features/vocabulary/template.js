function vocabularyTemplate() {
  return `
    <div class="game-screen" id="vocabulary-game">
      <div class="game-header">
        <h2 class="pixel">מילון</h2>
        <div class="game-info">
          <div class="info-controls"><span class="mi">info</span> השתמש בעכבר או במקלדת לדפדף ולשמוע</div>
          <div class="info-motivation"><span class="mi">bolt</span> פיקאצ'ו למד 50 מילים ביום אחד!</div>
        </div>
      </div>
      <div class="toggle-bar" id="categoryTabs"></div>
      <div class="vocab-card" id="vocabCard">
        <img class="pokemon-sprite" id="vocabSprite" src="" alt="">
        <div class="english-word" id="vocabEnglish"></div>
        <div class="hebrew-word" id="vocabHebrew"></div>
        <div class="category-label" id="vocabCategory"></div>
        <div style="margin-top:12px">
          <button class="speak-btn" onclick="speakWord()" title="הקשב"><span class="mi">volume_up</span></button>
        </div>
      </div>
      <div class="vocab-nav">
        <button class="btn btn-secondary" onclick="vocabPrev()">→ הקודם</button>
        <button class="btn btn-primary" onclick="vocabNext()">הבא ←</button>
      </div>
    </div>`;
}
