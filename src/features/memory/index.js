var memDiff = 'easy';
var memPool = [];
var memSelected = { name: null, img: null };
var memMatched = 0;
var memTotal = 0;
var memLocked = false;
var memFocusCol = 'name';
var memFocusIdx = 0;

var POKEMON_COLOR_HEX = {
  red: '#FF6B6B', blue: '#6BC5FF', green: '#6BFF8E', yellow: '#FFD93D',
  purple: '#B47AFF', pink: '#FF8EC4', brown: '#D4A574', white: '#E8E8F0',
  gray: '#A8B4C0', black: '#8890A0'
};

function drawMatchLine(pid, fromType) {
  const svg = document.getElementById('matchLines');
  if (!svg) return;
  const board = svg.closest('.match-board');
  const boardRect = board.getBoundingClientRect();
  const nameEl = board.querySelector(`.match-col-names .match-item[data-pid="${pid}"]`);
  const imgEl = board.querySelector(`.match-col-imgs .match-item[data-pid="${pid}"]`);
  if (!nameEl || !imgEl) return;

  const p = POKEMON.find(pk => pk.id === pid);
  const color = (p && p.color && POKEMON_COLOR_HEX[p.color]) || '#FFD93D';

  const nRect = nameEl.getBoundingClientRect();
  const iRect = imgEl.getBoundingClientRect();

  const nx = nRect.right - boardRect.left;
  const ny = nRect.top + nRect.height / 2 - boardRect.top;
  const ix = iRect.left - boardRect.left;
  const iy = iRect.top + iRect.height / 2 - boardRect.top;

  const startFromImg = fromType === 'img';
  const x1 = startFromImg ? ix : nx;
  const y1 = startFromImg ? iy : ny;
  const x2 = startFromImg ? nx : ix;
  const y2 = startFromImg ? ny : iy;

  const midX = (x1 + x2) / 2;
  const dy = y2 - y1;
  const curl = Math.min(Math.abs(dy) * 0.6, 50) * (dy >= 0 ? 1 : -1);
  const cp1x = midX;
  const cp1y = y1 - curl;
  const cp2x = midX;
  const cp2y = y2 + curl;

  const d = `M${x1},${y1} C${cp1x},${cp1y} ${cp2x},${cp2y} ${x2},${y2}`;

  const trail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  trail.setAttribute('d', d);
  trail.setAttribute('class', 'match-line-trail');
  trail.setAttribute('stroke', 'rgba(255,255,255,.2)');
  svg.appendChild(trail);

  const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pulse.setAttribute('d', d);
  pulse.setAttribute('class', 'match-line-pulse');
  pulse.setAttribute('stroke', color);
  svg.appendChild(pulse);

  const len = trail.getTotalLength();
  const chunk = Math.min(len * 0.6, 120);

  pulse.style.strokeDasharray = `${chunk} ${len * 2}`;
  pulse.style.strokeDashoffset = chunk;

  requestAnimationFrame(() => {
    pulse.style.transition = `stroke-dashoffset .5s ease-in-out, opacity .15s ease .4s`;
    pulse.style.strokeDashoffset = -len;
    pulse.style.opacity = '0';
  });
}

function setMemDiff(d) {
  memDiff = d;
  document.querySelectorAll('#memory-game .btn-tertiary').forEach(b =>
    b.classList.toggle('active', b.dataset.diff === d)
  );
  initMemory();
}

function initMemory() {
  memSelected = { name: null, img: null };
  memMatched = 0;
  memLocked = false;
  memFocusCol = 'name';
  memFocusIdx = 0;

  const count = 4;
  let filtered;
  if (memDiff === 'easy') filtered = POKEMON.filter(p => p.name.length <= 5);
  else if (memDiff === 'medium') filtered = POKEMON.filter(p => p.name.length >= 5 && p.name.length <= 7);
  else filtered = POKEMON.filter(p => p.name.length >= 7);
  if (!filtered.length) filtered = POKEMON;

  memTotal = count;
  memPool = shuffle([...filtered]).slice(0, count);

  const namesOrder = shuffle([...memPool]);
  let imgsOrder = shuffle([...memPool]);
  while (imgsOrder.some((p, i) => p.id === namesOrder[i].id)) {
    imgsOrder = shuffle([...memPool]);
  }

  document.getElementById('memScore').textContent = '0';
  document.getElementById('memTotal').textContent = memTotal;

  const grid = document.getElementById('memoryGrid');
  grid.innerHTML = `
    <div class="match-col match-col-names">
      ${namesOrder.map(p => `
        <button class="match-item match-name" data-pid="${p.id}" data-type="name"
          draggable="true" onclick="pickMatch('name',${p.id})">
          <span class="match-name-en">${p.name}</span>
        </button>
      `).join('')}
    </div>
    <svg class="match-lines" id="matchLines"></svg>
    <div class="match-col match-col-imgs">
      ${imgsOrder.map(p => `
        <button class="match-item match-img" data-pid="${p.id}" data-type="img"
          draggable="true" onclick="pickMatch('img',${p.id})">
          ${sprite(p.id, '', 'transform:scale(' + spriteScale(p.id) + ')')}
        </button>
      `).join('')}
    </div>
  `;

  memBindDrag();
}

