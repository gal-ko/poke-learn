var SUCCESS_MESSAGES = [
  "כל הכבוד",
  "מדהים",
  "אלוף",
  "נהדר",
  "מושלם",
  "וואו",
  "מצוין",
  "יש"
];

var STRINGS = {
  welcomeGreeting:  'ברוכים הבאים',
  welcomeSubtitle:  'למד אנגלית עם פוקימון',
  welcomePlayBtn:   '<svg class="mi"><use href="#i-videogame_asset"/></svg> בוא נתחיל',
  returnGreeting:   username => `שלום ${username}`,
  returnSubtitle:   'בוא נמשיך ללמוד אנגלית',
  returnPlayBtn:    '<svg class="mi"><use href="#i-videogame_asset"/></svg> המשך לשחק',
  resetConfirm:     'האם אתה בטוח שברצונך לאפס את כל ההתקדמות',
  starReward:       count => count === 1 ? 'קיבלת כוכב' : `קיבלת ${count} כוכבים`,
  spellHintPrefix:  'רמז: מתחיל ב-',
  dexHeader:        count => `${count} פוקימונים — דור ראשון`,
  abcCountPokemon:  (count, letter) => `${count} פוקימונים מתחילים ב-${letter}`,
  abcCountWords:    (count, letter) => `${count} מילים באנגלית שמכילות ${letter}`,
  listen:           'הקשב',
  likeIn:           word => `כמו ב-${word}`
};
