var selectedAvatar = 0;
var eggTaps = 0;
var eggTimer = null;
var setupStage = 0;

function initProfile() {
  const username = AppState.getUsername();
  const savedAvatar = AppState.getAvatar();
  const input = document.getElementById('profileNameInput');
  const greeting = document.getElementById('profileGreeting');
  const subtitle = document.getElementById('profileSubtitle');
  const playBtn = document.getElementById('profilePlayBtn');

  if (savedAvatar && !isStarterPokemon(savedAvatar)) {
    AppState.setAvatar(STARTER_POKEMON_IDS[0]);
  }
  const baseAvatar = AppState.getAvatar() || STARTER_POKEMON_IDS[0];
  selectedAvatar = baseAvatar;
  const currentStars = AppState.getStars();
  const evolvedId = getEvolutionStage(baseAvatar, currentStars);

  setSprite(document.getElementById('profileMascot'), evolvedId);
  document.getElementById('profileStars').textContent = currentStars;
  document.getElementById('profileGames').textContent = AppState.getGamesCompleted();
  document.getElementById('profilePokemon').textContent = POKEMON.length;

  const stageWrap = document.getElementById('setupStageWrap');

  eggTaps = 0;
  const mascot = document.getElementById('profileMascot');
  mascot.onclick = username ? onMascotTap : null;
  mascot.style.cursor = username ? 'pointer' : '';

  const statsGrid = document.getElementById('profileStats');

  if (username) {
    stageWrap.style.display = 'none';
    statsGrid.style.display = '';
    document.querySelector('.btn-destructive').style.display = '';
    document.querySelector('.profile-card').classList.remove('setup-mode');
    input.value = username;
    input.disabled = true;
    greeting.innerHTML = '<span class="pixel"></span>';
    greeting.querySelector('.pixel').textContent = STRINGS.returnGreeting(username);
    subtitle.textContent = STRINGS.returnSubtitle;
    playBtn.innerHTML = STRINGS.returnPlayBtn;
    playBtn.disabled = false;
    playBtn.onclick = profilePlay;
    renderEvoProgress(baseAvatar, currentStars);
    renderLayoutPicker();
  } else {
    stageWrap.style.display = '';
    statsGrid.style.display = 'none';
    document.querySelector('.btn-destructive').style.display = 'none';
    document.querySelector('.profile-card').classList.add('setup-mode');
    document.getElementById('evoProgress').innerHTML = '';
    document.getElementById('layoutPicker').innerHTML = '';
    showSetupStage(setupStage);
  }
}

function showSetupStage(stage) {
  const input = document.getElementById('profileNameInput');
  const stage0 = document.getElementById('setupStage0');
  const stage1 = document.getElementById('setupStage1');
  const greeting = document.getElementById('profileGreeting');
  const subtitle = document.getElementById('profileSubtitle');
  const playBtn = document.getElementById('profilePlayBtn');

  setupStage = stage;

  stage0.classList.toggle('active', stage === 0);
  stage1.classList.toggle('active', stage === 1);

  if (stage === 0) {
    input.value = '';
    input.disabled = false;
    greeting.innerHTML = `<span class="pixel">${STRINGS.welcomeGreeting}</span>`;
    subtitle.textContent = STRINGS.welcomeSubtitle;
    playBtn.innerHTML = 'הבא ←';
    playBtn.disabled = true;
    playBtn.onclick = advanceSetup;
    setTimeout(() => input.focus(), 100);
  } else {
    renderAvatarPicker(false);
    const name = input.value.replace(/[^\u0590-\u05FFa-zA-Z0-9 ]/g, '').trim();
    greeting.innerHTML = '<span class="pixel"></span>';
    greeting.querySelector('.pixel').textContent = 'היי ' + name + '!';
    subtitle.textContent = 'בחר פוקימון שילווה אותך';
    playBtn.innerHTML = STRINGS.welcomePlayBtn;
    playBtn.disabled = false;
    playBtn.onclick = profilePlay;
  }
}

function advanceSetup() {
  const input = document.getElementById('profileNameInput');
  const name = input.value.replace(/[^\u0590-\u05FFa-zA-Z0-9 ]/g, '').trim();
  if (!name) return;
  showSetupStage(1);
}

function renderLayoutPicker() {
  const current = AppState.getLayout();
  const isDark = current === 'dark';
  const container = document.getElementById('layoutPicker');
  container.innerHTML = `
    <button class="layout-toggle" onclick="toggleLayout()" title="${isDark ? 'מצב בהיר' : 'מצב כהה'}">
      <span class="layout-toggle-icon"><svg class="mi"><use href="#i-${isDark ? 'light_mode' : 'dark_mode'}"/></svg></span>
    </button>
  `;
}

function toggleLayout() {
  const next = AppState.getLayout() === 'dark' ? 'classic' : 'dark';
  applyLayout(next);
  buildMenu();
  renderLayoutPicker();
}

