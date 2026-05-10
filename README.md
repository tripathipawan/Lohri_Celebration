# Lohri Celebration — Interactive Festival Experience

An immersive, fully animated Lohri festival web experience built with HTML, CSS, and Vanilla JavaScript. The project goes far beyond a static greeting page — it features a gated start screen, a full-screen animated night scene with a 3D-effect bonfire, a cursor-following fire trail, JavaScript-spawned firecracker particles, dynamically generated stars, an animated Punjabi village, SVG heat distortion, background audio with Dhol beats, and three independent user-toggleable controls for music, fireworks, and crackers.

---

## What This Project Does

The page opens with a dramatic **start screen** — a full-viewport overlay with a bold title ("LOHRI CELEBRATION"), a subtitle describing what's about to happen, and a single "🔥 ENTER THE VIBE" button. Clicking the button triggers a CSS **transition screen** ("WELCOME TO LOHRI!") that animates in, holds briefly, then fades out to reveal the main festival scene. From that point on, the scene runs continuously and autonomously: flames flicker, stars twinkle, cursor fire follows mouse movement, crackers pop, and the village sits silhouetted against the night sky. Three control buttons at the bottom of the scene let the user independently toggle music, fireworks, and crackers on or off at any time.

---

## Scene Layers — What's on Screen

**1. Start Screen (`.start-screen`)**
A full-viewport fixed overlay that sits above everything else (`z-index` stacking). It holds a centered `.start-content` block with the project title in a large display font, a tagline paragraph, and the entry button. On button click, JavaScript adds a class that animates the screen out (opacity/transform transition), then shows the transition screen.

**2. Transition Screen (`.transition-screen`)**
A separate fixed overlay containing a single `.transition-text` element with "WELCOME TO LOHRI!" The screen animates in after the start screen exits, holds for a moment via a CSS animation delay, then fades out — revealing the main `.scene` underneath.

**3. SVG Heat Distortion Filter**
An invisible `<svg>` element with `width="0" height="0"` placed in the markup. It defines a `<filter id="heat">` using `<feTurbulence>` and `<feDisplacementMap>`. The turbulence baseFrequency is animated with `<animate>` (cycling between `0.01` and `0.02` over 2 seconds, `repeatCount="indefinite"`). This filter is applied via CSS to the `.fire-container` — making the flames appear to ripple and waver with a genuine heat-shimmer distortion effect.

**4. Main Fire (`.fire-container`, `#mainFire`)**
Three `div.flame` elements inside `#mainFire`, each independently animated at slightly different speeds, sizes, and timing offsets to create an organic, non-uniform flickering. Below the fire, three `div.log` elements represent the bonfire logs — styled as dark brown rounded rectangles arranged in a scattered pile. The entire `.fire-container` has the SVG heat filter applied via `filter: url(#heat)` in CSS.

**5. Cursor Fire (`#cursorFire`)**
A small div that follows the user's mouse cursor across the screen. JavaScript listens for `mousemove` events on the document and updates `#cursorFire`'s `left` and `top` CSS properties to match the cursor position. The element itself is styled as a tiny flame shape (CSS clip-path or border-radius trick) with an orange-red gradient and a pulsing CSS animation — giving the effect that the cursor is always dragging a small flame with it.

**6. Cracker Container (`#crackerContainer`)**
An empty div that JavaScript populates dynamically. When crackers are toggled on, `script.js` runs an interval that creates new `div` elements inside `#crackerContainer` at random `left`/`top` positions. Each cracker div is given a random color (from a predefined palette of festival colors), a size, and a CSS animation class that makes it expand from a point and fade out — simulating a firecracker burst. Completed cracker elements are removed from the DOM after their animation ends (`animationend` event listener) to prevent DOM bloat.

**7. Village (`#village`)**
Two `.housebox` groupings, each containing two `.house` elements. Each house is built from a `.house-roof` div (CSS triangle via border trick) and a `.house-body` div containing a `.house-window` and a `.house-door`. The houses are intentionally left as dark silhouettes (near-black fill) against the night sky to mimic the look of a village seen from a distance by firelight. The two groupings are positioned at different horizontal offsets to create a scattered village layout.

**8. Stars (`#stars`)**
An empty `div` that `script.js` fills with dozens of small `span` or `div` elements. Each star is given a random `top`/`left` position (percentage-based within `#stars`), a random size (1–3px), and a random CSS animation delay on a `twinkle` keyframe — creating a natural, asynchronous star-field rather than stars blinking in unison.

