const STARTER_POKEMON_IDS = [25, 1, 4, 7];
const STARS_PER_EVOLUTION = 25;
const EVOLUTION_STAGE_COUNT = 3;

let evoTimer = null;
let evoPlaying = false;
let onEvoComplete = null;

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
  prevStars = stars;
  if (currentLevel > prevLevel && currentLevel > lastLevel) {
    const fromId = chain[prevLevel];
    const toId = chain[currentLevel];
    evoPlaying = true;
    AppState.setLastEvoLevel(currentLevel);
    showEvolution(fromId, toId, () => {
      evoPlaying = false;
      if (onEvoComplete) onEvoComplete();
    });
  }
}

function showEvolution(fromId, toId, callback) {
  const o = document.createElement('div');
  o.className = 'evo-overlay';
  o.innerHTML = `
    <div class="evo-scene">
      <div class="evo-sprites">
        <img class="evo-from" src="${sprite(fromId)}" alt="">
        <img class="evo-to" src="${sprite(toId)}" alt="">
      </div>
      <div class="evo-flash"></div>
    </div>
  `;
  document.body.appendChild(o);
  setTimeout(() => {
    o.classList.add('evo-phase2');
  }, 1500);
  setTimeout(() => {
    o.classList.add('evo-phase3');
  }, 3000);
  setTimeout(() => {
    o.remove();
    if (callback) callback();
  }, 5500);
}
