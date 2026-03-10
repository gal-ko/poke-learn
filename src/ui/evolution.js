var STARTER_POKEMON_IDS = [25, 1, 4, 7];
var STARS_PER_EVOLUTION = 25;
var EVOLUTION_STAGE_COUNT = 3;

var evoTimer = null;
var evoPlaying = false;
var _evoAnimTimers = [];

function isStarterPokemon(id) {
  return STARTER_POKEMON_IDS.includes(id);
}

function getEvolutionChain(baseId) {
  if (baseId === 25) return [25, 26];
  return [baseId, baseId + 1, baseId + 2];
}

function getMaxEvoLevel(baseId) {
  return getEvolutionChain(baseId).length - 1;
}

function getEvolutionStage(baseId, starCount) {
  if (!isStarterPokemon(baseId)) return baseId;
  const chain = getEvolutionChain(baseId);
  const level = getEvolutionLevel(starCount, baseId);
  return chain[level];
}

function getEvolutionLevel(starCount, baseId) {
  const maxLevel = baseId !== undefined ? getMaxEvoLevel(baseId) : EVOLUTION_STAGE_COUNT - 1;
  return Math.min(Math.floor(starCount / STARS_PER_EVOLUTION), maxLevel);
}

function syncEvoLevel() {
  const baseId = AppState.getAvatar();
  if (!baseId || !isStarterPokemon(baseId)) return;
  const level = getEvolutionLevel(stars, baseId);
  AppState.setLastEvoLevel(level);
}

function checkStarEvolution() {
  evoTimer = null;
  if (evoPlaying) return;
  const baseId = AppState.getAvatar();
  if (!baseId || !isStarterPokemon(baseId)) return;
  const chain = getEvolutionChain(baseId);
  const prevLevel = getEvolutionLevel(prevStars, baseId);
  const currentLevel = getEvolutionLevel(stars, baseId);
  const lastLevel = AppState.getLastEvoLevel();
  syncPrevStars();
  if (currentLevel > prevLevel && currentLevel > lastLevel) {
    const fromId = chain[prevLevel];
    const toId = chain[currentLevel];
    evoPlaying = true;
    AppState.setLastEvoLevel(currentLevel);
    showEvolution(fromId, toId, () => {
      evoPlaying = false;
      emit('evolution:complete');
    });
  }
}

function getEvoTimer() { return evoTimer; }
function setEvoTimer(t) { evoTimer = t; }

function cancelEvolution() {
  _evoAnimTimers.forEach(function(id) { clearTimeout(id); });
  _evoAnimTimers = [];
  evoPlaying = false;
}

function showEvolution(fromId, toId, callback) {
  cancelEvolution();
  const o = document.createElement('div');
  o.className = 'evo-overlay';
  o.innerHTML = `
    <div class="evo-scene">
      <div class="evo-sprites">
        ${sprite(fromId, 'evo-from')}
        ${sprite(toId, 'evo-to')}
      </div>
      <div class="evo-flash"></div>
    </div>
    <button class="evo-skip" aria-label="Skip">Skip ▸</button>
  `;
  document.body.appendChild(o);

  function finishEvo() {
    cancelEvolution();
    o.remove();
    if (callback) callback();
  }

  o.querySelector('.evo-skip').addEventListener('click', finishEvo);

  _evoAnimTimers.push(setTimeout(() => {
    o.classList.add('evo-phase2');
  }, 1500));
  _evoAnimTimers.push(setTimeout(() => {
    o.classList.add('evo-phase3');
  }, 3000));
  _evoAnimTimers.push(setTimeout(finishEvo, 5500));
}