function pickMatch(type, pid) {
  if (memLocked) return;

  const col = type === 'name' ? '.match-col-names' : '.match-col-imgs';
  document.querySelectorAll(`${col} .match-item`).forEach(el => el.classList.remove('selected'));

  const el = document.querySelector(`${col} .match-item[data-pid="${pid}"]`);
  if (!el || el.classList.contains('matched')) return;
  el.classList.add('selected');

  memSelected[type] = pid;

  if (memSelected.name !== null && memSelected.img !== null) {
    memLocked = true;
    const nameEl = document.querySelector(`.match-col-names .match-item[data-pid="${memSelected.name}"].selected`);
    const imgEl = document.querySelector(`.match-col-imgs .match-item[data-pid="${memSelected.img}"].selected`);

    if (memSelected.name === memSelected.img) {
      nameEl.classList.add('matched');
      imgEl.classList.add('matched');
      nameEl.classList.remove('selected');
      imgEl.classList.remove('selected');
      drawMatchLine(memSelected.name, type === 'name' ? 'img' : 'name');
      memMatched++;
      document.getElementById('memScore').textContent = memMatched;

      memSelected = { name: null, img: null };
      memLocked = false;

      if (memMatched === memTotal) {
        setTimeout(() => {
          addStar(2);
          AppState.incrementGamesCompleted();
          const winPid = memPool[0].id;
          showCaught(winPid, STRINGS.starReward(2), 2);
          setTimeout(() => initMemory(), 3000);
        }, 550);
      }
    } else {
      nameEl.classList.add('wrong');
      imgEl.classList.add('wrong');
      setTimeout(() => {
        nameEl.classList.remove('selected', 'wrong');
        imgEl.classList.remove('selected', 'wrong');
        memSelected = { name: null, img: null };
        memLocked = false;
      }, 600);
    }
  }
}

var _memDragPid = null;
var _memDragType = null;
var _memGhost = null;

function memBindDrag() {
  const board = document.getElementById('memoryGrid');

  board.addEventListener('dragstart', function(e) {
    const item = e.target.closest('.match-item');
    if (!item || item.classList.contains('matched') || memLocked) { e.preventDefault(); return; }
    _memDragPid = parseInt(item.dataset.pid);
    _memDragType = item.dataset.type;
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  });

  board.addEventListener('dragover', function(e) {
    const item = e.target.closest('.match-item');
    if (!item || item.classList.contains('matched')) return;
    if (item.dataset.type === _memDragType) return;
    e.preventDefault();
    board.querySelectorAll('.match-item').forEach(el => el.classList.remove('drag-over'));
    item.classList.add('drag-over');
  });

  board.addEventListener('dragleave', function(e) {
    const item = e.target.closest('.match-item');
    if (item) item.classList.remove('drag-over');
  });

  board.addEventListener('dragend', function() {
    board.querySelectorAll('.dragging, .drag-over').forEach(el =>
      el.classList.remove('dragging', 'drag-over'));
    _memDragPid = null;
    _memDragType = null;
  });

  board.addEventListener('drop', function(e) {
    e.preventDefault();
    board.querySelectorAll('.dragging, .drag-over').forEach(el =>
      el.classList.remove('dragging', 'drag-over'));
    const target = e.target.closest('.match-item');
    if (!target || target.classList.contains('matched') || memLocked) return;
    if (target.dataset.type === _memDragType) return;
    const dropPid = parseInt(target.dataset.pid);
    const namePid = _memDragType === 'name' ? _memDragPid : dropPid;
    const imgPid = _memDragType === 'img' ? _memDragPid : dropPid;
    const dragFrom = _memDragType;
    memSelected = { name: null, img: null };
    document.querySelectorAll('.match-item').forEach(el => el.classList.remove('selected'));
    memDirectMatch(namePid, imgPid, dragFrom);
    _memDragPid = null;
    _memDragType = null;
  });

  board.addEventListener('touchstart', function(e) {
    const item = e.target.closest('.match-item');
    if (!item || item.classList.contains('matched') || memLocked) return;
    _memDragPid = parseInt(item.dataset.pid);
    _memDragType = item.dataset.type;
    item.classList.add('dragging');
    _memGhost = item.cloneNode(true);
    _memGhost.className = 'match-ghost';
    document.body.appendChild(_memGhost);
    const t = e.touches[0];
    _memGhost.style.left = t.clientX + 'px';
    _memGhost.style.top = t.clientY + 'px';
  }, { passive: true });

  board.addEventListener('touchmove', function(e) {
    if (!_memGhost) return;
    e.preventDefault();
    const t = e.touches[0];
    _memGhost.style.left = t.clientX + 'px';
    _memGhost.style.top = t.clientY + 'px';
    board.querySelectorAll('.match-item').forEach(el => el.classList.remove('drag-over'));
    const under = document.elementFromPoint(t.clientX, t.clientY);
    const target = under ? under.closest('.match-item') : null;
    if (target && !target.classList.contains('matched') && target.dataset.type !== _memDragType) {
      target.classList.add('drag-over');
    }
  }, { passive: false });

  board.addEventListener('touchend', function(e) {
    board.querySelectorAll('.dragging, .drag-over').forEach(el =>
      el.classList.remove('dragging', 'drag-over'));
    if (_memGhost) { _memGhost.remove(); _memGhost = null; }
    if (_memDragPid === null) return;
    const t = e.changedTouches[0];
    const under = document.elementFromPoint(t.clientX, t.clientY);
    const target = under ? under.closest('.match-item') : null;
    if (target && !target.classList.contains('matched') && target.dataset.type !== _memDragType && !memLocked) {
      const dropPid = parseInt(target.dataset.pid);
      const namePid = _memDragType === 'name' ? _memDragPid : dropPid;
      const imgPid = _memDragType === 'img' ? _memDragPid : dropPid;
      const dragFrom = _memDragType;
      memSelected = { name: null, img: null };
      document.querySelectorAll('.match-item').forEach(el => el.classList.remove('selected'));
      memDirectMatch(namePid, imgPid, dragFrom);
    }
    _memDragPid = null;
    _memDragType = null;
  });
}

