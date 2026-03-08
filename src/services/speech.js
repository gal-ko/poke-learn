function speak(text) {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var output = POKEMON_PRONUNCIATION[text];
    if (!output) {
      output = text.replace(/[A-Z][a-z'-]*/g, w => POKEMON_PRONUNCIATION[w] || w);
    }
    const u = new SpeechSynthesisUtterance(output);
    u.lang = 'en-US';
    u.rate = 0.8;
    u.onerror = function() {};
    window.speechSynthesis.speak(u);
  } catch (e) {}
}
