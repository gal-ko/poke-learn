function memoryTemplate() {
  return `
    <div class="game-screen" id="memory-game">
      <div class="game-header">
        <div class="game-title-row"><h2 class="pixel">התאמה</h2><button class="info-toggle" onclick="const i=this.closest('.game-header').querySelector('.game-info');i.classList.toggle('show');if(i.classList.contains('show')){const b=this.getBoundingClientRect(),r=i.getBoundingClientRect();i.style.setProperty('--arrow-x',(b.left+b.width/2-r.left)+'px')}"><svg class="mi"><use href="#i-info"/></svg></button></div>
        <div class="game-info">
          <div class="info-controls">לחץ, גרור או השתמש במקלדת כדי להתאים שם לתמונה</div>
          <div class="info-motivation"><svg class="mi"><use href="#i-target"/></svg> פוליוורל מתאים לכולם - גם אתה!</div>
        </div>
      </div>
      <div class="toggle-bar">
        <button class="btn-tertiary active" data-diff="easy" onclick="setMemDiff('easy')">${DIFF_LABEL_EASY}</button>
        <button class="btn-tertiary" data-diff="medium" onclick="setMemDiff('medium')">${DIFF_LABEL_MEDIUM}</button>
        <button class="btn-tertiary" data-diff="hard" onclick="setMemDiff('hard')">${DIFF_LABEL_HARD}</button>
      </div>
      <div class="memory-stats" style="display:none">
        <span><svg class="mi"><use href="#i-target"/></svg> <span id="memScore">0</span> / <span id="memTotal">0</span></span>
      </div>
      <div class="match-board" id="memoryGrid"></div>
    </div>`;
}
