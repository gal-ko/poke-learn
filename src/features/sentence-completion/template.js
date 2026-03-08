function sentenceCompletionTemplate() {
  return `
    <div class="game-screen" id="sentence-completion-game">
      <div class="game-header">
        <h2 class="pixel">השלם את המשפט</h2>
        <div class="game-info">
          <div class="info-controls"><svg class="mi"><use href="#i-info"/></svg> בחר את התשובה הנכונה כדי להשלים את המשפט</div>
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
