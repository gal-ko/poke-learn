const CONFETTI_COLORS = {
  pokeball:  '#E3350D',
  blue:      '#3B4CCA',
  pikachu:   '#FFCB05',
  grass:     '#4CAF50',
  psychic:   '#F85888',
  water:     '#6890F0'
};

let stars = AppState.getStars();
let prevStars = stars;
let onStarsChanged = null;

function addStar(count) {
  count = count || 1;
  stars += count;
  AppState.setStars(stars);
  if (onStarsChanged) onStarsChanged();
}

function setStars(count) {
  stars = count;
  prevStars = count;
  AppState.setStars(stars);
  updateStarDisplay();
}

function updateStarDisplay() {
  document.getElementById('starCount').textContent = stars;
}

function showConfetti() {
  const c = document.createElement('div');
  c.className = 'confetti-container';
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + '%';
    const colors = Object.values(CONFETTI_COLORS);
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = Math.random() * 1 + 's';
    p.style.width = (6 + Math.random() * 8) + 'px';
    p.style.height = (6 + Math.random() * 8) + 'px';
    p.style.borderRadius = Math.random() > .5 ? '50%' : '2px';
    c.appendChild(p);
  }
  document.body.appendChild(c);
  setTimeout(() => c.remove(), 3000);
}

function showCaught(pid, starText, starCount) {
  starCount = starCount || 1;
  const msg = pick(SUCCESS_MESSAGES);
  const o = document.createElement('div');
  o.className = 'caught-overlay';
  o.innerHTML = `<div class="caught-msg"><img src="sprites/${pid}.png" alt=""><h3 class="pixel">${msg}</h3>${starText ? `<p class="caught-stars" id="caughtStarsEl"><span class="mi">star</span> ${starText}</p>` : ''}</div>`;
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
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  let done = 0;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'flying-star';
    star.innerHTML = '<span class="mi">star</span>';
    star.style.left = startX + 'px';
    star.style.top = startY + 'px';
    star.style.transitionDelay = (i * 150) + 'ms';
    document.body.appendChild(star);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        star.style.left = endX + 'px';
        star.style.top = endY + 'px';
        star.style.transform = 'scale(0.4)';
        star.style.opacity = '0.6';
      });
    });

    star.addEventListener('transitionend', function handler(e) {
      if (e.propertyName !== 'left') return;
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
