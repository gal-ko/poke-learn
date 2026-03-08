var readAnswered = false;
var readCategory = 'colors';
var readCurrent = null;
var readQueue = [];

function setReadCategory(cat) {
  readCategory = cat;
  renderCategoryBar();
  readQueue = [];
  initReading();
}

function renderCategoryBar() {
  const bar = document.getElementById('readCategoryBar');
  bar.innerHTML = READING_CATEGORIES.map(c =>
    `<button class="btn-tertiary${c.id === readCategory ? ' active' : ''}" onclick="setReadCategory('${c.id}')">${c.label}</button>`
  ).join('');
}

function buildReadQueue() {
  const field = readCategory === 'colors' ? 'color'
              : readCategory === 'numbers' ? 'number'
              : 'animal';
  const pool = POKEMON.filter(p => p[field]);
  readQueue = shuffle([...pool]);
}

function nextFromQueue() {
  if (readQueue.length === 0) buildReadQueue();
  return readQueue.pop();
}

function makeQuestion(p) {
  if (readCategory === 'colors') {
    const allValues = POKEMON.filter(x => x.color).map(x => x.color);
    const others = pickDistractors(allValues, p.color, 2);
    return {
      pid: p.id, sentence: `${p.name} is ____.`,
      answer: p.color, he: COLOR_HE[p.color] || p.color,
      opts: shuffle([p.color, ...others])
    };
  }
  if (readCategory === 'numbers') {
    const allValues = POKEMON.filter(x => x.number).map(x => x.number.value);
    const others = pickDistractors(allValues, p.number.value, 2);
    return {
      pid: p.id, sentence: `${p.name} has ____ ${p.number.fact}.`,
      answer: p.number.value, he: NUMBER_HE[p.number.value] || p.number.value,
      opts: shuffle([p.number.value, ...others])
    };
  }
  const allValues = POKEMON.filter(x => x.animal).map(x => x.animal);
  const others = pickDistractors(allValues, p.animal, 2);
  return {
    pid: p.id, sentence: `${p.name} is a ____.`,
    answer: p.animal, he: ANIMAL_HE[p.animal] || p.animal,
    opts: shuffle([p.animal, ...others])
  };
}

function pickDistractors(allValues, correct, count) {
  const unique = [...new Set(allValues.filter(v => v !== correct))];
  shuffle(unique);
  return unique.slice(0, count);
}

function initReading() {
  renderCategoryBar();
  readAnswered = false;
  readCurrent = makeQuestion(nextFromQueue());
  renderReading();
}

function nextReading() {
  readAnswered = false;
  readCurrent = makeQuestion(nextFromQueue());
  renderReading();
}

function renderReading() {
  const r = readCurrent;
  document.getElementById('readSprite').src = sprite(r.pid);

  const blank = '<span class="read-blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>';
  const display = r.sentence.replace('____', blank);
  document.getElementById('readingText').innerHTML = display;

  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const qa = document.getElementById('quizArea');
  qa.innerHTML = `
    <div class="quiz-options">
      ${r.opts.map((o, i) => `<div class="quiz-opt-wrap" id="quizOpt${i}"><button class="quiz-opt-answer" onclick="answerQuiz(${i})">${cap(o)}</button><button class="quiz-opt-speak" onclick="speak('${o.replace(/'/g, "\\'")}')"><span class="mi">volume_up</span></button></div>`).join('')}
    </div>
  `;
}

function answerQuiz(i) {
  if (readAnswered) return;
  readAnswered = true;
  const r = readCurrent;
  const wraps = document.querySelectorAll('.quiz-opt-wrap');
  const picked = wraps[i].querySelector('.quiz-opt-answer').textContent.toLowerCase();
  const correct = r.answer.toLowerCase();

  let correctIdx = -1;
  wraps.forEach((w, j) => {
    if (w.querySelector('.quiz-opt-answer').textContent.toLowerCase() === correct) correctIdx = j;
  });
  wraps[correctIdx].classList.add('correct-answer');

  const blankEl = document.querySelector('.read-blank');
  if (blankEl) {
    blankEl.textContent = r.answer.charAt(0).toUpperCase() + r.answer.slice(1);
    blankEl.classList.add('filled');
  }

  if (picked === correct) {
    addStar(1);
    AppState.incrementGamesCompleted();
    showCaught(r.pid, STRINGS.starReward(1), 1);
  } else {
    wraps[i].classList.add('wrong-answer');
  }
  setTimeout(() => nextReading(), 2500);
}

function speakReading() {
  const r = readCurrent;
  speak(r.sentence.replace('____.', '').replace('____', '').trim());
}

registerScreen('sentence_completion', { init: initReading });
