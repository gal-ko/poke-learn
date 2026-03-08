var vocabCat = 0;
var vocabIdx = 0;
var vocabTabsBuilt = false;

function buildCategoryTabs() {
  const c = document.getElementById('categoryTabs');
  c.innerHTML = VOCAB_CATEGORIES.map((cat, i) =>
    `<button class="btn-tertiary${i === 0 ? ' active' : ''}" onclick="switchCat(${i})">${cat.he}</button>`
  ).join('');
}

function switchCat(i) {
  vocabCat = i;
  vocabIdx = 0;
  document.querySelectorAll('.btn-tertiary').forEach((t, j) => t.classList.toggle('active', j === i));
  renderVocab();
}

function initVocab() {
  if (!vocabTabsBuilt) { buildCategoryTabs(); vocabTabsBuilt = true; }
  vocabIdx = 0;
  renderVocab();
}

function renderVocab() {
  const cat = VOCAB_CATEGORIES[vocabCat];
  const w = cat.words[vocabIdx];
  const pid = pick(w.pokemon);
  document.getElementById('vocabSprite').src = sprite(pid);
  document.getElementById('vocabEnglish').textContent = w.en;
  document.getElementById('vocabHebrew').textContent = w.he;
  document.getElementById('vocabCategory').textContent = cat.he;
}

function vocabNext() {
  const cat = VOCAB_CATEGORIES[vocabCat];
  vocabIdx = (vocabIdx + 1) % cat.words.length;
  renderVocab();
}

function vocabPrev() {
  const cat = VOCAB_CATEGORIES[vocabCat];
  vocabIdx = (vocabIdx - 1 + cat.words.length) % cat.words.length;
  renderVocab();
}

function speakWord() {
  const w = VOCAB_CATEGORIES[vocabCat].words[vocabIdx];
  speak(w.en);
}

registerScreen('vocabulary', { init: initVocab });
