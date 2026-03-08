function pokedexTemplate() {
  return `
    <div class="game-screen" id="pokedex-screen">
      <div class="game-header">
        <h2 class="pixel"><span class="mi">menu_book</span> פוקידע</h2>
        <div class="game-info">
          <div class="info-controls"><span class="mi">info</span> לחץ על דמות כדי לשמוע את השם שלה</div>
          <div class="info-motivation"><span class="mi">search</span> פרופסור אוק גאה בך - חקור את כולם!</div>
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
