LAYOUT_RENDERERS.classic = {
  transitionClass: 'transition-fade',

  renderMenu(menuEl) {
    const scored = MENU_CARDS.filter(c => c.group === 'scored');
    const free = MENU_CARDS.filter(c => c.group === 'free');

    const renderCard = c => `
      <div class="game-card" onclick="startGame('${c.screen}')">
        ${sprite(c.spriteId)}
        <h3 class="pixel">${c.title}</h3>
        <p>${c.description}</p>
        <span class="card-stars">${c.stars}</span>
      </div>`;

    menuEl.innerHTML = `
      <h2 class="pixel">למד אנגלית עם פוקימון</h2>
      <p>בחר משחק כדי להתחיל ללמוד</p>
      <div class="game-grid">${scored.map(renderCard).join('')}</div>
      <div class="game-grid game-grid-free">${free.map(renderCard).join('')}</div>
    `;
  },

  cleanupMenu() {}
};
