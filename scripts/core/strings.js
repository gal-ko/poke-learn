const SUCCESS_MESSAGES = [
  "כל הכבוד",
  "מדהים",
  "אלוף",
  "נהדר",
  "מושלם",
  "וואו",
  "מצוין",
  "יש"
];

const STRINGS = {
  welcomeGreeting:  'ברוכים הבאים',
  welcomeSubtitle:  'למד אנגלית עם פוקימון',
  welcomePlayBtn:   '<span class="mi">videogame_asset</span> בוא נתחיל',
  returnGreeting:   username => `שלום ${username}`,
  returnSubtitle:   'בוא נמשיך ללמוד אנגלית',
  returnPlayBtn:    '<span class="mi">videogame_asset</span> המשך לשחק',
  resetConfirm:     'האם אתה בטוח שברצונך לאפס את כל ההתקדמות',
  starReward:       count => count === 1 ? 'קיבלת כוכב' : `קיבלת ${count} כוכבים`,
  spellHintPrefix:  'רמז: מתחיל ב-',
  dexHeader:        count => `${count} פוקימונים — דור ראשון`,
  abcCountPokemon:  (count, letter) => `${count} פוקימונים מתחילים ב-${letter}`,
  abcCountWords:    (count, letter) => `${count} מילים באנגלית שמכילות ${letter}`,
  listen:           'הקשב',
  likeIn:           word => `כמו ב-${word}`
};
