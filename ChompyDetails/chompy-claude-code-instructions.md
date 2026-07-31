# Claude Code Task: Add the "Chompy" project to my portfolio

You are working inside my personal portfolio repo (React 18 + Vite + React Router,
plain CSS, content keyed by slug in `src/data/projects.js`, deployed to GitHub Pages).
I want you to add a new **school** project called **Chompy**.

This project is richer than my existing ones (it has a multi-stage design process,
testing results, a decision matrix, and competition results), so **do not** reuse the
exact data shape or detail-page layout of my other projects. Design the best layout for
*this* project, but keep the rest of the site working.

All written content below is final — use it as-is. **Only the photos and videos are
placeholders for me to fill in.** Wire up the slots, reference the file paths exactly as
specified, and leave clear `TODO` comments where I need to drop media.

---

## Step 0 — Inspect before you change anything

Read these files first and report back what you find before editing:

- `src/data/projects.js` — note the exact field names and shape of an existing entry.
- `src/pages/ProjectDetail.jsx` — note how it reads a project and **whether it renders
  the description as plain text or as Markdown**. This determines how I format text.
- `src/pages/Home.jsx` — note how the project grid card is built (which fields it reads)
  and how the All / Personal / School filter uses the `category` field.
- `src/style.css` — note the existing color variables, spacing, and class-naming
  conventions so new styles match the site's visual language.

Do not assume the schema from memory — match whatever is actually in the repo.

---

## Step 1 — Extend the project schema (additively, non-breaking)

Add the new entry using an **extended, optional** set of fields (below). My existing
projects must keep working untouched, so every new field should be optional and the
detail page should only render a section when its field is present. Keep `description`
working as the fallback for old entries.

Add this entry to `src/data/projects.js`, keyed by the slug `chompy`:

