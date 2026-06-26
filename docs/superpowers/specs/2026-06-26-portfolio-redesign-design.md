# Portfolio Redesign — Design Spec

**Date:** 2026-06-26
**Author:** Elliot Warren (with Claude)
**Status:** Approved pending final review

## Goal

Make the portfolio feel cohesive and professional instead of "inconsistent and amateurish," and fix the "buggy" UX. The root cause of both complaints is the same: the layout is built almost entirely from absolutely-positioned elements placed with hand-tuned magic numbers (`left: 49.5%`, `top: 75.7vh`, etc.), and the intro animation runs on a 1ms `setInterval`. We fix the foundation, then polish.

This is a styling/structure refresh. **Content stays the same** (same jobs, projects, education, skills, About-page sections); we change how it's built and how it looks.

## Decisions (from brainstorming)

1. **Intro:** Keep the cinematic full-screen entrance that transitions into the resume — rebuilt to be smooth.
2. **Color identity:** Dark base + a single **cyan** accent used consistently everywhere.
3. **Work History:** Alternating cards on a **centered vertical rail** (the spine look), rebuilt as one CSS grid; collapses to a single left-rail column on mobile.
4. **Projects:** Inline cards (image + text) **and** each links out to its own dedicated detail page.
5. **Nav:** **Text-only** links (no emoji) — `Email`, `Resume`, `About`.
6. **About page:** Keep all content (tinkering / aquariums / pets), redesign to match, fix the broken "back" button.

## Design System (new foundation)

Introduce design tokens in SCSS so every value comes from one place. No more scattered one-off colors.

```scss
:root {
  --bg:          #0b0f12;  // page background (dark, slightly cool)
  --surface:     #15191d;  // cards / panels
  --surface-2:   #1b2026;  // raised / hover
  --border:      #243038;  // hairline borders
  --accent:      #22d3ee;  // cyan — links, nodes, buttons, highlights
  --accent-ink:  #04222a;  // text on top of accent fills
  --text:        #e6edf0;  // primary text
  --text-muted:  #9fb0b8;  // secondary text, dates

  --radius:   10px;
  --radius-sm: 8px;
  --gap:      1.5rem;
  --maxw:     1100px;       // content max-width
}
```

- **Spacing** comes from a small scale (`0.5 / 1 / 1.5 / 2 / 3 rem`) rather than ad-hoc `margin: 5rem` / `6rem`.
- **Typography:** keep PT Sans. Establish a clear hierarchy (section `h1`, entry title, date/muted, body) and reuse it everywhere.
- All existing scattered colors (`#110164`, `#06187a`, `#02000c`, `#1f1f1f`, the various `rgba(255,255,255,.2)`) are replaced by tokens.

## Page Structure & Layout

The core change: **stop absolutely-positioning everything.** Normal document flow + flexbox/grid; `position: fixed`/`absolute` only where genuinely needed (the intro hero, the scroll cue).

### Landing / Intro (rebuilt)
- Full-screen hero: character art (`landing.png`) + animated name + scroll cue, same concept as today.
- The click-to-advance zoom/fade transition is **rebuilt on `requestAnimationFrame`** (and/or scroll-driven), replacing `setInterval(fn, 1)`. Smooth, cancellable, battery-friendly.
- The frosted header bar and the name animation are preserved in spirit but driven by classes/CSS transitions rather than per-frame inline-style writes from JS.
- Dead/mismatched CSS is removed: `.name`/`.first-name`/`.last-name` (HTML uses `*-animated`), `.design` (HTML uses `.design-section`), duplicate `border-radius`, etc.

### Top nav / banner
- Frosted bar retained, restyled with tokens. Three **text links**: `Email`, `Resume`, `About`, laid out with flexbox (no `left: 34% / 49.5% / 62%` magic numbers).
- Real semantic elements: `<a>` for Email (mailto) / About / Resume, not `<div onclick>`.

