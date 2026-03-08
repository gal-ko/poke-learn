var LETTER_HERO = {
  Q: { visual: "👑", word: "Queen" },
  U: { visual: '<span class="mi" style="font-size:64px">arrow_upward</span>', word: "Up" },
  X: { visual: 137, word: "X-ray" },
  Y: { visual: "💛", word: "Yellow" }
};

var LETTER_WORDS = {
  Q: [
    { word: "Queen", he: "מלכה", pokemonId: 31, context: "נידוקווין היא מלכת הרעל" },
    { word: "Quick", he: "מהיר", pokemonId: 25, context: "פיקאצ'ו משתמש במתקפה מהירה" },
    { word: "Quiet", he: "שקט", pokemonId: 143, context: "שקט.. סנורלקס ישן" },
    { word: "Quest", he: "מסע", pokemonId: 6, context: "צא למסע לאסוף את כולם" }
  ],
  U: [
    { word: "Under", he: "מתחת", pokemonId: 50, context: "דיגלט מתחבא מתחת לאדמה" },
    { word: "Up", he: "למעלה", pokemonId: 142, context: "אירודקטיל עף למעלה" },
    { word: "Use", he: "להשתמש", pokemonId: 65, context: "אלקזאם משתמש בטלקינזיס" },
    { word: "Unique", he: "ייחודי", pokemonId: 132, context: "כל פוקימון הוא ייחודי" }
  ],
  X: [
    { word: "X-ray", he: "רנטגן", pokemonId: 137, context: "פוריגון יכול לראות דרך הכל" },
    { word: "Fox", he: "שועל", pokemonId: 37, context: "וולפיקס הוא שועל אש" },
    { word: "Relax", he: "להירגע", pokemonId: 143, context: "סנורלקס אוהב להירגע" },
    { word: "Toxic", he: "רעיל", pokemonId: 89, context: "מאק הוא פוקימון רעיל" }
  ],
  Y: [
    { word: "Yellow", he: "צהוב", pokemonId: 25, context: "פיקאצ'ו הוא צהוב" },
    { word: "Yell", he: "לצעוק", pokemonId: 130, context: "גיאראדוס צועק בקול רם" },
    { word: "Young", he: "צעיר", pokemonId: 147, context: "דרטיני הוא דרקון צעיר" },
    { word: "Yarn", he: "חוט", pokemonId: 52, context: "מיאות' אוהב לשחק עם חוט" }
  ]
};

var LETTER_PRONUNCIATION = {
  A: { phonetic: "אֵיי", exampleWord: "Apple" },
  B: { phonetic: "בִּי", exampleWord: "Ball" },
  C: { phonetic: "סִי", exampleWord: "Cat" },
  D: { phonetic: "דִי", exampleWord: "Dog" },
  E: { phonetic: "אִי", exampleWord: "Egg" },
  F: { phonetic: "אֶף", exampleWord: "Fish" },
  G: { phonetic: "ג'י", exampleWord: "Game" },
  H: { phonetic: "אֵייצ'", exampleWord: "Hat" },
  I: { phonetic: "אַיי", exampleWord: "Ice" },
  J: { phonetic: "ג'יי", exampleWord: "Jump" },
  K: { phonetic: "קֵיי", exampleWord: "Key" },
  L: { phonetic: "אֶל", exampleWord: "Lamp" },
  M: { phonetic: "אֶם", exampleWord: "Moon" },
  N: { phonetic: "אֶן", exampleWord: "Nest" },
  O: { phonetic: "אוֹ", exampleWord: "Orange" },
  P: { phonetic: "פִּי", exampleWord: "Pikachu" },
  Q: { phonetic: "קְיוּ" },
  R: { phonetic: "אָר", exampleWord: "Run" },
  S: { phonetic: "אֶס", exampleWord: "Star" },
  T: { phonetic: "טִי", exampleWord: "Tree" },
  U: { phonetic: "יוּ" },
  V: { phonetic: "וִי", exampleWord: "Violin" },
  W: { phonetic: "דַבְּליוּ", exampleWord: "Water" },
  X: { phonetic: "אֶקְס" },
  Y: { phonetic: "וַוי" },
  Z: { phonetic: "זֶד", exampleWord: "Zebra" }
};

for (const letter of Object.keys(LETTER_PRONUNCIATION)) {
  if (!LETTER_PRONUNCIATION[letter].exampleWord && LETTER_WORDS[letter]) {
    LETTER_PRONUNCIATION[letter].exampleWord = LETTER_WORDS[letter][0].word;
  }
}
