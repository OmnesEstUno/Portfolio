# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the static portfolio into a cohesive, professional, non-buggy site — single cyan accent on a dark token-driven base, a rebuilt centered-rail Work History timeline, inline project cards that link to dedicated detail pages, text-only nav, a rebuilt About page, and a smooth `requestAnimationFrame`-driven intro.

**Architecture:** Static site — plain HTML + SCSS (compiled to `style.css`) + vanilla JS. No framework, no build tool, no package.json. `style.scss` is the source of truth; `style.css` is generated. The redesign replaces magic-number absolute positioning with flexbox/grid in normal flow, and replaces the `setInterval(fn,1)` intro loop with `requestAnimationFrame`.

**Tech Stack:** HTML5, Dart Sass (via `npx --yes sass`), vanilla JS, Google Fonts (PT Sans). Preview via `python3 -m http.server`.

**Verification approach:** This is a static visual site with no existing test framework — adding a JS unit harness would violate YAGNI. "Tests" here are deterministic checks: (1) SCSS compiles with no errors, (2) HTML structural assertions via `grep`, (3) a manual browser check at each breakpoint. Every task ends by compiling and committing. Do **not** introduce jest/vitest/etc.

**Branch:** Work happens on the existing `redesign` branch (already checked out, contains the spec commit).

---

## File Structure

- Modify: `style.scss` — full restructure into tokens + base + components + responsive. Source of truth.
- Generated: `style.css` (+ `style.css.map`) — compiled output, committed so GitHub Pages serves it.
- Modify: `index.html` — nav, timeline, projects, education, skills markup; meta/OG tags; remove inline styles.
- Modify: `about_me.html` — rebuilt layout, working back button, meta/OG tags.
- Modify: `animations.js` — replace `setInterval` intro with `requestAnimationFrame`.
- Create: `projects/aquamate.html` — dedicated AquaMate detail page.
- Create: `projects/robotic-car.html` — dedicated Robotic Car detail page.
- Create: `assets/images/c3-ai-logo.png` already exists; download `family-matters-logo.svg`, `paradyme-logo.svg`, `swift-logo.png`, `iwd-logo` already local — localize the remaining hot-linked assets into `assets/images/`.

### Compile & preview commands (used throughout)

```bash
# Compile SCSS -> CSS (run from repo root after every .scss change)
npx --yes sass style.scss style.css

# Preview locally (leave running in a second terminal)
python3 -m http.server 8000
# then open http://localhost:8000/index.html and http://localhost:8000/about_me.html
```

---

## Task 1: SCSS foundation — tokens, reset, base typography

Establishes the design system and a `respond-to` breakpoint mixin. Replaces the scattered colors and the broken `min-width:420px` / `max-width:412px` media-query split. This task rewrites the **top** of `style.scss`; later tasks rewrite each component section.

**Files:**
- Modify: `style.scss` (top of file)
- Generated: `style.css`

- [ ] **Step 1: Replace the top of `style.scss`** (everything from line 1 down to and including the `.back-button` block, i.e. the current global/base rules before the first `@media`) with the token system, reset, breakpoint mixin, base typography, and a reusable container. Keep `@use 'sass:math';` at the very top.

```scss
@use 'sass:math';

// ---- Design tokens ----
:root {
  --bg:         #0b0f12;
  --surface:    #15191d;
  --surface-2:  #1b2026;
  --border:     #243038;
  --accent:     #22d3ee;
  --accent-ink: #04222a;
  --text:       #e6edf0;
  --text-muted: #9fb0b8;

  --radius:     10px;
  --radius-sm:  8px;
  --maxw:       1100px;
}

// ---- Breakpoint mixin (mobile-first) ----
// Usage: @include respond-to(tablet) { ... }
$bp-tablet:  768px;
$bp-desktop: 1024px;
@mixin respond-to($bp) {
  @if $bp == tablet  { @media (min-width: $bp-tablet)  { @content; } }
  @else if $bp == desktop { @media (min-width: $bp-desktop) { @content; } }
}

// ---- Reset / base ----
*, *::before, *::after { box-sizing: border-box; }

html, body { height: 100%; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: "PT Sans", sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: var(--accent); }
a:hover { text-decoration: underline; }

img { max-width: 100%; }

p { font-family: "PT Sans", sans-serif; }

// Reusable centered content container
.container {
  width: 100%;
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 1.5rem;
}

// Section heading used across the resume
.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
  margin: 0 0 2rem;
  @include respond-to(desktop) { font-size: 2.25rem; }
}

// Thin accent divider between sections
.section-break {
  width: min(80%, 640px);
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  border: 0;
  margin: 4rem auto;
}
```

- [ ] **Step 2: Compile and confirm no errors**

Run: `npx --yes sass style.scss style.css`
Expected: exits 0, no `Error:` output. `style.css` is regenerated.

- [ ] **Step 3: Sanity-check the page still loads**