### Work History
- One CSS grid: `1fr · [rail] · 1fr`. The rail is a real gradient element down the center with glowing cyan nodes.
- Cards alternate left/right via `:nth-child`. No `timeline-empty` / `timeline-middle` spacer divs.
- **Mobile:** rail shifts to the left edge, all cards stack to its right.
- Each entry: logo, role, company, italic date (muted), bullet points. Company logos move to local assets (see below).

### Projects
- Inline cards matching the new surface style: image/video on one side, text on the other, consistent sizing.
- Each card is a link to a **dedicated detail page** (`projects/aquamate.html`, `projects/robotic-car.html`), scaffolded from existing bullet content with clearly-marked spots for screenshots and longer write-ups for Elliot to fill in later.

### Education & Skills
- Education: keep both entries (SFSU, Fullstack Academy), restyle as consistent cards.
- Skills: keep the icon grid, align to the token spacing; consistent tile sizing.

### About page
- Keep the four content blocks (intro, tinkering, aquariums, pets) and their image galleries.
- Rebuild the layout to match the main site's system (the current hardcoded `grid-template-rows: 25% 1fr 1fr 1fr` and `width: 110%` are fragile).
- **Fix the broken "back" button** (`onclick=""` → real link to `index.html`).
- Give it real mobile rules (currently the About page has none).

## Responsive Strategy

Replace the current broken setup — desktop `min-width: 420px`, mobile `max-width: 412px` (a dead zone at 413–419px), and mobile rules covering only ~5 elements — with a clean mobile-first cascade:

- **Base (mobile-first):** single column, everything stacks.
- **Tablet** (`min-width: 768px`): two-up where it helps.
- **Desktop** (`min-width: 1024px`): centered rail, full layout, `--maxw` container.

Every major section gets rules at every breakpoint — no more sections that only exist on desktop.

## Cleanup / Correctness (folded into the work)

- **Localize external images:** download the hot-linked assets (`familymattershc.com` SVG, `paradyme.us` SVG, `developer.apple.com` Swift PNG) into `assets/images/` so the site doesn't break if those hosts change.
- **Move inline styles to classes:** repeated `style="width:50%;height:auto"` on logos, inline `style="display:flex"` on the header container, etc.
- **Accessibility/semantics:** `<button>`/`<a>` instead of clickable `<div onclick>`; keep meaningful `alt` text; drop `overflow: scroll` (permanent scrollbars) in favor of `auto`.
- **Meta/SEO:** fix the `description` meta (currently `"hi mom!"`); add basic Open Graph tags for link sharing.
- **Copy/typos:** support (not "suport"), Independent, miniature, roughhousing, troubleshot, and tidy the "two cats … and a dog" sentence.
- Keep SCSS as the source of truth; `style.css` is compiled output.

## Out of Scope (YAGNI)

- No framework / build-tool migration — stays static HTML + SCSS + vanilla JS.
- No CMS, no new content beyond scaffolding the two project pages.
- No light theme.
- No analytics/contact-form backend.

## Success Criteria

- One accent color and one surface color used consistently site-wide; no orphan magic-number positions for content layout.
- Work History renders as a clean centered-rail timeline on desktop and a left-rail stack on mobile, with no spacer divs.
- Intro animation runs via `requestAnimationFrame` (no `setInterval(fn,1)`), smooth on desktop and mobile.
- Site looks correct and intentional from ~360px up through desktop, including the former 413–419px dead zone.
- "Back" button works; nav links are real, text-only, semantic.
- No hot-linked third-party images; no console-visible dead CSS referencing nonexistent classes.

## Implementation Order (proposed)

1. SCSS foundation: tokens, kill dead/duplicate CSS, flexbox nav.
2. Work History centered-rail rebuild.
3. Projects inline cards + scaffold two detail pages.
4. Education / Skills restyle.
5. Intro animation rebuilt on rAF.
6. Responsive cascade (mobile-first, three breakpoints).
7. About page rebuild + back-button fix.
8. Polish pass: localize images, typos, meta/OG tags, a11y/semantics.
