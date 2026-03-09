var dexView = 'honeycomb';
var _dexResizeHandler = null;

function initPokedex() {
  renderPokedex();
  if (_dexResizeHandler) window.removeEventListener('resize', _dexResizeHandler);
  _dexResizeHandler = debounce(function() { if (dexView === 'honeycomb') renderPokedex(); }, 200);
  window.addEventListener('resize', _dexResizeHandler);
}

function cleanupPokedex() {
  if (_dexResizeHandler) {
    window.removeEventListener('resize', _dexResizeHandler);
    _dexResizeHandler = null;
  }
  _flippedHex = null;
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
    const cols = Math.max(1, Math.min(4, Math.floor(available / cellW)));
    const rows = [];
    let i = 0;
    let ri = 0;
    while (i < POKEMON.length) {
      const count = (ri % 2 === 1 && cols > 1) ? cols - 1 : cols;
      rows.push(POKEMON.slice(i, i + count));
      i += count;
      ri++;
    }
    const lastRow = rows[rows.length - 1];
    const lastExpected = ((rows.length - 1) % 2 === 1 && cols > 1) ? cols - 1 : cols;
    while (lastRow.length < lastExpected) lastRow.push(null);
    grid.innerHTML = rows.map((row, ri) => {
      const offset = (ri % 2 === 1 && cols > 1) ? ' hex-row-offset' : '';
      const cells = row.map(p => {
        if (!p) return '<div class="hex-cell hex-empty"></div>';
        const typeColor = getTypeColor(p.type);
        return `
          <div class="hex-cell" onclick="toggleHex(this, '${p.name.replace(/'/g, "\\'")}')">
            <div class="hex-inner">
              <div class="hex-front">
                ${sprite(p.id, '', 'transform:scale(' + spriteScale(p.id) + ')')}
                <span class="hex-front-name">${p.name}</span>
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
          ${sprite(p.id, '', 'transform:scale(' + spriteScale(p.id) + ')')}
          <span class="dex-id">#${String(p.id).padStart(3, '0')}</span>
          <span class="dex-name">${p.name}</span>
          <span class="dex-he">${p.he}</span>
          <span class="dex-type" style="background:${typeColor}">${p.type}</span>
        </div>`;
    }).join('');
  }
}

var _flippedHex = null;

function toggleHex(el, name) {
  if (_flippedHex === el) {
    el.classList.remove('flipped');
    var prev = el;
    setTimeout(function() { prev.classList.remove('hex-3d'); }, 600);
    _flippedHex = null;
    return;
  }
  if (_flippedHex) {
    _flippedHex.classList.remove('flipped');
    var old = _flippedHex;
    setTimeout(function() { old.classList.remove('hex-3d'); }, 600);
  }
  el.classList.add('hex-3d');
  requestAnimationFrame(function() {
    el.classList.add('flipped');
  });
  _flippedHex = el;
  setTimeout(function() { speak(name); }, 50);
}

function getTypeColor(type) {
  const t = POKEMON_TYPES[type] || POKEMON_TYPES.normal;
  return t.color;
}

registerScreen('pokedex', { init: initPokedex, cleanup: cleanupPokedex });