```js
chompy: {
  // --- card / routing basics (match existing field names where they exist) ---
  title: "Chompy — Underwater Retrieval Device",
  tagline: "A sheet-metal scooping claw for an APSC 101 design competition",
  category: "school",
  tools: [
    "Arduino",
    "C/C++",
    "Servo motors",
    "CAD",            // TODO(me): replace with the actual package — Fusion 360 / SolidWorks / Onshape
    "Sheet metal fabrication",
  ],

  // --- hero ---
  hero: {
    image: "/projects/chompy/hero.jpg",   // TODO(me): finished claw beauty shot
    alt: "Chompy, a cylindrical sheet-metal scooping claw with an Arduino mounted on a suspended platform",
  },

  // --- quick facts strip ---
  meta: {
    context: "APSC 101 · Module 5 · Cornerstone design project",
    team: "6-person team",
    myFocus: "Arduino control code & 3D modeling",
    timeframe: "First year",
  },

  // --- Problem ---
  overview:
    "For our APSC 101 cornerstone design project, our team designed a device to retrieve underwater debris of varying shapes and sizes. The system had to be built from limited materials — sheet metal, cardboard, and common craft items — and driven by a servo motor wired to an Arduino, with an optional sonar sensor available. It had to work both fully autonomously and under a human operator whose view of the field was blocked. Our strategy prioritized consistency and simplicity over complexity: a device that did one thing reliably rather than many things unpredictably.",

  // --- What I did (clear individual ownership on a team project) ---
  contribution: [
    "Wrote the Arduino/servo control code that drove the claw's open/close cycle.",
    "Tested the sonar sensor and found it unreliable — it detected non-target objects, struggled to hold an unblocked signal, and added significant code complexity. I flagged it as a strategic risk and replaced it with a timer-based control scheme so the claw operated predictably during competition.",
    "Produced the 3D models and orthographic assembly drawings of the final design.",
    "Did sheet-metal fabrication on the claw body and ran jamming tests that exposed a key flaw in an early design.",
    "Built one of the early prototypes that, while not selected for the final, helped the team narrow the design direction.",
  ],

  // --- Design process (the narrative arc) ---
  process: [
    {
      phase: "Concept exploration",
      body: "Sketched several early concepts: a net-based expandable holder, an excavator-style scoop claw, and a fishing-net design.",
      image: "/projects/chompy/process-concepts.jpg",   // TODO(me): concept sketches
      alt: "Hand-drawn concept sketches of early retrieval-device ideas",
    },
    {
      phase: "Physical prototyping",
      body: "Built and compared three claw types — a four-arm claw, a three-prong claw, and a scoop claw — to test how each handled objects of different sizes.",
      image: "/projects/chompy/process-prototypes.jpg", // TODO(me): the three prototypes
      alt: "Three sheet-metal claw prototypes side by side",
    },
    {
      phase: "Targeted testing",
      body: "Ran focused tests against our biggest technical risks: structural deformation, object jamming, and sonar reliability.",
      image: "/projects/chompy/process-testing.jpg",    // TODO(me): a testing photo
      alt: "Load and jamming testing of the claw",
    },
    {
      phase: "Design decision",
      body: "Scored the shortlisted designs (Chompy, Tetris, 4 Arms) against weighted criteria — pickup versatility, capacity, strength, complexity, size, and material use. Chompy won at 6.9 as the best all-round “grab-all.”",
      image: "/projects/chompy/process-decision.jpg",   // TODO(me): the weighted-comparison chart
      alt: "Weighted scoring chart comparing the three final designs",
    },
    {
      phase: "Final design",
      body: "Chompy: two smooth circular scoops with a suspended platform above for the Arduino and electronics, documented with 3-view orthographic and isometric drawings.",
      image: "/projects/chompy/process-final-drawing.jpg", // TODO(me): orthographic / isometric drawing
      alt: "Orthographic and isometric assembly drawings of the final claw",
    },
  ],

  // --- Key engineering decisions (challenge -> test -> outcome) ---
  engineering: [
    {
      challenge: "Deformation under load",
      test: "Suspended the heaviest competition object from a bent metal sample for 20 seconds.",
      outcome: "Samples bent only 0.5–1 mm — no significant plastic deformation expected in competition.",
    },
    {
      challenge: "Objects jamming in the claw",
      test: "Our first two-prong sheet-metal claw: objects caught and wedged in the bent creases, causing inconsistent releases.",
      outcome: "Redesigned to a smooth, bend-free scoop so objects release cleanly every time.",
    },
    {
      challenge: "Sonar reliability (my call)",
      test: "Ran distance and code tests with the sonar sensor.",
      outcome: "Sonar detected non-target objects and needed an unobstructed signal, so I replaced it with simpler, more reliable timer-based control.",
    },
  ],

  // --- Results ---
  results: {
    metrics: [
      { value: "58", label: "blocks scooped in Round 2 (target: 25)" },
      { value: "10/15", label: "items retrieved in Round 1" },
      { value: "<1 mm", label: "deformation under the heaviest load" },
    ],
    narrative:
      "Round 1 went as designed — the claw retrieved 10 of 15 items — though a pulley malfunction and the time limit cost us cycles (an unanticipated operational risk). In Round 2 we slowed the crane so the pulley stayed seated, and the claw scooped 58 blocks, more than double our target. In the final team round, Chompy collaborated well with other teams and contributed more than we'd expected.",
  },

  // --- Reflection ---
  reflection:
    "If I did it again, I'd cut the operating cycle from 20 s to under 15 s to leave room for mis-grabs, and practice more with the crane to keep the pulley seated. The biggest lesson was how much a simple, reliable design beats a clever but fragile one — dropping the sonar for a timer is what made our results consistent.",

  // --- Media gallery (photos + videos) ---
  // TODO(me): drop files into public/projects/chompy/ and update paths/captions below.
  gallery: [
    { type: "image", src: "/projects/chompy/action-blocks-round.jpg", caption: "Blocks round", alt: "Chompy scooping small blocks" },
    { type: "image", src: "/projects/chompy/action-team-round.jpg",   caption: "Team round",   alt: "Chompy carrying a large object in the team round" },
    // Videos — see Step 5 for hosting guidance. Use one of:
    // { type: "video", src: "/projects/chompy/demo.mp4", caption: "Chompy in action" },
    // { type: "youtube", id: "TODO_VIDEO_ID", caption: "Chompy in action" },
  ],

  // Keep a plain-text description too, as a fallback for any older rendering path.
  description:
    "Chompy is a sheet-metal scooping claw built for an APSC 101 design competition to retrieve underwater debris of varying sizes. On a 6-person team I owned the Arduino control code and the 3D modeling, replaced an unreliable sonar sensor with a timer-based control scheme, and ran fabrication and jamming tests. The final design scooped 58 blocks in the second competition round, more than double our target.",
},
```

> If `projects.js` uses a different convention than my assumptions (e.g. an array instead
> of an object, or different field names like `name`/`subtitle` instead of
> `title`/`tagline`), **adapt the entry to match the real file** and tell me what you
> changed.

---

## Step 2 — Render the rich detail layout

Update `src/pages/ProjectDetail.jsx` so that when a project has these new fields it
renders a fuller layout, and otherwise falls back to the existing behavior (so the
robotic-arm project is unaffected). Suggested section order for Chompy:

1. **Hero** — `hero.image` + `title` + `tagline`, with a small `category` badge.
2. **Meta strip** — render `meta` as a compact row of label/value facts (context, team,
   my focus, timeframe).
