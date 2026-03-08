var menuFocusIdx = -1;

function buildMenu() {
  const menuEl = document.getElementById('menuScreen');
  if (!menuEl) return;
  menuFocusIdx = -1;

  const layout = getActiveLayout();
  layout.renderMenu(menuEl);
}

function getMenuCards() {
  return Array.from(document.querySelectorAll('#menuScreen .game-card'));
}

function updateMenuFocus() {
  const cards = getMenuCards();
  cards.forEach((c, i) => c.classList.toggle('focused', i === menuFocusIdx));
  if (cards[menuFocusIdx]) cards[menuFocusIdx].scrollIntoView({ block: 'nearest' });
}

document.addEventListener('keydown', function(e) {
  if (currentScreen !== 'menu') return;
  const cards = getMenuCards();
  if (!cards.length) return;

  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' ||
      e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    const cols = Math.round(cards[0].parentElement.clientWidth /
      cards[0].getBoundingClientRect().width);

    let dir = 0;
    if (e.key === 'ArrowRight') dir = -1;
    else if (e.key === 'ArrowLeft') dir = 1;
    else if (e.key === 'ArrowUp') dir = -cols;
    else if (e.key === 'ArrowDown') dir = cols;

    if (menuFocusIdx === -1) { menuFocusIdx = 0; }
    else { menuFocusIdx = Math.max(0, Math.min(cards.length - 1, menuFocusIdx + dir)); }
    updateMenuFocus();
    return;
  }

  if (e.key === 'Enter' || e.key === ' ') {
    if (menuFocusIdx === -1) return;
    e.preventDefault();
    cards[menuFocusIdx].click();
    return;
  }
});
