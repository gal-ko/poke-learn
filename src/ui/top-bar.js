function updateTopbar() {
  const name = AppState.getUsername();
  const hasUser = !!name;
  document.getElementById('topbarUsername').textContent = name || '';
  document.getElementById('starCount').parentElement.style.display = hasUser ? '' : 'none';
  const titleBtn = document.getElementById('titleBtn');
  titleBtn.style.cursor = hasUser ? 'pointer' : 'default';
  const avatarId = AppState.getAvatar();
  if (avatarId) {
    const evolvedId = getEvolutionStage(avatarId, AppState.getStars());
    document.getElementById('topbarAvatar').src = sprite(evolvedId);
  }
}
