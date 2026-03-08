let spellDiff = 'easy';
let spellWord = '';
let spellPokemon = null;
let spellSlots = [];
let spellLetters = [];
let spellLocked = [];
let spellQueue = [];
let spellQueueDiff = '';

function spellKeyHandler(e) {
  if (currentScreen !== 'spelling') return;
  if (e.key === 'Backspace') {
    e.preventDefault();
    spellUndo();
    return;
  }
  let ch = e.key.toUpperCase();
  if (HEBREW_TO_ENGLISH_KEYS[e.key]) ch = HEBREW_TO_ENGLISH_KEYS[e.key];
  if (!/^[A-Z]$/.test(ch)) return;
  e.preventDefault();
  for (let i = 0; i < spellLetters.length; i++) {
    if (!spellLetters[i].used && spellLetters[i].letter === ch) {
      tapLetter(i);
      return;
    }
  }
}

document.addEventListener('keydown', spellKeyHandler);

function setSpellDiff(d) {
  spellDiff = d;
  document.querySelectorAll('#spelling-game .btn-tertiary').forEach(b =>
    b.classList.toggle('active', b.dataset.diff === d)
  );
  initSpelling();
}

function buildSpellQueue() {
  let pool;
  if (spellDiff === 'easy') pool = POKEMON.filter(p => p.name.length <= 5);
  else if (spellDiff === 'medium') pool = POKEMON.filter(p => p.name.length >= 5 && p.name.length <= 7);
  else pool = POKEMON.filter(p => p.name.length >= 7);
  if (!pool.length) pool = POKEMON;
  spellQueue = shuffle([...pool]);
  spellQueueDiff = spellDiff;
}

function initSpelling() {
  if (spellQueueDiff !== spellDiff || spellQueue.length === 0) {
    buildSpellQueue();
  }

  spellPokemon = spellQueue.pop();
  spellWord = spellPokemon.name.toUpperCase().replace(/[^A-Z]/g, '');
  spellSlots = new Array(spellWord.length).fill(null);
  spellLocked = new Array(spellWord.length).fill(false);
  spellLetters = shuffle(spellWord.split('').map((l, i) => ({ letter: l, idx: i, used: false })));

  const hint = document.getElementById('spellHint');
  hint.textContent = spellDiff === 'easy' ? STRINGS.spellHintPrefix + spellWord[0] : spellPokemon.he;

  document.getElementById('spellSprite').src = sprite(spellPokemon.id);
  renderSpellSlots();
  renderLetterTiles();
}

function renderSpellSlots() {
  const c = document.getElementById('spellSlots');
  c.innerHTML = '';
  const hasLockedLetters = spellLocked.some(l => l);
  for (let i = 0; i < spellWord.length; i++) {
    const s = document.createElement('div');
    const entry = spellSlots[i];
    const hasLetter = entry !== null;
    s.className = 'spell-slot' + (hasLetter ? ' filled' : '') + (spellLocked[i] ? ' correct' : '');
    if (hasLetter) {
      s.textContent = entry.letter;
      if (!spellLocked[i]) {
        s.style.cursor = 'pointer';
        s.onclick = ((idx) => () => removeSlot(idx))(i);
      }
    } else if (hasLockedLetters) {
      s.textContent = '_';
      s.style.color = 'rgba(255,255,255,.2)';
    }
    c.appendChild(s);
  }
}

function renderLetterTiles() {
  const c = document.getElementById('letterTiles');
  c.innerHTML = '';
  spellLetters.forEach((l, i) => {
    const t = document.createElement('div');
    t.className = 'letter-tile' + (l.used ? ' used' : '');
    t.textContent = l.letter;
    t.onclick = () => tapLetter(i);
    if (!l.used) {
      t.draggable = true;
      t.dataset.tileIdx = i;
    }
    c.appendChild(t);
  });
}

function tapLetter(tileIdx, targetSlotIdx) {
  if (spellLetters[tileIdx].used) return;
  let slotIdx;
  if (targetSlotIdx !== undefined && spellSlots[targetSlotIdx] === null && !spellLocked[targetSlotIdx]) {
    slotIdx = targetSlotIdx;
  } else {
    slotIdx = spellSlots.findIndex((s, i) => s === null && !spellLocked[i]);
  }
  if (slotIdx === -1) return;
  spellLetters[tileIdx].used = true;
  spellSlots[slotIdx] = { letter: spellLetters[tileIdx].letter, tileIdx };
  renderSpellSlots();
  renderLetterTiles();
  if (spellSlots.every(s => s !== null)) {
    setTimeout(() => spellCheck(), 300);
  }
}

function removeSlot(idx) {
  if (spellSlots[idx] === null || spellLocked[idx]) return;
  spellLetters[spellSlots[idx].tileIdx].used = false;
  spellSlots[idx] = null;
  renderSpellSlots();
  renderLetterTiles();
}

function spellUndo() {
  let lastIdx = -1;
  for (let i = spellSlots.length - 1; i >= 0; i--) {
    if (spellSlots[i] !== null && !spellLocked[i]) { lastIdx = i; break; }
  }
  if (lastIdx === -1) return;
  spellLetters[spellSlots[lastIdx].tileIdx].used = false;
  spellSlots[lastIdx] = null;
  renderSpellSlots();
  renderLetterTiles();
}