function renderEvoProgress(baseId, starCount) {
  const container = document.getElementById('evoProgress');
  if (!isStarterPokemon(baseId)) { container.innerHTML = ''; return; }
  const chain = getEvolutionChain(baseId);

  const currentLevel = getEvolutionLevel(starCount, baseId);
  const maxLevel = getMaxEvoLevel(baseId);
  const maxStars = maxLevel * STARS_PER_EVOLUTION;
  const clamped = Math.min(starCount, maxStars);
  const percent = Math.round((clamped / maxStars) * 100);

  const stagesHtml = chain.map((id, i) => {
    const p = POKEMON.find(pk => pk.id === id);
    const reached = currentLevel >= i;
    return `<div class="evo-stage ${reached ? 'reached' : ''} ${currentLevel === i ? 'current' : ''}">
      ${sprite(id)}
      <span>${p ? p.he : ''}</span>
      <span class="evo-stage-stars"><svg class="mi"><use href="#i-star"/></svg>${i * STARS_PER_EVOLUTION}</span>
    </div>`;
  }).join('');

  container.innerHTML = `
    <div class="evo-stages">${stagesHtml}</div>
    <div class="evo-bar-wrap">
      <div class="evo-bar-track">
        <div class="evo-bar-fill" id="evoBarFill" style="width:0%"></div>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.getElementById('evoBarFill').style.width = percent + '%';
    });
  });
}

function onMascotTap() {
  eggTaps++;
  if (eggTimer) clearTimeout(eggTimer);
  eggTimer = setTimeout(() => { eggTaps = 0; }, 2000);

  if (eggTaps >= 5) {
    eggTaps = 0;
    const baseId = AppState.getAvatar();
    if (!baseId || !isStarterPokemon(baseId)) return;
    const currentLevel = getEvolutionLevel(AppState.getStars(), baseId);
    const maxLevel = getMaxEvoLevel(baseId);
    if (currentLevel >= maxLevel) return;
    const nextLevel = currentLevel + 1;
    const nextThreshold = nextLevel * STARS_PER_EVOLUTION;
    const chain = getEvolutionChain(baseId);
    const fromId = chain[currentLevel];
    const toId = chain[nextLevel];

    setStars(nextThreshold);
    AppState.setLastEvoLevel(nextLevel);

    showEvolution(fromId, toId, () => {
      updateTopbar();
      initProfile();
    });
  }
}

function renderAvatarPicker(locked) {
  const container = document.getElementById('avatarOptions');
  container.innerHTML = STARTER_POKEMON_IDS.map(id => {
    const p = POKEMON.find(pk => pk.id === id);
    const sel = id === selectedAvatar ? ' selected' : '';
    const dis = locked ? ' locked' : '';
    const themeId = getThemeForPokemon(id);
    const color = themeId ? THEMES[themeId].accent : '';
    const style = color ? `style="--avatar-color:${color}"` : '';
    return `<button class="avatar-option${sel}${dis}" ${style} onclick="${locked ? '' : `pickAvatar(${id})`}" ${locked ? 'disabled' : ''}>
      ${sprite(id)}
      <span>${p ? p.he : ''}</span>
    </button>`;
  }).join('');
}

function pickAvatar(id) {
  selectedAvatar = id;
  setSprite(document.getElementById('profileMascot'), id);
  applyThemeForPokemon(id);
  renderAvatarPicker(false);
}

function onProfileNameInput(e) {
  const name = e.target.value.replace(/[^\u0590-\u05FFa-zA-Z0-9 ]/g, '').trim();
  document.getElementById('profilePlayBtn').disabled = name.length === 0;
}

function onProfileNameKeydown(e) {
  if (e.key !== 'Enter') return;
  if (setupStage !== 0) return;
  e.preventDefault();
  e.stopPropagation();
  advanceSetup();
}

function profilePlay() {
  const input = document.getElementById('profileNameInput');
  const name = input.value.replace(/[^\u0590-\u05FFa-zA-Z0-9 ]/g, '').trim();
  if (!name) return;
  const isNewUser = !AppState.getUsername();
  AppState.setUsername(name);
  AppState.setAvatar(selectedAvatar);
  if (isNewUser) AppState.setLastEvoLevel(0);
  showScreen('menu');
}

function resetProgress() {
  if (!confirm(STRINGS.resetConfirm)) return;
  AppState.resetProgress();
  setStars(0);
  selectedAvatar = STARTER_POKEMON_IDS[0];
  setupStage = 0;
  applyThemeForPokemon(selectedAvatar);
  applyLayout(resolveLayout());
  syncEvoLevel();
  initProfile();
  showScreen('profile');
}

document.addEventListener('keydown', function(e) {
  if (currentScreen !== 'profile') return;
  if (AppState.getUsername()) return;
  if (setupStage !== 1) return;
  if (e.key === 'Enter') {
    e.preventDefault();
    profilePlay();
    return;
  }
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  e.preventDefault();
  const idx = STARTER_POKEMON_IDS.indexOf(selectedAvatar);
  const dir = e.key === 'ArrowLeft' ? 1 : -1;
  const next = (idx + dir + STARTER_POKEMON_IDS.length) % STARTER_POKEMON_IDS.length;
  pickAvatar(STARTER_POKEMON_IDS[next]);
  const opts = document.querySelectorAll('.avatar-option');
  opts.forEach(o => o.classList.remove('flash'));
  if (opts[next]) {
    opts[next].classList.add('flash');
    setTimeout(() => opts[next].classList.remove('flash'), 200);
  }
});

registerScreen('profile', { init: initProfile });
