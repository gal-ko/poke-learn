var THEME_COMPACT = {
  bulbasaur:  { bg:'#162428', mid:'#1E3438', srf:'#28484E', acc:'#50C0A8', hov:'#70E0C8', pid:1  },
  charmander: { bg:'#1E2838', mid:'#28394D', srf:'#325065', acc:'#F09858', hov:'#FFB478', pid:4  },
  squirtle:   { bg:'#141E30', mid:'#1A2C48', srf:'#243B5C', acc:'#58A8F0', hov:'#80C4FF', pid:7  },
  pikachu:    { bg:'#1A1A2E', mid:'#16213E', srf:'#0F3460', acc:'#FFCB05', hov:'#FFE066', pid:25 }
};

var THEMES = {};
Object.keys(THEME_COMPACT).forEach(function(key) {
  var t = THEME_COMPACT[key];
  THEMES[key] = {
    pokemonId:   t.pid,
    bgDeep:      t.bg,
    bgMid:       t.mid,
    bgSurface:   t.srf,
    accent:      t.acc,
    accentHover: t.hov
  };
});