**9. Greeting Container (`#greetingContainer`)**
Three stacked text blocks: an `<h1>` with "HAPPY LOHRI!" in large bold display type, a `div.punjabi-greeting` with the Punjabi script line "ਲੋਹੜੀ ਦੀਆਂ ਲੱਖ ਲੱਖ ਵਧਾਈਆਂ!" (rendered using system or web fonts that support Gurmukhi Unicode), and a `div.genz-text` with a casual line and two styled hashtag `<span>` elements (`#LohriVibes`, `#PunjabiHeat`).

**10. Wheat Fields (`.wheat`)**
A full-width div at the bottom of the scene, styled with a golden-amber gradient and subtle repeating CSS patterns to suggest a harvested wheat field — thematically appropriate since Lohri celebrates the harvest season.

**11. Grain Effect (`.grain`)**
A fixed `div` overlaid on the entire scene with a transparent background and a CSS `background-image` using `url("data:image/svg+xml,...")` or a noise filter — adding a subtle film grain texture across the whole scene for a warmer, more cinematic feel.

**12. Footer Text (`.footer-text`)**
A single line at the bottom of the `.scene`: "Celebrate the festival of fire and harvest • Made with ❤️ for Lohri • 2024". Styled in a small muted color that doesn't compete with the main scene content.

---

## Audio System

Two `<audio>` elements are present in the HTML, both with `loop` attribute:

```html
<audio id="backgroundMusic" loop>
  <source src="../assets/firework.wav" type="audio/wav">
</audio>

<audio id="dholBeats" loop>
  <source src="../assets/Bhangra.mp3" type="audio/mp3">
</audio>
```

`backgroundMusic` plays ambient firework/celebration sounds. `dholBeats` plays looping Bhangra/Dhol music. Both are muted by default and controlled via the music toggle button. JavaScript's `audio.play()` and `audio.pause()` methods switch them on and off together when the "🎵 Music On/Off" button is clicked.

---

## Control Panel — Three Toggle Buttons

The `.controls` block at the bottom of `.scene` holds three `button.control-btn` elements:

**`#musicToggle`** — Calls `audio.play()` / `audio.pause()` on both audio elements simultaneously. Button label flips between "🎵 Music On" and "🎵 Music Off".

**`#fireworksToggle`** — Starts or stops a `setInterval` that spawns `.firework` div elements at random screen positions. Each firework div runs a CSS burst animation and is removed via `animationend`. Button label flips between "🎆 Fireworks On" and "🎆 Fireworks Off".

**`#crackersToggle`** — Starts or stops a separate `setInterval` that spawns `.cracker` burst elements inside `#crackerContainer`. Similar spawn-and-remove pattern as fireworks but with different colors, sizes, and animation timing. Button label flips between "🧨 Crackers On" and "🧨 Crackers Off".

---

## How the JavaScript Works — `script.js`

`script.js` is the engine behind everything dynamic on the page. Its responsibilities break into distinct phases:

**Phase 1 — Start screen and transition:**
An event listener on `.start-btn` triggers a CSS class toggle on `.start-screen` (e.g. `.hidden` with `opacity: 0; pointer-events: none; transition: opacity 0.8s`). After a `setTimeout` matching the transition duration, the `.transition-screen` class is activated, held via its own CSS animation, then deactivated to reveal `.scene`.

**Phase 2 — Star generation:**
On DOM load, a loop runs (e.g. 80–120 iterations) creating `<span>` elements and appending them to `#stars`. Each span receives `position: absolute`, random `top`/`left` in percentage, random `width`/`height` in the 1–3px range, `background: white`, `border-radius: 50%`, and a randomized `animation-delay` on a CSS `twinkle` keyframe.

**Phase 3 — Cursor fire:**
A `document.addEventListener('mousemove', (e) => { ... })` updates `cursorFire.style.left` and `cursorFire.style.top` on every mouse move event. A small offset centers the flame element on the cursor rather than aligning its top-left corner.

**Phase 4 — Cracker spawning:**
`setInterval` runs every ~400–600ms (while crackers are on) and calls a `spawnCracker()` function. This function creates a new `div`, assigns random `left`/`top` as inline styles, picks a random color from a festival palette array, appends it to `#crackerContainer`, and attaches an `animationend` listener that calls `element.remove()` when the burst animation completes.

