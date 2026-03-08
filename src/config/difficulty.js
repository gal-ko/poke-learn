var DIFF_MAX_EASY = 5;
var DIFF_MIN_HARD = 7;

function filterByDifficulty(diff, list) {
  var pool;
  if (diff === 'easy') pool = list.filter(function(p) { return p.name.length <= DIFF_MAX_EASY; });
  else if (diff === 'medium') pool = list.filter(function(p) { return p.name.length >= DIFF_MAX_EASY && p.name.length <= DIFF_MIN_HARD; });
  else pool = list.filter(function(p) { return p.name.length >= DIFF_MIN_HARD; });
  return pool.length ? pool : list;
}
