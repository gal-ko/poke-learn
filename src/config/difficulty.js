var DIFF_MAX_EASY = 4;
var DIFF_MIN_MEDIUM = 5;
var DIFF_MAX_MEDIUM = 6;
var DIFF_MIN_HARD = 7;

var DIFF_LABEL_EASY = 'קל<span class="diff-sub">3-' + DIFF_MAX_EASY + ' אותיות</span>';
var DIFF_LABEL_MEDIUM = 'בינוני<span class="diff-sub">' + DIFF_MIN_MEDIUM + '-' + DIFF_MAX_MEDIUM + ' אותיות</span>';
var DIFF_LABEL_HARD = 'קשה<span class="diff-sub">' + DIFF_MIN_HARD + '+ אותיות</span>';

function filterByDifficulty(diff, list) {
  var pool;
  if (diff === 'easy') pool = list.filter(function(p) { return p.name.length >= 3 && p.name.length <= DIFF_MAX_EASY; });
  else if (diff === 'medium') pool = list.filter(function(p) { return p.name.length >= DIFF_MIN_MEDIUM && p.name.length <= DIFF_MAX_MEDIUM; });
  else pool = list.filter(function(p) { return p.name.length >= DIFF_MIN_HARD; });
  return pool.length ? pool : list;
}