function memDirectMatch(namePid, imgPid, fromType) {
  memLocked = true;
  const nameEl = document.querySelector(`.match-col-names .match-item[data-pid="${namePid}"]`);
  const imgEl = document.querySelector(`.match-col-imgs .match-item[data-pid="${imgPid}"]`);
  nameEl.classList.add('selected');
  imgEl.classList.add('selected');

  if (namePid === imgPid) {
    nameEl.classList.add('matched');
    imgEl.classList.add('matched');
    nameEl.classList.remove('selected');
    imgEl.classList.remove('selected');
    drawMatchLine(namePid, fromType || 'name');
    memMatched++;
    document.getElementById('memScore').textContent = memMatched;
    memLocked = false;
    if (memMatched === memTotal) {
      setTimeout(() => {
        addStar(2);
        AppState.incrementGamesCompleted();
        showCaught(memPool[0].id, STRINGS.starReward(2), 2);
        setTimeout(() => initMemory(), 3000);
      }, 550);
    }
  } else {
    nameEl.classList.add('wrong');
    imgEl.classList.add('wrong');
    setTimeout(() => {
      nameEl.classList.remove('selected', 'wrong');
      imgEl.classList.remove('selected', 'wrong');
      memLocked = false;
    }, 600);
  }
}

function memGetColItems(col) {
  const sel = col === 'name' ? '.match-col-names' : '.match-col-imgs';
  return Array.from(document.querySelectorAll(`${sel} .match-item`));
}

function memUpdateFocus() {
  document.querySelectorAll('.match-item').forEach(el => el.classList.remove('focused'));
  const items = memGetColItems(memFocusCol);
  if (items[memFocusIdx]) items[memFocusIdx].classList.add('focused');
}

function memNextAvailable(items, startIdx, dir) {
  let idx = startIdx;
  for (let i = 0; i < items.length; i++) {
    idx = (idx + dir + items.length) % items.length;
    if (!items[idx].classList.contains('matched')) return idx;
  }
  return startIdx;
}

document.addEventListener('keydown', function(e) {
  if (currentScreen !== 'match') return;
  if (memLocked) return;

  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
    const items = memGetColItems(memFocusCol);
    const dir = e.key === 'ArrowDown' ? 1 : -1;
    memFocusIdx = memNextAvailable(items, memFocusIdx, dir);
    memUpdateFocus();
    return;
  }

  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
    memFocusCol = memFocusCol === 'name' ? 'img' : 'name';
    const items = memGetColItems(memFocusCol);
    if (memFocusIdx >= items.length) memFocusIdx = items.length - 1;
    if (items[memFocusIdx] && items[memFocusIdx].classList.contains('matched')) {
      memFocusIdx = memNextAvailable(items, memFocusIdx, 1);
    }
    memUpdateFocus();
    return;
  }

  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    const items = memGetColItems(memFocusCol);
    const el = items[memFocusIdx];
    if (!el || el.classList.contains('matched')) return;
    const pid = parseInt(el.dataset.pid);
    pickMatch(memFocusCol === 'name' ? 'name' : 'img', pid);
    return;
  }
});

registerScreen('match', { init: initMemory, cleanup() {} });
