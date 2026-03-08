var CONFETTI_COLORS = ['#E3350D', '#3B4CCA', '#FFCB05', '#4CAF50', '#F85888', '#6890F0'];

var stars = AppState.getStars();
var prevStars = stars;

function syncPrevStars() { prevStars = stars; }

function addStar(count) {
  count = count || 1;
  stars += count;
  AppState.setStars(stars);
  emit('stars:changed');
}

function setStars(count) {
  stars = count;
  prevStars = count;
  AppState.setStars(stars);
  updateStarDisplay();
}

function updateStarDisplay() {
  var stored = AppState.getStars();
  if (stored !== stars) stars = stored;
  document.getElementById('starCount').textContent = stars;
}

function showConfetti() {
  const c = document.createElement('div');
  c.className = 'confetti-container';
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    p.style.animationDelay = Math.random() * 1 + 's';
    p.style.width = (6 + Math.random() * 8) + 'px';
    p.style.height = (6 + Math.random() * 8) + 'px';
    p.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
    frag.appendChild(p);
  }
  c.appendChild(frag);
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 3000);
}

function showCaught(pid, starText, starCount) {
  starCount = starCount || 1;
  const msg = pick(SUCCESS_MESSAGES);
  const o = document.createElement('div');
  o.className = 'caught-overlay';
  o.innerHTML = `<div class="caught-msg">${sprite(pid)}<h3 class="pixel">${msg}</h3>${starText ? `<p class="caught-stars" id="caughtStarsEl"><svg class="mi"><use href="#i-star"/></svg> ${starText}</p>` : ''}</div>`;
  document.body.appendChild(o);
  showConfetti();

  setTimeout(() => {
    flyStarsToCounter(starCount, () => {
      if (o.parentNode) o.remove();
    });
  }, 1800);
}

function flyStarsToCounter(count, callback) {
  const target = document.getElementById('starCount');
  const targetRect = target.getBoundingClientRect();
  const sourceEl = document.getElementById('caughtStarsEl');
  const sourceRect = sourceEl
    ? sourceEl.getBoundingClientRect()
    : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };

  const startX = sourceRect.left + sourceRect.width / 2;
  const startY = sourceRect.top + sourceRect.height / 2;
  const dx = targetRect.left + targetRect.width / 2 - startX;
  const dy = targetRect.top + targetRect.height / 2 - startY;

  let done = 0;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'flying-star';
    star.innerHTML = '<svg class="mi"><use href="#i-star"/></svg>';
    star.style.left = startX + 'px';
    star.style.top = startY + 'px';
    star.style.transitionDelay = (i * 150) + 'ms';
    document.body.appendChild(star);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        star.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0.4)';
        star.style.opacity = '0.6';
      });
    });

    star.addEventListener('transitionend', function handler(e) {
      if (e.propertyName !== 'transform') return;
      star.removeEventListener('transitionend', handler);
      star.remove();
      done++;
      updateStarDisplay();
      target.classList.remove('star-bump');
      void target.offsetWidth;
      target.classList.add('star-bump');
      if (done >= count && callback) callback();
    });
  }
}