function spellCheck() {
  const allFilled = spellSlots.every(s => s !== null);
  if (!allFilled) return;
  const guess = spellSlots.map(s => s.letter).join('');
  const slotEls = document.querySelectorAll('.spell-slot');
  if (guess === spellWord) {
    slotEls.forEach(s => s.classList.add('correct'));
    addStar(1);
    AppState.incrementGamesCompleted();
    showCaught(spellPokemon.id, STRINGS.starReward(1), 1);
    setTimeout(() => initSpelling(), 2800);
  } else {
    slotEls.forEach((s, i) => {
      if (spellSlots[i].letter === spellWord[i]) {
        s.classList.add('correct');
      } else {
        s.classList.add('wrong');
      }
    });
    setTimeout(() => {
      for (let i = 0; i < spellSlots.length; i++) {
        if (spellSlots[i] === null) continue;
        if (spellSlots[i].letter === spellWord[i]) {
          spellLocked[i] = true;
        } else {
          spellLetters[spellSlots[i].tileIdx].used = false;
          spellSlots[i] = null;
        }
      }
      renderSpellSlots();
      renderLetterTiles();
    }, 1200);
  }
}

let _spellDragIdx = null;
let _spellGhost = null;

function spellBindDrag() {
  const game = document.getElementById('spelling-game');

  game.addEventListener('dragstart', function(e) {
    const tile = e.target.closest('.letter-tile');
    if (!tile || tile.classList.contains('used')) { e.preventDefault(); return; }
    _spellDragIdx = parseInt(tile.dataset.tileIdx);
    tile.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  });

  game.addEventListener('dragover', function(e) {
    if (_spellDragIdx === null) return;
    const slot = e.target.closest('.spell-slot');
    if (slot && !slot.classList.contains('filled') && !slot.classList.contains('correct')) {
      e.preventDefault();
      game.querySelectorAll('.spell-slot').forEach(s => s.classList.remove('drag-over'));
      slot.classList.add('drag-over');
    }
  });

  game.addEventListener('dragleave', function(e) {
    const slot = e.target.closest('.spell-slot');
    if (slot) slot.classList.remove('drag-over');
  });

  game.addEventListener('dragend', function() {
    game.querySelectorAll('.dragging, .drag-over').forEach(el =>
      el.classList.remove('dragging', 'drag-over'));
    _spellDragIdx = null;
  });

  game.addEventListener('drop', function(e) {
    e.preventDefault();
    game.querySelectorAll('.dragging, .drag-over').forEach(el =>
      el.classList.remove('dragging', 'drag-over'));
    if (_spellDragIdx === null) return;
    const slot = e.target.closest('.spell-slot');
    let slotIdx;
    if (slot) {
      const slots = Array.from(document.querySelectorAll('.spell-slot'));
      slotIdx = slots.indexOf(slot);
      if (spellSlots[slotIdx] !== null || spellLocked[slotIdx]) slotIdx = undefined;
    }
    tapLetter(_spellDragIdx, slotIdx);
    _spellDragIdx = null;
  });

  game.addEventListener('touchstart', function(e) {
    const tile = e.target.closest('.letter-tile');
    if (!tile || tile.classList.contains('used')) return;
    _spellDragIdx = parseInt(tile.dataset.tileIdx);
    tile.classList.add('dragging');
    _spellGhost = tile.cloneNode(true);
    _spellGhost.className = 'spell-ghost';
    document.body.appendChild(_spellGhost);
    const t = e.touches[0];
    _spellGhost.style.left = t.clientX + 'px';
    _spellGhost.style.top = t.clientY + 'px';
  }, { passive: true });

  game.addEventListener('touchmove', function(e) {
    if (!_spellGhost) return;
    e.preventDefault();
    const t = e.touches[0];
    _spellGhost.style.left = t.clientX + 'px';
    _spellGhost.style.top = t.clientY + 'px';
    game.querySelectorAll('.spell-slot').forEach(s => s.classList.remove('drag-over'));
    const under = document.elementFromPoint(t.clientX, t.clientY);
    const slot = under ? under.closest('.spell-slot') : null;
    if (slot && !slot.classList.contains('filled') && !slot.classList.contains('correct')) {
      slot.classList.add('drag-over');
    }
  }, { passive: false });

  game.addEventListener('touchend', function(e) {
    game.querySelectorAll('.dragging, .drag-over').forEach(el =>
      el.classList.remove('dragging', 'drag-over'));
    if (_spellGhost) { _spellGhost.remove(); _spellGhost = null; }
    if (_spellDragIdx === null) return;
    const t = e.changedTouches[0];
    const under = document.elementFromPoint(t.clientX, t.clientY);
    const slot = under ? under.closest('.spell-slot') : null;
    let slotIdx;
    if (slot) {
      const slots = Array.from(document.querySelectorAll('.spell-slot'));
      slotIdx = slots.indexOf(slot);
      if (spellSlots[slotIdx] !== null || spellLocked[slotIdx]) slotIdx = undefined;
    }
    tapLetter(_spellDragIdx, slotIdx);
    _spellDragIdx = null;
  });
}

spellBindDrag();

registerScreen('spelling', { init: initSpelling });
