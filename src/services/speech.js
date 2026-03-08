function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  var output = POKEMON_PRONUNCIATION[text];
  if (!output) {
    output = text.replace(/[A-Z][a-z'-]*/g, w => POKEMON_PRONUNCIATION[w] || w);
  }
  const u = new SpeechSynthesisUtterance(output);
  u.lang = 'en-US';
  u.rate = 0.8;
  window.speechSynthesis.speak(u);
}
