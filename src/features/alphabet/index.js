var abcCurrentIdx = 0;
var abcLetters = [];

function initAlphabet() {
  abcLetters = [];
  for (let code = 65; code <= 90; code++) {
    const letter = String.fromCharCode(code);
    const pokemon = POKEMON.filter(p =>
      p.name.charAt(0).toUpperCase() === letter
    );
    const words = LETTER_WORDS[letter] || null;
    abcLetters.push({ letter, pokemon, words });
  }
  abcCurrentIdx = 0;
  renderAlphabet();
  renderAbcNav();
}

function renderAbcNav() {
  const nav = document.getElementById('abcLetterNav');
  nav.innerHTML = abcLetters.map((item, i) => {
    const isWords = item.pokemon.length === 0;
    const cls = `abc-letter-btn${i === abcCurrentIdx ? ' active' : ''}${isWords ? ' words-only' : ''}`;
    return `<button class="${cls}" onclick="jumpToLetter(${i})">${item.letter}</button>`;
  }).join('');
}

function jumpToLetter(i) {
  abcCurrentIdx = i;
  renderAlphabet();
  renderAbcNav();
}

function abcPrev() {
  abcCurrentIdx = (abcCurrentIdx - 1 + abcLetters.length) % abcLetters.length;
  renderAlphabet();
  renderAbcNav();
}

function abcNext() {
  abcCurrentIdx = (abcCurrentIdx + 1) % abcLetters.length;
  renderAlphabet();
  renderAbcNav();
}

function renderAlphabet() {
  const item = abcLetters[abcCurrentIdx];
  const letter = item.letter;
  const lower = letter.toLowerCase();
  const info = LETTER_PRONUNCIATION[letter];

  const hasPokemon = item.pokemon.length > 0;
  const firstPokemon = hasPokemon ? item.pokemon[0] : null;
  const hero = LETTER_HERO[letter] || null;

  let heroVisual = '';
  let heroName = '';
  if (firstPokemon) {
    heroVisual = `<img class="abc-hero-sprite" src="${sprite(firstPokemon.id)}" alt="${firstPokemon.name}">`;
    heroName = `<div class="abc-hero-name">${highlightLetter(firstPokemon.name, letter)}</div>`;
  } else if (hero) {
    if (typeof hero.visual === 'number') {
      heroVisual = `<img class="abc-hero-sprite" src="${sprite(hero.visual)}" alt="">`;
    } else {
      heroVisual = `<div class="abc-hero-emoji">${hero.visual}</div>`;
    }
    heroName = `<div class="abc-hero-name">${highlightLetter(hero.word, letter)}</div>`;
  }

  document.getElementById('abcHero').innerHTML = `
    <div class="abc-hero-letter">
      <div class="abc-hero-letters"><span class="abc-hero-big">${letter}</span><span class="abc-hero-small">${lower}</span></div>
      <div class="abc-hero-bottom-row">
        <button class="abc-hero-speak" onclick="speakLetter()" title="${STRINGS.listen}"><span class="mi">volume_up</span></button>
        <div class="abc-hero-phonetic">${info.phonetic}</div>
      </div>
    </div>
    <div class="abc-hero-right">
      ${heroVisual}
      ${heroName}
    </div>
  `;

  const grid = document.getElementById('abcPokemonGrid');

  if (hasPokemon) {
    document.getElementById('abcCount').textContent = STRINGS.abcCountPokemon(item.pokemon.length, letter);
    grid.innerHTML = item.pokemon.map(p => `
      <div class="abc-pokemon-card" onclick="speak('${p.name.replace(/'/g, "\\'")}')">
        <img src="${sprite(p.id)}" alt="${p.name}">
        <span class="abc-poke-name">${highlightLetter(p.name, letter)}</span>
        <span class="abc-poke-he">${p.he}</span>
      </div>
    `).join('');
  } else if (item.words) {
    document.getElementById('abcCount').textContent = STRINGS.abcCountWords(item.words.length, letter);
    grid.innerHTML = item.words.map(w => `
      <div class="abc-word-card" onclick="speak('${w.word.replace(/'/g, "\\'")}')">
        <img src="${sprite(w.pokemonId)}" alt="${w.word}">
        <span class="abc-poke-name">${highlightLetter(w.word, letter)}</span>
        <span class="abc-poke-he">${w.he}</span>
        <span class="abc-word-context">${w.context}</span>
      </div>
    `).join('');
  }
}

function highlightLetter(word, letter) {
  const firstMatches = word.charAt(0).toUpperCase() === letter;
  let highlighted = false;
  return word.split('').map(ch => {
    if (ch.toUpperCase() !== letter) return ch;
    if (firstMatches && highlighted) return ch;
    highlighted = true;
    return `<strong>${ch}</strong>`;
  }).join('');
}

function speakLetter() {
  const item = abcLetters[abcCurrentIdx];
  const letter = item.letter.toLowerCase();
  const hero = LETTER_HERO[item.letter];
  const target = item.pokemon.length > 0
    ? item.pokemon[0].name
    : (hero ? hero.word : null);
  if (!target) { speak(letter); return; }
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const pronTarget = POKEMON_PRONUNCIATION[target] || target;
  const u1 = new SpeechSynthesisUtterance(letter);
  u1.lang = 'en-US';
  u1.rate = 0.7;
  const u2 = new SpeechSynthesisUtterance(`is for ${pronTarget}`);
  u2.lang = 'en-US';
  u2.rate = 0.8;
  window.speechSynthesis.speak(u1);
  window.speechSynthesis.speak(u2);
}

function flashArrow(selector) {
  const btn = document.querySelector(selector);
  if (!btn) return;
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 150);
}

document.addEventListener('keydown', function(e) {
  if (currentScreen !== 'alphabet') return;
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    flashArrow('.abc-hero-speak');
    speakLetter();
    return;
  }
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    flashArrow('.abc-arrow-right');
    abcNext();
    return;
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    flashArrow('.abc-arrow-left');
    abcPrev();
    return;
  }
  let ch = e.key.toUpperCase();
  if (HEBREW_TO_ENGLISH_KEYS[e.key]) ch = HEBREW_TO_ENGLISH_KEYS[e.key];
  if (!/^[A-Z]$/.test(ch)) return;
  const idx = abcLetters.findIndex(item => item.letter === ch);
  if (idx !== -1) {
    e.preventDefault();
    jumpToLetter(idx);
  }
});

registerScreen('alphabet', { init: initAlphabet });
