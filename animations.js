// Intro transition: click anywhere to play the zoom/fade into the resume.
// Driven by requestAnimationFrame over a fixed duration (no setInterval).
const BODY    = document.getElementById('body');
const IMAGE   = document.getElementById('landing');
const HEADER  = document.getElementById('header');
const RESUME  = document.getElementById('resume');
const BUTTON  = document.getElementById('scroll-button');
const DURATION = 900; // ms

let playing = false;

function autoScrollHandler() {
  if (playing || !IMAGE || !HEADER || !RESUME) return;
  playing = true;
  BODY && BODY.removeAttribute('onclick');

  const start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / DURATION); // 0..1 progress
    const eased = t * (2 - t);                        // easeOutQuad

    IMAGE.style.transform = `scale(${1 + eased * 3})`;
    IMAGE.style.filter    = `blur(${eased * 3}px)`;
    IMAGE.style.opacity   = `${Math.max(0.1, 1 - eased)}`;
    HEADER.style.opacity  = `${eased}`;
    RESUME.style.opacity  = `${eased}`;
    if (BUTTON) BUTTON.style.opacity = `${1 - eased}`;

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      if (BUTTON) BUTTON.style.display = 'none';
      RESUME.style.position = 'static';
      document.body.classList.add('intro-done');
    }
  }
  requestAnimationFrame(frame);
}
