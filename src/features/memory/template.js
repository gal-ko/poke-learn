function memoryTemplate() {
  return `
    <div class="game-screen" id="memory-game">
      <div class="game-header">
        <h2 class="pixel">התאמה</h2>
        <div class="game-info">
          <div class="info-controls"><svg class="mi"><use href="#i-info"/></svg> לחץ, גרור או השתמש במקלדת כדי להתאים שם לתמונה</div>
          <div class="info-motivation"><svg class="mi"><use href="#i-target"/></svg> מיוטו תופס את כולם - גם אתה!</div>
        </div>
      </div>
      <div class="toggle-bar">
        <button class="btn-tertiary active" data-diff="easy" onclick="setMemDiff('easy')">קל (3-5 אותיות)</button>
        <button class="btn-tertiary" data-diff="medium" onclick="setMemDiff('medium')">בינוני (5-7 אותיות)</button>
        <button class="btn-tertiary" data-diff="hard" onclick="setMemDiff('hard')">קשה (7+ אותיות)</button>
      </div>
      <div class="memory-stats" style="display:none">
        <span><svg class="mi"><use href="#i-target"/></svg> <span id="memScore">0</span> / <span id="memTotal">0</span></span>
      </div>
      <div class="match-board" id="memoryGrid"></div>
    </div>`;
}
