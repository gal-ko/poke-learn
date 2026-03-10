function pokedexTemplate() {
  return `
    <div class="game-screen" id="pokedex-screen">
      <div class="game-header">
        <div class="game-title-row"><h2 class="pixel">פוקידע</h2><button class="info-toggle" onclick="const i=this.closest('.game-header').querySelector('.game-info');i.classList.toggle('show');if(i.classList.contains('show')){const b=this.getBoundingClientRect(),r=i.getBoundingClientRect();i.style.setProperty('--arrow-x',(b.left+b.width/2-r.left)+'px')}"><svg class="mi"><use href="#i-info"/></svg></button></div>
        <div class="game-info">
          <div class="info-controls">לחץ על דמות כדי לשמוע את השם שלה</div>
          <div class="info-motivation"><svg class="mi"><use href="#i-search"/></svg> פרופסור אוק גאה בך - חקור את כולם!</div>
        </div>
      </div>
      <div class="toggle-bar" id="dexViewToggle">
        <button class="btn-tertiary active" data-view="honeycomb" onclick="setDexView('honeycomb')">כוורת</button>
        <button class="btn-tertiary" data-view="grid" onclick="setDexView('grid')">כרטיסיות</button>
      </div>
      <div class="dex-count" id="dexCount"></div>
      <div class="dex-grid" id="dexGrid"></div>
    </div>`;
}
