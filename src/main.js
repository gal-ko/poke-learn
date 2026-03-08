setBuildMenu(buildMenu);

var container = document.querySelector('.container');
container.innerHTML =
  profileTemplate() +
  '<div class="menu-screen" id="menuScreen" style="display:none"></div>' +
  vocabularyTemplate() +
  spellingTemplate() +
  memoryTemplate() +
  sentenceCompletionTemplate() +
  alphabetTemplate() +
  pokedexTemplate();

on('stars:changed', function() {
  var timer = getEvoTimer();
  if (timer) clearTimeout(timer);
  setEvoTimer(setTimeout(checkStarEvolution, 3500));
});

on('evolution:complete', function() { updateTopbar(); });

function init() {
  applyTheme(resolveTheme());
  applyLayout(resolveLayout());
  buildMenu();
  updateStarDisplay();
  syncEvoLevel();

  if (location.hash && AppState.getUsername()) {
    navigateToHash(location.hash);
  } else if (AppState.getUsername()) {
    showScreen('menu');
  } else {
    showScreen('profile');
  }
}

init();
