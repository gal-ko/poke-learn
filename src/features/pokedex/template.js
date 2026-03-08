function pokedexTemplate() {
  return `
    <div class="game-screen" id="pokedex-screen">
      <div class="game-header">
        <h2 class="pixel"><svg class="mi"><use href="#i-menu_book"/></svg> פוקידע</h2>
        <div class="game-info">
          <div class="info-controls"><svg class="mi"><use href="#i-info"/></svg> לחץ על דמות כדי לשמוע את השם שלה</div>
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