3. **Tools** — render `tools` as pill/tag chips (reuse whatever the existing card uses).
4. **Overview** — heading "The Problem" (or "Overview"), render `overview`.
5. **My Role** — heading "What I Did", render `contribution[]` as a list. Make this
   section visually prominent — it's a team project, so my individual ownership matters.
6. **Design Process** — heading "Design Process", render `process[]` as a vertical
   sequence of steps, each with `phase`, `body`, and its `image` (with `alt`). A simple
   numbered/timeline treatment works well here.
7. **Key Engineering Decisions** — heading "Engineering & Testing", render
   `engineering[]` as a small set of cards, each showing `challenge`, `test`, `outcome`.
8. **Results** — heading "Results", render `results.metrics[]` as a row of stat blocks
   (big `value`, small `label`) followed by `results.narrative`.
9. **Reflection** — heading "Reflection", render `reflection`.
10. **Gallery** — heading "Gallery", render `gallery[]`: images in a responsive grid;
    for `type: "video"` use a `<video controls>` element; for `type: "youtube"` use a
    responsive 16:9 iframe embed (`https://www.youtube.com/embed/<id>`).

Render each section **only if its field exists** so older projects don't break.
Keep unknown slugs redirecting back to `/` as the app already does.

If the detail page renders description as **plain text** (not Markdown), there's no
Markdown to worry about here — all the new content above is plain strings and arrays,
so it will render cleanly without any `**bold**` artifacts.

---

## Step 3 — Project grid card (Home.jsx)

Make sure the new project shows up on the home grid:

- It should appear under **All** and **School** (driven by `category: "school"`).
- The card should use `hero.image` (or whatever field the existing cards read for their
  thumbnail — adapt if the card reads a flat `image` field; if so, also keep a top-level
  `image` pointing at the hero so the card has a thumbnail).
- Card title/tagline should read from `title` / `tagline` (adapt to real field names).

Verify the School filter tab now actually has a project in it.

---

## Step 4 — Styling

Add styles in `src/style.css` that match the site's existing variables and conventions
(reuse color/spacing variables; don't introduce a new framework). Aim for:

- A clean hero with the image and title.
- A metrics row that reads as 3 stat blocks on desktop, stacking on mobile.
- Process steps and engineering cards that are readable on mobile (single column) and
  use the grid/cards on wider screens.
- A responsive gallery grid (e.g. `auto-fill, minmax(...)`).

Keep it consistent with the rest of the site rather than a one-off visual style.

---

## Step 5 — Media placeholders (for me to fill in)

Create the folder `public/projects/chompy/` and add a short `README.txt` (or comment in
the data file) listing exactly which files I need to drop in. The expected files:

| File | What it should be |
|---|---|
| `hero.jpg` | Finished claw beauty shot |
| `process-concepts.jpg` | Early concept sketches |
| `process-prototypes.jpg` | The three claw prototypes together |
| `process-testing.jpg` | A load/jamming testing photo |
| `process-decision.jpg` | The weighted-comparison chart |
| `process-final-drawing.jpg` | Orthographic / isometric drawings |
| `action-blocks-round.jpg` | Action shot — blocks round |
| `action-team-round.jpg` | Action shot — team round |
| `demo.mp4` *(optional)* | Short demo clip |

**Important — paths:** `vite.config.js` sets `base: '/portfolio/'`, but files in
`public/` are still referenced **without** the `base` prefix in source (Vite prepends it
at build time). So in the data file, reference images as
`/projects/chompy/hero.jpg`, and they'll resolve to `/portfolio/projects/chompy/hero.jpg`
in production. If you find the existing projects reference `public/` images differently,
match their convention instead and update the paths accordingly.

**Videos:** don't commit large `.mp4` files into the repo — it bloats Git history and the
Pages deploy. Prefer hosting on YouTube (unlisted is fine) and using the `type: "youtube"`
gallery item with the video ID. Only commit a short, compressed `.mp4` to `public/` if I
specifically want it self-hosted.

Leave every media path in place with a `TODO(me)` marker so I can find them, and make the
detail page degrade gracefully if an image file is missing (e.g. it shouldn't crash —
broken-image is fine, or guard with an `onError` if easy).

---

## Step 6 — Verify

After making the changes:

1. `npm run dev` and load `/projects/chompy` — confirm every section renders and no
   placeholder breaks the page.
2. Confirm the card appears on the home grid under **All** and **School**.
3. `npm run lint` — fix any issues you introduced.
4. `npm run build` — confirm it builds cleanly.

Then give me a short summary of: what files you changed, the final field names you used
(in case they differ from this spec), and the exact list of media files I still need to
add.

---

## Things to double-check / flag to me

- The CAD tool in `tools[]` is a placeholder (`"CAD"`) — I'll tell you the real package.
- If my existing schema differs from the entry above, adapt and report the changes.
- Don't touch the robotic-arm project or any deploy workflow.
