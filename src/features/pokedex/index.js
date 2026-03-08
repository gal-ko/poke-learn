var dexView = 'honeycomb';
var _dexResizeHandler = null;

function initPokedex() {
  renderPokedex();
  if (_dexResizeHandler) window.removeEventListener('resize', _dexResizeHandler);
  _dexResizeHandler = () => { if (dexView === 'honeycomb') renderPokedex(); };
  window.addEventListener('resize', _dexResizeHandler);
}

function cleanupPokedex() {
  if (_dexResizeHandler) {
    window.removeEventListener('resize', _dexResizeHandler);
    _dexResizeHandler = null;
  }
}

function setDexView(view) {
  dexView = view;
  renderPokedex();
}

function renderPokedex() {
  document.getElementById('dexCount').textContent = STRINGS.dexHeader(POKEMON.length);

  const toggle = document.getElementById('dexViewToggle');
  if (toggle) {
    toggle.querySelectorAll('.btn-tertiary').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === dexView);
    });
  }

  const grid = document.getElementById('dexGrid');
  grid.className = dexView === 'honeycomb' ? 'hex-grid' : 'dex-grid';

  if (dexView === 'honeycomb') {
    const cellW = 150;
    const container = document.getElementById('dexGrid');
    const available = container.parentElement.clientWidth;
    const cols = Math.max(2, Math.min(4, Math.floor(available / cellW)));
    const rows = [];
    for (let i = 0; i < POKEMON.length; i += cols) {
      rows.push(POKEMON.slice(i, i + cols));
    }
    const lastRow = rows[rows.length - 1];
    while (lastRow.length < cols) lastRow.push(null);
    grid.innerHTML = rows.map((row, ri) => {
      const offset = ri % 2 === 1 ? ' hex-row-offset' : '';
      const cells = row.map(p => {
        if (!p) return '<div class="hex-cell hex-empty"></div>';
        const typeColor = getTypeColor(p.type);
        return `
          <div class="hex-cell" onclick="toggleHex(this, '${p.name.replace(/'/g, "\\'")}')">
            <div class="hex-inner">
              <div class="hex-front">
                <img src="${sprite(p.id)}" alt="${p.name}" style="transform:scale(${spriteScale(p.id)})">
              </div>
              <div class="hex-back">
                <span class="hex-id">#${String(p.id).padStart(3, '0')}</span>
                <span class="hex-name">${p.name}</span>
                <span class="hex-he">${p.he}</span>
                <span class="hex-type" style="background:${typeColor}">${p.type}</span>
              </div>
            </div>
          </div>`;
      }).join('');
      return `<div class="hex-row${offset}">${cells}</div>`;
    }).join('');
  } else {
    grid.innerHTML = POKEMON.map(p => {
      const typeColor = getTypeColor(p.type);
      return `
        <div class="dex-card" onclick="speak('${p.name.replace(/'/g, "\\'")}')">
          <img src="${sprite(p.id)}" alt="${p.name}" style="transform:scale(${spriteScale(p.id)})">
          <span class="dex-id">#${String(p.id).padStart(3, '0')}</span>
          <span class="dex-name">${p.name}</span>
          <span class="dex-he">${p.he}</span>
          <span class="dex-type" style="background:${typeColor}">${p.type}</span>
        </div>`;
    }).join('');
  }
}

function toggleHex(el, name) {
  const wasFlipped = el.classList.contains('flipped');
  document.querySelectorAll('.hex-cell.flipped').forEach(c => c.classList.remove('flipped'));
  if (!wasFlipped) {
    el.classList.add('flipped');
    speak(name);
  }
}

function getTypeColor(type) {
  const t = POKEMON_TYPES[type] || POKEMON_TYPES.normal;
  return t.color;
}

registerScreen('pokedex', { init: initPokedex, cleanup: cleanupPokedex });