**Phase 5 — Firework spawning:**
Same pattern as crackers but with a different size range, color set, and animation class. Both systems share the spawn-animate-remove lifecycle to keep the DOM clean.

**Phase 6 — Toggle button event listeners:**
Each control button has a `click` listener. The listener toggles a boolean flag, calls `clearInterval` or sets a new `setInterval` accordingly, and updates `button.textContent` to reflect the current state.

---

## Styling — `style.css`

**Color palette:** Deep black/dark navy night sky; amber and orange for fire; golden yellow for wheat; off-white for stars and clouds; festival colors (red, pink, green, yellow, purple) for crackers and fireworks; warm white for greeting text with a glow `text-shadow`.

**Scene setup:** `position: relative; width: 100vw; height: 100vh; overflow: hidden; background` set to a dark night gradient. All child elements are `position: absolute` to layer independently.

**Flame animation:**
```css
@keyframes flicker {
  0%, 100% { transform: scaleY(1) scaleX(1);   opacity: 1; }
  25%       { transform: scaleY(1.1) scaleX(0.95); opacity: 0.9; }
  50%       { transform: scaleY(0.95) scaleX(1.05); opacity: 1; }
  75%       { transform: scaleY(1.05) scaleX(0.98); opacity: 0.95; }
}
```
Each `.flame` runs `flicker` at a slightly different duration (e.g. `1.2s`, `1.5s`, `1.8s`) and `animation-delay` so they never sync — making the fire look alive.

**Star twinkle:**
```css
@keyframes twinkle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.2; transform: scale(0.6); }
}
```

**Cracker burst:**
```css
@keyframes crackerBurst {
  0%   { transform: scale(0);   opacity: 1; }
  70%  { transform: scale(1.5); opacity: 0.8; }
  100% { transform: scale(2);   opacity: 0; }
}
```

**CSS triangle (house roofs):**
```css
.house-roof {
  width: 0;
  height: 0;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 40px solid #1a1a1a;
}
```

**Grain overlay:**
```css
.grain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.06;
  background-image: url("data:image/svg+xml,..."); /* noise pattern */
  z-index: 100;
}
```

---

## Tech Stack

| Technology | Role |
|---|---|
| HTML5 | 137-line scene markup — start screen, transition screen, SVG filter, fire container with 3 flames + 3 logs, village with 4 houses, stars container, greeting with Punjabi + Gen-Z text, wheat field, grain overlay, 2 audio elements, 3 control buttons |
| CSS3 | Night sky gradient, CSS triangle roofs, flicker/twinkle/crackerBurst keyframes, SVG heat filter application, film grain overlay, start/transition screen animations |
| JavaScript (Vanilla) | Start screen flow, star generation loop, mousemove cursor fire, cracker + firework spawn-animate-remove lifecycle, audio play/pause, three independent interval toggle controls |

---

## Project Structure

```
Lohri_Celebration/
├── Index.html     # Full 137-line scene — start screen, transition, SVG heat filter, fire (3 flames + 3 logs), village (2 houseboxes × 2 houses each with roof/body/window/door), stars div, greeting (H1 + Punjabi + genz text), wheat, grain, 3 control buttons, 2 audio elements (firework.wav + Bhangra.mp3)
├── style.css      # Night scene gradient, CSS triangle roofs, flicker + twinkle + crackerBurst keyframes, heat filter CSS, grain overlay, start/transition screen transitions, responsive layout
├── script.js      # Start screen button flow, star generation (position/size/delay randomization), mousemove cursor fire, setInterval cracker spawner, setInterval firework spawner, animationend DOM cleanup, 3 toggle button listeners
└── assets/        # (referenced via ../assets/ relative path)
    ├── firework.wav    # Ambient celebration audio — looped as background ambience
    └── Bhangra.mp3     # Dhol/Bhangra music — looped as festival background track
```

---

## How to Run

1. Clone the repository
   ```bash
   git clone https://github.com/tripathipawan/Lohri_Celebration.git
   ```
2. Place `firework.wav` and `Bhangra.mp3` inside an `assets/` folder one level above the project root (the `src` attribute paths reference `../assets/`), or update the `src` paths in `Index.html` to match your local asset locations.
3. Open `Index.html` in any modern browser. No build step, no server, no npm — runs entirely from the file system.

---

## Repository

[https://github.com/tripathipawan/Lohri_Celebration](https://github.com/tripathipawan/Lohri_Celebration)
