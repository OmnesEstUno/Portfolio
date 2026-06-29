// Intro transition: click anywhere to play the cinematic zoom into the resume.
// Driven by requestAnimationFrame; the hero name FLIPs into the nav bar.
const BODY       = document.getElementById('body');
const IMAGE      = document.getElementById('landing');
const HEADER     = document.getElementById('header');
const RESUME     = document.getElementById('resume');
const BUTTON     = document.getElementById('scroll-button');
const HERO_NAME  = document.getElementById('hero-name');
const HERO_FIRST = document.getElementById('hero-first');
const HERO_LAST  = document.getElementById('hero-last');
const NAV_FIRST  = document.getElementById('nav-first');
const NAV_LAST   = document.getElementById('nav-last');
const DURATION   = 1000; // ms

let playing = false;
let done = false;

// Compute the translate+scale that maps a hero word onto its nav resting spot (FLIP).
function flipParams(heroEl, navEl) {
  const from = heroEl.getBoundingClientRect();
  const to   = navEl.getBoundingClientRect();
  return {
    dx: to.left - from.left,
    dy: to.top - from.top,
    scale: to.height / from.height,
  };
}

function applyFlip(el, p, params) {
  if (!el || !params) return;
  el.style.transform =
    `translate(${params.dx * p}px, ${params.dy * p}px) scale(${1 + (params.scale - 1) * p})`;
}

// End state, shared by the animated path and the skip path.
function finishIntro() {
  done = true;
  playing = false;
  // Leave the landing as a dim, zoomed, blurred backdrop behind the content
  // (it sits at z-index 0, below the resume, so it never intercepts clicks).
  if (IMAGE) {
    IMAGE.style.transform = 'scale(4)';
    IMAGE.style.filter = 'blur(4px)';
    IMAGE.style.opacity = '0.12';
  }
  if (HERO_NAME) HERO_NAME.style.display = 'none';
  if (BUTTON) { BUTTON.style.display = 'none'; BUTTON.removeAttribute('onclick'); }
  if (HEADER) HEADER.style.opacity = '1';
  if (RESUME) RESUME.style.opacity = '1';
  if (BODY) BODY.removeAttribute('onclick');
  document.body.classList.add('intro-done');        // unlocks scrolling, reveals the nav name
}

function autoScrollHandler() {
  if (playing || done || !IMAGE || !HEADER || !RESUME) return;
  playing = true;
  if (BODY) BODY.removeAttribute('onclick');

  // Measure each word's start (hero) and end (nav) positions before animating.
  const firstFlip = (HERO_FIRST && NAV_FIRST) ? flipParams(HERO_FIRST, NAV_FIRST) : null;
  const lastFlip  = (HERO_LAST  && NAV_LAST)  ? flipParams(HERO_LAST,  NAV_LAST)  : null;

  const start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / DURATION);
    const eased = t * (2 - t); // easeOutQuad

    IMAGE.style.transform = `scale(${1 + eased * 3})`;
    IMAGE.style.filter    = `blur(${eased * 4}px)`;
    IMAGE.style.opacity   = `${Math.max(0.12, 1 - eased)}`;
    HEADER.style.opacity  = `${eased}`;
    RESUME.style.opacity  = `${eased}`;
    if (BUTTON) BUTTON.style.opacity = `${1 - eased}`;
    applyFlip(HERO_FIRST, eased, firstFlip);
    applyFlip(HERO_LAST,  eased, lastFlip);

    if (t < 1) requestAnimationFrame(frame);
    else finishIntro();
  }
  requestAnimationFrame(frame);
}

// Returning from the About page via index.html#resume skips the cinematic intro.
if (location.hash === '#resume') {
  finishIntro();
}
