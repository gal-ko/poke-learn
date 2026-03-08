LAYOUT_RENDERERS.dark = {
  transitionClass: 'transition-slide-up',

  renderMenu(menuEl) {
    const scored = MENU_CARDS.filter(c => c.group === 'scored');
    const free = MENU_CARDS.filter(c => c.group === 'free');

    const renderCard = c => `
      <div class="m3-card" onclick="startGame('${c.screen}')">
        <div class="m3-card-media">
          <img src="${sprite(c.spriteId)}" alt="">
        </div>
        <div class="m3-card-body">
          <h3>${c.title}</h3>
          <p>${c.description}</p>
          <span class="m3-chip">${c.stars}</span>
        </div>
      </div>`;

    menuEl.innerHTML = `
      <div class="m3-menu-header">
        <h2>למד אנגלית עם פוקימון</h2>
        <p>בחר משחק כדי להתחיל ללמוד</p>
      </div>
      <div class="m3-section">
        <span class="m3-section-label">משחקים</span>
        <div class="m3-carousel">${scored.map(renderCard).join('')}</div>
      </div>
      <div class="m3-section">
        <span class="m3-section-label">לימוד חופשי</span>
        <div class="m3-carousel">${free.map(renderCard).join('')}</div>
      </div>
    `;
  },

  cleanupMenu() {}
};
