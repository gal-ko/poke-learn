var SPELL_NEXT_ROUND_DELAY = 2800;
var SPELL_WRONG_LOCK_DELAY = 1200;

var spellDiff = 'easy';
var spellWord = '';
var spellPokemon = null;
var spellSlots = [];
var spellLetters = [];
var spellLocked = [];
var spellQueue = [];
var spellQueueDiff = '';

function spellKeyHandler(e) {
  if (currentScreen !== 'spelling') return;
  if (e.target && e.target.classList && e.target.classList.contains('spell-slot')) return;
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
  spellQueue = shuffle([...filterByDifficulty(spellDiff, POKEMON)]);
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

  setSprite(document.getElementById('spellSprite'), spellPokemon.id);
  renderSpellSlots();
  renderLetterTiles();
  spellBindDrag();
  spellFocusNextEmpty();
}

function renderSpellSlots() {
  const c = document.getElementById('spellSlots');
  c.innerHTML = '';
  for (let i = 0; i < spellWord.length; i++) {
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.maxLength = 1;
    inp.autocomplete = 'off';
    inp.setAttribute('autocorrect', 'off');
    inp.setAttribute('autocapitalize', 'characters');
    inp.setAttribute('spellcheck', 'false');
    inp.setAttribute('inputmode', 'text');
    inp.dataset.idx = i;
    const entry = spellSlots[i];
    const hasLetter = entry !== null;
    inp.className = 'spell-slot' + (hasLetter ? ' filled' : '') + (spellLocked[i] ? ' correct' : '');
    if (hasLetter) {
      inp.value = entry.letter;
      if (spellLocked[i]) {
        inp.readOnly = true;
      }
    }
    inp.addEventListener('input', spellSlotInput);
    inp.addEventListener('keydown', spellSlotKeydown);
    inp.addEventListener('focus', function() { this.select(); });
    c.appendChild(inp);
  }
}

function spellSlotInput(e) {
  var inp = e.target;
  var idx = parseInt(inp.dataset.idx);
  var raw = inp.value.toUpperCase();
  inp.value = '';
  if (!raw) return;
  var ch = raw[raw.length - 1];
  if (HEBREW_TO_ENGLISH_KEYS[ch]) ch = HEBREW_TO_ENGLISH_KEYS[ch];
  if (!/^[A-Z]$/.test(ch)) return;

  if (spellSlots[idx] !== null && !spellLocked[idx]) {
    removeSlot(idx);
  }

  for (var i = 0; i < spellLetters.length; i++) {
    if (!spellLetters[i].used && spellLetters[i].letter === ch) {
      tapLetter(i, idx);
      spellFocusNextEmpty(idx + 1);
      return;
    }
  }
}

function spellSlotKeydown(e) {
  var idx = parseInt(e.target.dataset.idx);
  if (e.key === 'Backspace') {
    e.preventDefault();
    if (spellSlots[idx] !== null && !spellLocked[idx]) {
      removeSlot(idx);
      spellFocusSlot(idx);
    } else {
      for (var p = idx - 1; p >= 0; p--) {
        if (spellSlots[p] !== null && !spellLocked[p]) {
          removeSlot(p);
          spellFocusSlot(p);
          return;
        }
      }
    }
    return;
  }
  if (e.key === 'ArrowRight') { e.preventDefault(); spellFocusSlot(idx + 1); return; }
  if (e.key === 'ArrowLeft') { e.preventDefault(); spellFocusSlot(idx - 1); return; }
}

function spellFocusSlot(idx) {
  var slots = document.querySelectorAll('#spellSlots .spell-slot');
  if (idx >= 0 && idx < slots.length) slots[idx].focus();
}

function spellFocusNextEmpty(startFrom) {
  var slots = document.querySelectorAll('#spellSlots .spell-slot');
  var start = startFrom || 0;
  for (var i = start; i < slots.length; i++) {
    if (spellSlots[i] === null && !spellLocked[i]) { slots[i].focus(); return; }
  }
  for (var j = 0; j < start; j++) {
    if (spellSlots[j] === null && !spellLocked[j]) { slots[j].focus(); return; }
  }
  if (document.activeElement) document.activeElement.blur();
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
  } else {
    spellFocusNextEmpty(slotIdx + 1);
  }
}

function removeSlot(idx) {
  if (spellSlots[idx] === null || spellLocked[idx]) return;
  spellLetters[spellSlots[idx].tileIdx].used = false;
  spellSlots[idx] = null;
  renderSpellSlots();
  renderLetterTiles();
  spellFocusSlot(idx);
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
  spellFocusSlot(lastIdx);
}

function spellCheck() {
  const allFilled = spellSlots.every(s => s !== null);
  if (!allFilled) return;
  const guess = spellSlots.map(s => s.letter).join('');
  const slotEls = document.querySelectorAll('.spell-slot');
  if (guess === spellWord) {
    slotEls.forEach(s => { s.classList.add('correct'); s.readOnly = true; });
    addStar(1);
    AppState.incrementGamesCompleted();
    showCaught(spellPokemon.id, STRINGS.starReward(1), 1);
    _spellTimeout(() => initSpelling(), SPELL_NEXT_ROUND_DELAY);
  } else {
    slotEls.forEach((s, i) => {
      if (spellSlots[i].letter === spellWord[i]) {
        s.classList.add('correct');
      } else {
        s.classList.add('wrong');
      }
    });
    _spellTimeout(() => {
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
      spellFocusNextEmpty();
    }, SPELL_WRONG_LOCK_DELAY);
  }
}

var _spellDragIdx = null;
var _spellGhost = null;
var _spellDragBound = false;
var _spellTimers = [];

function _spellTimeout(fn, ms) {
  var id = setTimeout(function() {
    _spellTimers = _spellTimers.filter(function(t) { return t !== id; });
    fn();
  }, ms);
  _spellTimers.push(id);
  return id;
}

function cleanupSpelling() {
  _spellTimers.forEach(function(id) { clearTimeout(id); });
  _spellTimers = [];
}

function spellBindDrag() {
  if (_spellDragBound) return;
  _spellDragBound = true;
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

registerScreen('spelling', { init: initSpelling, cleanup: cleanupSpelling });
