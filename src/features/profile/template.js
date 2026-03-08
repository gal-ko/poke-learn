function profileTemplate() {
  return `
    <div id="profile-screen" style="display:none">
      <div class="profile-card">
        <img class="profile-mascot" id="profileMascot" src="sprites/1.png" alt="">
        <div class="profile-greeting" id="profileGreeting"></div>
        <p class="profile-subtitle" id="profileSubtitle"></p>

        <div class="setup-stage-wrap" id="setupStageWrap">
          <div class="setup-stage" id="setupStage0">
            <div class="profile-input-group">
              <input class="profile-input" id="profileNameInput" type="text"
                     dir="rtl" placeholder="קוראים לי..." maxlength="20" autocomplete="off"
                     oninput="onProfileNameInput(event)" onkeydown="onProfileNameKeydown(event)">
            </div>
          </div>
          <div class="setup-stage" id="setupStage1">
            <div class="avatar-picker" id="avatarPicker">
              <div class="avatar-options" id="avatarOptions"></div>
            </div>
          </div>
        </div>

        <div class="evo-progress" id="evoProgress"></div>

        <div class="layout-picker" id="layoutPicker"></div>

        <div class="stats-grid" id="profileStats">
          <div class="stat-card">
            <span class="stat-icon"><span class="mi">star</span></span>
            <span class="stat-value" id="profileStars">0</span>
            <span class="stat-label">כוכבים</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon"><span class="mi">videogame_asset</span></span>
            <span class="stat-value" id="profileGames">0</span>
            <span class="stat-label">משחקים</span>
          </div>
          <div class="stat-card">
            <span class="stat-icon"><span class="mi">menu_book</span></span>
            <span class="stat-value" id="profilePokemon">0</span>
            <span class="stat-label">פוקימונים</span>
          </div>
        </div>

        <div class="profile-actions">
          <button class="btn btn-primary" id="profilePlayBtn" disabled><span class="mi">videogame_asset</span> בוא נתחיל</button>
          <button class="btn btn-destructive" onclick="resetProgress()"><span class="mi">restart_alt</span> התחל מחדש</button>
        </div>
      </div>
    </div>`;
}