Run: `python3 -m http.server 8000` then open `http://localhost:8000/index.html`.
Expected: page loads on the dark background with no console errors about missing files. (Layout will be mid-refactor — that's fine; we only confirm it loads and compiles.)

- [ ] **Step 4: Commit**

```bash
npx --yes sass style.scss style.css
git add style.scss style.css style.css.map
git commit -m "scss: add design tokens, reset, breakpoint mixin, base typography"
```

---

## Task 2: Nav / banner — flexbox text links + semantic anchors

Replaces the `left: 34% / 49.5% / 62%` magic-number positioning and the emoji `<div onclick>` buttons with a centered flexbox row of three real text links. Keeps the frosted bar.

**Files:**
- Modify: `index.html:19-39` (header-container + banner-content block)
- Modify: `style.scss` (nav rules — replace the old `.header`, `.email-me`, `.print-resume`, `.about-me`, `.link` rules wherever they appear)

- [ ] **Step 1: Replace the banner markup in `index.html`.** Replace the current `.header-container` + `.banner-content` blocks (the `<div class="header-container" ...>` through the closing `</div>` of `.banner-content`) with:

```html
<header class="site-header" id="header">
    <nav class="nav container">
        <a class="nav-link" href="mailto:elliotjwarren@gmail.com">Email</a>
        <a class="nav-link" href="assets/Elliot_Warren_Resume.pdf" target="_blank" rel="noopener">Resume</a>
        <div class="nav-name">
            <span class="nav-first" id="first-name-animated">Elliot</span>
            <span class="nav-last" id="last-name-animated">Warren</span>
        </div>
        <a class="nav-link" href="about_me.html">About</a>
    </nav>
</header>
```

Note: the print-via-JS behavior is dropped — "Resume" now opens the PDF directly (the browser's own print works from there). `printResume()` will be removed in Task 3.

- [ ] **Step 2: Add nav styles to `style.scss`** (in a `// ---- Nav ----` section; delete the old `.header`, `.header::before/::after`, `.email-me`, `.print-resume`, `.about-me`, `.banner-content`, `.names-*`, `.link` rules):

```scss
// ---- Nav ----
.site-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 10;
  background: rgba(11, 15, 18, 0.55);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  height: 64px;
}

.nav-link {
  color: var(--text);
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 0.4rem 0.2rem;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
  &:hover { color: var(--accent); border-bottom-color: var(--accent); text-decoration: none; }
}

.nav-name {
  font-weight: 700;
  white-space: nowrap;
  padding: 0 0.5rem;
  .nav-last { color: var(--accent); }
}
```

- [ ] **Step 3: Compile**

Run: `npx --yes sass style.scss style.css`
Expected: exits 0.

- [ ] **Step 4: Verify structurally**

Run: `grep -c 'nav-link' index.html`
Expected: `3` (Email, Resume, About).
Run: `grep -c 'onclick' index.html`
Expected: lower than before — the nav no longer uses `onclick`. (Body/scroll-button `onclick` handled in Task 3.)

- [ ] **Step 5: Browser check**

Open `http://localhost:8000/index.html`. Confirm the frosted bar shows three centered text links with the name, links turn cyan + underline-on-hover, and clicking Email opens a mail composer and About navigates.

- [ ] **Step 6: Commit**

```bash
npx --yes sass style.scss style.css
git add index.html style.scss style.css style.css.map
git commit -m "nav: flexbox text links with semantic anchors, drop emoji onclick divs"
```

---

## Task 3: Intro animation — rebuild on requestAnimationFrame

Replaces `setInterval(autoScroll, 1)` with a single rAF loop driven by elapsed time. Same visual effect (landing image zooms+blurs+fades, header/links/resume fade in, names translate to nav). Removes `printResume()` and `removeOnClick` brittleness.

**Files:**
- Modify: `animations.js` (replace the interval-based `autoScrollHandler` and `setStyles`/`printResume`)
- Modify: `style.scss` (hero `.enterance` / `.landing` / scroll-cue rules → tokens, remove dead `.name`/`.first-name`/`.last-name`)
- Modify: `index.html` — `body` keeps `onclick="autoScrollHandler()"`; remove `printResume` references (done in Task 2)

- [ ] **Step 1: Replace the body of `animations.js`** with the rAF version. Keep the element lookups at top; replace `autoScrollHandler`, `setStyles`, and delete `printResume`/`setInterval`:

```js
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
```

- [ ] **Step 2: Remove the now-unused intro CSS and restyle the hero in `style.scss`.** Delete the dead `.name`, `.first-name`, `.last-name`, `.names-animated`, `.button-animation-wrapper`/`.point-effect` infinite-loop rules that reference removed markup. Replace hero rules with:

```scss
// ---- Intro hero ----
.enterance {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}
.landing {
  height: 90vh;
  width: auto;
  will-change: transform, opacity, filter;
}

.button-wrapper {
  position: fixed;
  left: 50%;
  bottom: 6vh;
  transform: translateX(-50%);
  z-index: 5;
  text-align: center;
  cursor: pointer;
  animation: fade-in ease-in-out 2.5s;
}
.button-text {
  color: var(--text);
  font-size: 1.1rem;
  font-style: normal;
}

@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
```

- [ ] **Step 3: Simplify the scroll-cue markup in `index.html`.** Replace the `.button-wrapper` block (lines ~40-44) with:

```html
<div class="button-wrapper" id="scroll-button" onclick="autoScrollHandler()">
    <i class="button-text">Click anywhere to continue&nbsp;&#x2193;</i>
</div>
```

Confirm `<body id="body" onclick="autoScrollHandler()">` is unchanged.

- [ ] **Step 4: Compile**

Run: `npx --yes sass style.scss style.css`
Expected: exits 0.

- [ ] **Step 5: Verify no dangling references**

Run: `grep -n 'setInterval\|printResume\|point-effect\|names-animated' index.html animations.js style.scss`
Expected: no matches (all removed).

- [ ] **Step 6: Browser check**

Open `http://localhost:8000/index.html`. Click anywhere. Expected: landing art smoothly zooms/blurs/fades while the resume + header fade in over ~0.9s; the scroll cue disappears; the page is then a normal scrollable document. No jank, no console errors.

- [ ] **Step 7: Commit**

```bash
npx --yes sass style.scss style.css
git add index.html animations.js style.scss style.css style.css.map
git commit -m "intro: rebuild transition on requestAnimationFrame, remove dead intro CSS"
```

---

## Task 4: Work History — centered-rail timeline

Rebuilds the alternating timeline as one CSS grid (`1fr · rail · 1fr`) with a real center spine and cyan nodes. Removes all `timeline-empty` / `timeline-middle` spacer divs. Mobile collapses to a left rail.

**Files:**
- Modify: `index.html` — the entire `.design-section` / `.timeline` block (lines ~48-116)
- Modify: `style.scss` — replace all `.timeline*`, `.tc-*`, `.design` rules

- [ ] **Step 1: Replace the timeline markup in `index.html`** with a flat list of entries (no spacer divs). Each entry is one `.tl-item`; alternation is handled by CSS `:nth-child`. Order newest→oldest:

```html
<section class="resume container" id="resume">
    <h1 class="section-title" id="sectionTitle">Work History</h1>
    <div class="timeline">
        <article class="tl-item">
            <div class="tl-card">
                <img class="tl-logo" src="assets/images/family-matters-logo.svg" alt="Family Matters In-Home Care logo">
                <h3 class="tl-role">Visual Support Assistant</h3>
                <p class="tl-meta">Family Matters · <span class="date">Mar 2026 – Present</span></p>
                <ul class="tl-points">
                    <li>Provide visual and personal accessibility support for clients at Google.</li>
                </ul>
            </div>
        </article>
        <article class="tl-item">
            <div class="tl-card">
                <img class="tl-logo" src="assets/images/IWD.png" alt="Independent web contractor logo">
                <h3 class="tl-role">Independent Website Contracting</h3>
                <p class="tl-meta"><span class="date">Feb 2025 – Mar 2026</span></p>
                <ul class="tl-points">
                    <li>Built <a target="_blank" rel="noopener" href="https://fsrauto.com">FSRAuto</a> from the ground up in WordPress.</li>
                    <li>Oversee SEO, Google Ads, and website security.</li>
                    <li>Assisted porting the PurpleTie mobile app from iOS to Android.</li>
                </ul>
            </div>
        </article>
        <article class="tl-item">
            <div class="tl-card">
                <img class="tl-logo" src="assets/images/c3-ai-logo.png" alt="C3.ai logo">
                <h3 class="tl-role">Junior AI/ML Software Developer</h3>
                <p class="tl-meta">Paradyme Management at C3.ai · <span class="date">Sep 2024 – Feb 2025</span></p>
                <ul class="tl-points">
                    <li>Architected and built full-stack features for a U.S. Marine Corps staffing application using TypeScript and the C3 Type System, focusing on scalability and speed.</li>
                    <li>Developed dynamic React front-end features, improving user experience and performance.</li>
                    <li>Increased test coverage by 150% across multiple federal codebases using CI/CD and Jasmine.</li>
                    <li>Used Jira for project management and issue tracking.</li>
                </ul>
            </div>
        </article>
        <article class="tl-item">
            <div class="tl-card">
                <img class="tl-logo" src="assets/images/USAF_logo.png" alt="United States Air Force logo">
                <h3 class="tl-role">Aerospace Propulsion Mechanic &amp; Programs Manager — Secret Clearance</h3>
                <p class="tl-meta">United States Air Force · <span class="date">Jan 2017 – Jan 2021</span></p>
                <ul class="tl-points">
                    <li>Managed, coordinated, and scheduled mission-essential training deployment for over 150 individuals.</li>
                    <li>Ensured regulatory compliance for production warehouses under OSHA and Air Force Instruction (AFI) safety and security protocols.</li>
                    <li>Managed finances and inventory for an in-warehouse nutrition stop, contributing to its growth and efficiency.</li>
                </ul>
            </div>
        </article>
    </div>
    <hr class="section-break">
```

Note: this opens the `.resume` section and the Work History block; the Projects/Education/Skills markup that follows is replaced in Tasks 5–6. Leave the existing closing tags below for now; they get reconciled as those tasks land.

- [ ] **Step 2: Replace all timeline CSS in `style.scss`** with the grid version (delete every old `.timeline*`, `.tc-*`, `.timeline-circle`, `.design`, `.main-middle` rule):

```scss
// ---- Resume / timeline ----
.resume {
  position: relative;
  z-index: 1;
  padding-top: 6rem;
  opacity: 0;             // faded in by the intro
}
body.intro-done .resume { opacity: 1; }

.timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tl-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem 1.5rem;
}
.tl-logo { height: 40px; width: auto; margin-bottom: 0.5rem; }
.tl-role { margin: 0.25rem 0; font-size: 1.05rem; }
.tl-meta { margin: 0 0 0.5rem; color: var(--text-muted); font-size: 0.9rem; }
.tl-points { margin: 0; padding-left: 1.1rem; }
.tl-points li { margin: 0.25rem 0; }
.date { font-style: italic; }

// Mobile: single left rail
.timeline { padding-left: 1.75rem; }
.timeline::before {
  content: "";
  position: absolute;
  left: 6px; top: 0; bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent, rgba(34,211,238,0.4) 10%, rgba(34,211,238,0.4) 90%, transparent);
}
.tl-item { position: relative; }
.tl-item::before {       // node
  content: "";
  position: absolute;
  left: -1.75rem;
  top: 1.4rem;
  width: 14px; height: 14px;
  margin-left: -6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent);
  border: 2px solid var(--bg);
}

// Desktop: centered spine, alternating cards
@include respond-to(desktop) {
  .timeline { padding-left: 0; }
  .timeline::before { left: 50%; transform: translateX(-50%); }
  .tl-item {
    width: 50%;
  }
  .tl-item:nth-child(odd)  { left: 0;   padding-right: 2.5rem; text-align: right; }
  .tl-item:nth-child(even) { left: 50%; padding-left: 2.5rem; }
  .tl-item:nth-child(odd) .tl-points { list-style-position: inside; padding-left: 0; }
  .tl-item:nth-child(odd) .tl-logo { margin-left: auto; }
  .tl-item::before { top: 1.4rem; }
  .tl-item:nth-child(odd)::before  { left: auto; right: -7px; margin: 0; }
  .tl-item:nth-child(even)::before { left: -7px; margin: 0; }
}
```

- [ ] **Step 3: Compile**

Run: `npx --yes sass style.scss style.css`
Expected: exits 0.

- [ ] **Step 4: Verify structurally**

Run: `grep -c 'tl-item' index.html`
Expected: `4` (four jobs).
Run: `grep -c 'timeline-empty\|timeline-middle' index.html`
Expected: `0`.

- [ ] **Step 5: Browser check at two widths**

Open `http://localhost:8000/index.html`, click through the intro. At desktop width: cards alternate left/right off a centered glowing spine, odd cards right-aligned. Narrow the window below 1024px: rail jumps to the left, all cards stack to its right. No overlap, no horizontal scroll.

- [ ] **Step 6: Commit**

```bash
npx --yes sass style.scss style.css
git add index.html style.scss style.css style.css.map
git commit -m "work history: centered-rail timeline as CSS grid, drop spacer divs"
```

---

## Task 5: Projects — inline cards + dedicated detail pages

Restyles the two project entries as consistent cards and makes each link to a new detail page.

**Files:**
- Modify: `index.html` — the `.projects` block
- Modify: `style.scss` — replace `.projects`, `.project`, `.project-logo`, `.project-text`
- Create: `projects/aquamate.html`
- Create: `projects/robotic-car.html`

- [ ] **Step 1: Replace the projects markup in `index.html`:**

```html
<h1 class="section-title">Projects</h1>
<div class="projects">
    <a class="project-card" href="projects/aquamate.html">
        <img class="project-media" src="assets/images/AquaMate_logo_square.png" alt="AquaMate logo">
        <div class="project-body">
            <h3 class="project-name">AquaMate</h3>
            <p>Team leader for a group of seven. Led complete-lifecycle development of an aquarium-building website, from concept to simulated MVP — delegating tasks, coordinating the schedule and meetings, and contributing code.</p>
            <span class="project-more">View details →</span>
        </div>
    </a>
    <a class="project-card" href="projects/robotic-car.html">
        <video class="project-media" muted autoplay loop playsinline>
            <source src="assets/videos/robotic-car.mp4" type="video/mp4">
        </video>
        <div class="project-body">
            <h3 class="project-name">Self-Navigating Robotic Car</h3>
            <p>Set the project schedule and divided work across five members. Integrated omnidirectional wheels, IR line and obstacle sensors, and ultrasonic sensors using pigpio and PCA9685. Assembled, debugged, and demonstrated the final self-navigating car.</p>
            <span class="project-more">View details →</span>
        </div>
    </a>
</div>
<hr class="section-break">
```

- [ ] **Step 2: Add project styles to `style.scss`** (replace old `.projects*`/`.project*`):

```scss
// ---- Projects ----
.projects {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @include respond-to(tablet) { grid-template-columns: 1fr 1fr; }
}
.project-card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  color: var(--text);
  transition: transform 0.2s, border-color 0.2s;
  &:hover { transform: translateY(-4px); border-color: var(--accent); text-decoration: none; }
}
.project-media { width: 100%; height: 220px; object-fit: cover; background: var(--bg); }
.project-body { padding: 1.25rem; }
.project-name { margin: 0 0 0.5rem; }
.project-more { display: inline-block; margin-top: 0.75rem; color: var(--accent); font-weight: 700; }
```

- [ ] **Step 3: Create `projects/aquamate.html`.** Note paths are one level up (`../`). Reuse the site's stylesheet and font.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0b0f12">
    <meta name="description" content="AquaMate — aquarium-building website project by Elliot Warren.">
    <link rel="icon" href="../assets/images/Grey.png" type="image/x-icon">
    <link rel="stylesheet" href="../style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <title>AquaMate — Elliot Warren</title>
</head>
<body class="project-page">
    <main class="container project-detail">
        <a class="back-link" href="../index.html">← Back to portfolio</a>
        <h1 class="section-title">AquaMate</h1>
        <img class="project-hero" src="../assets/images/AquaMate_logo_square.png" alt="AquaMate logo">
        <p>AquaMate is an aquarium-building website taken from concept through a simulated MVP by a team of seven, which I led.</p>
        <h3>My role</h3>
        <ul>
            <li>Team leader for a group of seven.</li>
            <li>Coordinated the project plan, schedule, and meetings.</li>
            <li>Delegated and tracked tasks, and contributed code.</li>
        </ul>
        <h3>Highlights</h3>
        <p class="placeholder-note">[Add screenshots, the tech stack, and a link to the live demo / repo here.]</p>
    </main>
</body>
</html>
```

- [ ] **Step 4: Create `projects/robotic-car.html`** (same shell, car content):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0b0f12">
    <meta name="description" content="Self-navigating robotic car — embedded systems project by Elliot Warren.">
    <link rel="icon" href="../assets/images/Grey.png" type="image/x-icon">
    <link rel="stylesheet" href="../style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    <title>Self-Navigating Robotic Car — Elliot Warren</title>
</head>
<body class="project-page">
    <main class="container project-detail">
        <a class="back-link" href="../index.html">← Back to portfolio</a>
        <h1 class="section-title">Self-Navigating Robotic Car</h1>
        <video class="project-hero" muted autoplay loop playsinline>
            <source src="../assets/videos/robotic-car.mp4" type="video/mp4">
        </video>
        <p>A self-navigating car built by a team of five, integrating multiple sensor systems on a Raspberry Pi.</p>
        <h3>My role</h3>
        <ul>
            <li>Established the project schedule and divided work across five members.</li>
            <li>Coordinated progress meetings.</li>
            <li>Assembled, debugged, and demonstrated the final car.</li>
        </ul>
        <h3>Technical details</h3>
        <ul>
            <li>Omnidirectional wheels, IR line sensors, IR obstacle detectors, ultrasonic sensors.</li>
            <li>Driven with the pigpio and PCA9685 libraries.</li>
        </ul>
        <p class="placeholder-note">[Add wiring diagram, code repo link, and demo notes here.]</p>
    </main>
</body>
</html>
```

- [ ] **Step 5: Add detail-page styles to `style.scss`:**

```scss
// ---- Project detail pages ----
.project-detail { padding: 5rem 1.5rem; max-width: 800px; }
.project-detail h3 { margin-top: 2rem; color: var(--accent); }
.project-hero {
  width: 100%; max-height: 360px; object-fit: cover;
  border: 1px solid var(--border); border-radius: var(--radius);
  margin-bottom: 1.5rem;
}
.back-link { display: inline-block; margin-bottom: 1.5rem; font-weight: 700; }
.placeholder-note { color: var(--text-muted); font-style: italic; }
```

- [ ] **Step 6: Compile and verify**

Run: `npx --yes sass style.scss style.css`
Expected: exits 0.
Run: `grep -c 'project-card' index.html` → Expected `2`.
Run: `ls projects/` → Expected `aquamate.html  robotic-car.html`.

- [ ] **Step 7: Browser check**

Open `http://localhost:8000/index.html`; the two project cards sit side-by-side on desktop, stack on mobile, lift on hover. Click each → its detail page loads with styling and a working "← Back to portfolio" link.

- [ ] **Step 8: Commit**

```bash
npx --yes sass style.scss style.css
git add index.html projects/ style.scss style.css style.css.map
git commit -m "projects: inline cards linking to new dedicated detail pages"
```

---

## Task 6: Education & Skills restyle

Restyles both to consistent token-based cards/grid. Content unchanged.

**Files:**
- Modify: `index.html` — `.education` and `.skills` blocks
- Modify: `style.scss` — replace `.education`, `.sfsu`, `.fsa`, `.edu-*`, `.skill-*` rules

- [ ] **Step 1: Replace the education markup in `index.html`** (keep the inline SVG logos already present; only restructure wrappers). Replace the `.education` block with:

```html
<h1 class="section-title">Education</h1>
<div class="education">
    <div class="edu-card">
        <a class="edu-logo" href="https://cs.sfsu.edu/" target="_blank" rel="noopener">
            <img src="assets/images/sfsu_gator.png" alt="San Francisco State University logo">
        </a>
        <div class="edu-text">
            <h3>San Francisco State University</h3>
            <h4>Bachelor of Science in Computer Science</h4>
            <p class="tl-meta">Aug 2022 – May 2024</p>
        </div>
    </div>
    <div class="edu-card">
        <a class="edu-logo" href="https://www.fullstackacademy.com/programs/cybersecurity-bootcamp" target="_blank" rel="noopener">
            <img src="assets/images/fullstack-academy-logo.svg" alt="Fullstack Academy logo">
        </a>
        <div class="edu-text">
            <h3>Fullstack Academy &amp; San Jose State University</h3>
            <h4>Certificate of Completion — Cybersecurity</h4>
            <p class="tl-meta">May 2021 – Dec 2021</p>
        </div>
    </div>
</div>
<hr class="section-break">
```

(The current Fullstack inline SVG is brittle; Task 8 localizes it to `fullstack-academy-logo.svg`. If that asset isn't created yet when this task runs, temporarily keep the existing inline `<svg class="fsa-logo">…</svg>` markup inside `.edu-logo` instead of the `<img>` — but the `<img>` form is the target.)

- [ ] **Step 2: Replace the skills markup wrapper** (keep all 12 `<a class="skill-link">` entries exactly as they are; only the container class stays `.skill-grid`). Ensure the block reads:

```html
<h1 class="section-title">Proficiencies</h1>
<div class="skills">
    <div class="skill-grid">
        <!-- existing 12 skill-link anchors unchanged -->
    </div>
</div>
```

- [ ] **Step 3: Replace education + skills CSS in `style.scss`:**

```scss
// ---- Education ----
.education {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @include respond-to(tablet) { grid-template-columns: 1fr 1fr; }
}
.edu-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
}
.edu-logo { flex: 0 0 80px; }
.edu-logo img { width: 80px; height: 80px; object-fit: contain; }
.edu-text h3 { margin: 0 0 0.25rem; }
.edu-text h4 { margin: 0 0 0.25rem; font-weight: 400; color: var(--text); }

// ---- Skills ----
.skill-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  justify-items: center;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  @include respond-to(tablet) { grid-template-columns: repeat(6, 1fr); }
}
.skill-link { display: flex; align-items: center; justify-content: center; height: 72px; width: 72px; }
.skill-img { max-width: 100%; max-height: 100%; object-fit: contain; transition: transform 0.2s; }
.skill-link:hover .skill-img { transform: scale(1.12); }
```

- [ ] **Step 4: Compile and verify**

Run: `npx --yes sass style.scss style.css` → exits 0.
Run: `grep -c 'skill-link' index.html` → Expected `12`.
Run: `grep -c 'edu-card' index.html` → Expected `2`.

- [ ] **Step 5: Browser check**

Education shows two even cards (logo left, text right), stacking on mobile. Skills form a clean centered grid (3-up mobile, 6-up tablet+), icons scale on hover.

- [ ] **Step 6: Commit**

```bash
npx --yes sass style.scss style.css
git add index.html style.scss style.css style.css.map
git commit -m "education + skills: consistent token-based cards and icon grid"
```

---

## Task 7: About page rebuild + working back button

Rebuilds `about_me.html` on the token system with a real responsive layout and a working back link. Content (intro, tinkering, aquariums, pets) preserved.

**Files:**
- Modify: `about_me.html`
- Modify: `style.scss` — replace `.about-me-body`, `.about-section`, `.about_me_text`, `.self*`, `.tinker*`, `.aquarium*`, `.pets*`, `.back-button`

- [ ] **Step 1: Replace `<body>…</body>` of `about_me.html`** with a flowing single-column layout of alternating text + gallery blocks:

```html
<body class="about-page">
    <header class="site-header">
        <nav class="nav container">
            <a class="nav-link" href="index.html">← Back to portfolio</a>
            <div class="nav-name"><span class="nav-first">About</span> <span class="nav-last">Me</span></div>
            <a class="nav-link" href="mailto:elliotjwarren@gmail.com">Email</a>
        </nav>
    </header>

    <main class="container about-main">
        <section class="about-block">
            <a href="index.html" class="about-portrait">
                <img src="assets/images/self-bust.png" alt="Portrait of Elliot Warren">
            </a>
            <h1 class="section-title">Elliot Warren</h1>
        </section>

        <section class="about-block">
            <p class="about-text">Since 2009 I've been tinkering with computers and electronics — building custom PCs (including my current main rig, built in 2021) and programming microcontrollers like Arduino and Raspberry Pi for fun, useful projects.</p>
            <div class="about-gallery">
                <img class="about-image" src="assets/images/computer.jpg" alt="My custom computer">
                <img class="about-image" src="assets/images/desktops.jpg" alt="Desktop builds">
                <img class="about-image" src="assets/images/microwave-ray-gun.jpg" alt="Microwave ray gun project">
            </div>
        </section>

        <section class="about-block">
            <p class="about-text">I'm a huge aquarium nerd. I currently keep a 55-gallon freshwater tank, a 5-gallon nano tank, and two 3-gallon shrimp tanks. My first 55-gallon tank at age 14 showed me the joy of balancing a small ecosystem.</p>
            <div class="about-gallery">
                <img class="about-image" src="assets/images/big_tank.jpg" alt="55-gallon aquarium">
                <img class="about-image" src="assets/images/small_tank.jpg" alt="Nano aquarium">
                <img class="about-image" src="assets/images/khuli_loach.jpg" alt="Kuhli loach">
                <img class="about-image" src="assets/images/skrimp_cyl.jpg" alt="Shrimp tank">
                <img class="about-image" src="assets/images/skrimp_nightstand.jpg" alt="Nightstand shrimp tank">
            </div>
        </section>

        <section class="about-block">
            <p class="about-text">I've always had pets. Right now I have two cats — Tora and Maru — and a dog, Kota. Tora is a reclusive tabby who only cuddles with me; Maru is a curious Siamese who plays fetch; Kota is a miniature poodle who loves roughhousing and treats.</p>
            <div class="about-gallery">
                <img class="about-image" src="assets/images/tora.jpg" alt="Tora the cat">
                <img class="about-image" src="assets/images/maru.jpg" alt="Maru the cat">
                <img class="about-image" src="assets/images/kota.jpg" alt="Kota the dog">
                <img class="about-image" src="assets/images/maru_roof.jpg" alt="Maru on the roof">
            </div>
        </section>
    </main>
</body>
```

- [ ] **Step 2: Replace all About CSS in `style.scss`** (delete `.about-me-body`, `.about-section`, `.about_me_text`, `.self`, `.self-photo`, `.tinker*`, `.aquarium*`, `.pets*`, `.back-button`):

```scss
// ---- About page ----
.about-main { padding: 6rem 1.5rem 4rem; }
.about-block { margin-bottom: 4rem; }
.about-portrait img {
  display: block; height: 220px; width: auto; margin: 0 auto 1rem;
  border-radius: 50%; border: 2px solid var(--border);
}
.about-text {
  max-width: 720px; margin: 0 auto 1.5rem;
  font-size: 1.15rem; text-align: center; line-height: 1.7;
}
.about-gallery {
  display: grid; gap: 1rem;
  grid-template-columns: 1fr;
  @include respond-to(tablet) { grid-template-columns: repeat(3, 1fr); }
}
.about-image {
  width: 100%; height: 220px; object-fit: cover;
  border-radius: var(--radius); border: 1px solid var(--border);
}
```

- [ ] **Step 3: Update `<head>` of `about_me.html`** — set `theme-color` to `#0b0f12` and fix the description to `"About Elliot Warren — software developer, tinkerer, aquarium keeper."` (replacing any leftover placeholder).

- [ ] **Step 4: Compile and verify**

Run: `npx --yes sass style.scss style.css` → exits 0.
Run: `grep -c 'about-block' about_me.html` → Expected `4`.
Run: `grep -c 'onclick=""' about_me.html` → Expected `0` (broken back button gone).

- [ ] **Step 5: Browser check**

Open `http://localhost:8000/about_me.html`. Text blocks are centered and readable; galleries are 3-up on tablet+, single column on mobile; the header "← Back to portfolio" and the portrait both return to the index. No horizontal overflow at any width.

- [ ] **Step 6: Commit**

```bash
npx --yes sass style.scss style.css
git add about_me.html style.scss style.css style.css.map
git commit -m "about: rebuild on token system with responsive layout and working back link"
```

---

## Task 8: Polish — localize images, meta/OG, typo + a11y sweep

Final correctness pass. Localizes hot-linked assets, adds meta/OG tags, and confirms no dead CSS or stray inline styles remain.

**Files:**
- Create: `assets/images/family-matters-logo.svg`, `assets/images/paradyme-logo.svg`, `assets/images/fullstack-academy-logo.svg`, `assets/images/swift-logo.png`
- Modify: `index.html` (meta/OG, swap Swift `<img src>` to local), `about_me.html` (OG)

- [ ] **Step 1: Download the hot-linked assets locally:**

```bash
curl -fsSL "https://familymattershc.com/wp-content/uploads/Family-Matters-In-Home-Care.svg" -o assets/images/family-matters-logo.svg
curl -fsSL "https://paradyme.us/assets/images/Paradyme_Cathexis.svg" -o assets/images/paradyme-logo.svg
curl -fsSL "https://developer.apple.com/assets/elements/icons/swift/swift-96x96_2x.png" -o assets/images/swift-logo.png
```

Expected: three files created, each non-empty (`ls -la assets/images/family-matters-logo.svg` shows >0 bytes). If any URL 404s, log it and substitute a text label in that spot rather than a broken image.

- [ ] **Step 2: For the Fullstack Academy logo**, save the existing inline `<svg class="fsa-logo">` path from the old markup into `assets/images/fullstack-academy-logo.svg` as a standalone SVG file:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35" fill="#e6edf0"><path d="M13.853 24.182l3.639-3.639 3.639 3.639-3.64 3.639-3.638-3.64zm-6.674-6.69L17.492 7.179 27.82 17.51l-3.067 3.067-7.245-7.245-7.26 7.228-3.069-3.067zM17.492 0L0 17.492l17.492 17.492 17.492-17.492L17.492 0z"/></svg>
```

- [ ] **Step 3: Swap the Swift skill icon** in `index.html` from the `developer.apple.com` URL to `assets/images/swift-logo.png` (find the `<img class="skill-img" src="https://developer.apple.com/...swift...">` line and change `src`).

- [ ] **Step 4: Update `<head>` of `index.html`** — fix the description and add Open Graph tags. Replace the existing `<meta name="description" ...>` and `theme-color`, and add OG block:

```html
<meta name="theme-color" content="#0b0f12">
<meta name="description" content="Elliot Warren — software developer, U.S. Air Force veteran. Portfolio of work, projects, and skills.">
<meta property="og:title" content="Elliot Warren — Portfolio">
<meta property="og:description" content="Software developer and U.S. Air Force veteran. Work history, projects, and skills.">
<meta property="og:type" content="website">
<meta property="og:image" content="assets/images/self-bust.png">
```

Add the same `og:title`/`og:description`/`og:type`/`og:image` (About-appropriate wording) to `about_me.html`'s head.

- [ ] **Step 5: Confirm no dead CSS or stray inline styles remain.**

Run: `grep -RnE 'style="' index.html about_me.html | grep -v 'fill\|viewBox'`
Expected: no inline `style="..."` layout attributes left (the old `style="width:50%;height:auto"` etc. are gone). Inline SVG attributes are fine.
Run: `grep -nE '\.name\b|\.first-name\b|first-name\b|hi mom|familymattershc\.com|paradyme\.us|developer\.apple\.com|suport|Independant|mineature|roughousing|troubleshooted' index.html about_me.html style.scss`
Expected: no matches.

- [ ] **Step 6: Compile and final full-site browser check**

Run: `npx --yes sass style.scss style.css` → exits 0.
Open index + about + both project pages at mobile (~360px), tablet (~800px), and desktop (~1280px). Confirm: one cyan accent throughout, no horizontal scroll, no broken images, intro plays smoothly, timeline spine correct at each width, all links work.

- [ ] **Step 7: Commit**

```bash
npx --yes sass style.scss style.css
git add -A
git commit -m "polish: localize external images, add OG meta, fix typos, remove dead CSS"
```

---

## Self-Review (completed during planning)

- **Spec coverage:** intro rebuild → Task 3; cyan tokens → Task 1; centered-rail timeline → Task 4; inline projects + detail pages → Task 5; text-only nav → Task 2; About rebuild + back button → Task 7; responsive cascade → woven into Tasks 1–7 via the `respond-to` mixin (mobile-first, 768/1024 breakpoints — closes the old 413–419px dead zone); localize images / typos / meta / a11y → Task 8. All spec sections map to a task.
- **No placeholders:** every code step contains real code; the only intentional `[bracketed]` notes are visible on-page "add your content here" prompts on the project detail pages, by design.
- **Type/name consistency:** class names introduced in Task 1 (`.container`, `.section-title`, `.section-break`, `respond-to`) are reused consistently; `intro-done` body class set in Task 3 matches the `body.intro-done .resume` selector in Task 4; `.tl-meta` defined in Task 4 reused in Tasks 6–7.
