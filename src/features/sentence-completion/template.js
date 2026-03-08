function sentenceCompletionTemplate() {
  return `
    <div class="game-screen" id="sentence-completion-game">
      <div class="game-header">
        <h2 class="pixel">השלם את המשפט</h2>
        <div class="game-info">
          <div class="info-controls"><span class="mi">info</span> בחר את התשובה הנכונה כדי להשלים את המשפט</div>
          <div class="info-motivation"><span class="mi">menu_book</span> סלופוק קורא לאט... אבל תמיד מצליח!</div>
        </div>
      </div>
      <div class="toggle-bar" id="readCategoryBar"></div>
      <div class="reading-card" id="readingCard">
        <img class="pokemon-sprite" id="readSprite" src="" alt="">
        <div class="reading-text" id="readingText"></div>
        <button class="speak-btn" onclick="speakReading()" title="הקשב"><span class="mi">volume_up</span></button>
        <div class="quiz-area" id="quizArea"></div>
      </div>
      <div style="text-align:center;margin-top:14px">
        <button class="btn btn-secondary" onclick="nextReading()">דלג</button>
      </div>
    </div>`;
}
