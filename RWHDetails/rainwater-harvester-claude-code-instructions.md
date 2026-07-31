# Claude Code Task: Add the "Rainwater Harvester (RWH)" project to my portfolio

You are working inside my personal portfolio repo (React 18 + Vite + React Router,
plain CSS, content keyed by slug in `src/data/projects.js`, deployed to GitHub Pages).
I want you to add a new **school** project: a rainwater harvesting system design built
around a 5-year spreadsheet simulation.

This entry uses the **same extended, optional schema and rich detail-page layout** as my
"Chompy" project (`chompy`). If you have already added Chompy and extended
`ProjectDetail.jsx` to render the rich sections conditionally, most of the rendering work
is done and you mainly need to add this data entry (plus one small optional field,
`finalDesign`, described below). If Chompy is not yet added, follow the same
inspect-first, additive, non-breaking approach described here.

All written content below is final — use it as-is. **Only the images are placeholders
for me to fill in.** Wire up the slots, reference the file paths exactly as specified,
and leave clear `TODO` comments where I need to drop media. There are no videos in this
project.

---

## Step 0 — Inspect before you change anything

Read these and report what you find before editing:

- `src/data/projects.js` — confirm the field shape used by existing entries (especially
  the `chompy` entry if present) so this matches.
- `src/pages/ProjectDetail.jsx` — confirm it renders the rich sections (`overview`,
  `contribution`, `process`, `engineering`, `results`, `reflection`, `gallery`)
  conditionally. Note whether a `finalDesign` field is already handled.
- `src/pages/Home.jsx` — confirm the card reads the fields this entry provides and that
  the School filter (`category: "school"`) will include it.
- `src/style.css` — match existing variables/conventions for any new styles.

Adapt the entry to the real schema if it differs from what's written here, and tell me
what you changed.

---

## Step 1 — Add the project entry

Add this to `src/data/projects.js`, keyed by the slug `rainwater-harvester`:

```js
"rainwater-harvester": {
  // --- card / routing basics ---
  title: "Rainwater Harvester — System Simulation & Design",
  tagline: "A 5-year spreadsheet model to design an off-grid drinking-water system",
  category: "school",
  tools: [
    "Excel",
    "Spreadsheet simulation",
    "Fluid mechanics",
    "Energy systems modeling",
    "Data analysis",
  ],

  // --- hero ---
  hero: {
    image: "/projects/rwh/hero.png",   // TODO(me): suggest the RWH system flow diagram or the satisfaction radar chart
    alt: "Diagram of a rainwater harvesting system: catchment, pump, treatment, storage, and supply to a house",
  },

  // --- quick facts strip ---
  meta: {
    context: "APSC 101 · Module 7 · Cornerstone design project",
    team: "6-person team (Group M6)",
    myFocus: "System simulation — topography, fluids, weather & power modeling",
    timeframe: "First year",
  },

  // --- Problem ---
  overview:
    "Module 7 was the first-year cornerstone project: design a rainwater harvesting (RWH) system to supply safe drinking water to an off-grid, two-person household in Van Anda, a remote community on Texada Island, BC. Because the home has no grid power, the system also had to generate its own electricity. Rather than build hardware, each team built a spreadsheet simulation of five years of operation, and every design was scored by the course's independent simulator across eight weighted stakeholder priorities — consumption, cost, health and environmental risk, greenhouse-gas emissions, maintenance, non-potable supply, on-demand flow rate, and reliability.",

  // --- What I did (clear individual ownership on a team project) ---
  contribution: [
    "Built the topography model: computed pipe length as a 3-D distance and elevation head from the site's contour map, and made grid-based maps for placing the storage tank and additional catchment within the site's keep-out constraints.",
    "Modeled five years of weather by assembling multi-station historical rainfall into a daily series, including drier years to stress-test the design against climate variability.",
    "Built the 5-year catchment simulation — a daily water balance of collection vs. household demand that tracked reliability: how many days the system met full demand, and whether it cleared the 200-day requirement.",
    "Modeled the on-demand flow to the house, solving iteratively for flow rate given pipe friction, fitting losses, elevation, and filter resistance, capped by the UV unit's maximum treatable flow.",
    "Modeled pump-to-storage by matching the pump's pressure and efficiency curves to the system head, finding the daily operating point and the energy needed to refill the tank.",
    "Built the diesel power model — pumping energy plus the 24/7 UV load converted to diesel use through generator and battery efficiencies — which became the baseline the team compared against solar.",
    "Debugged, corrected, and error-checked across nearly all sheets of the shared 17-sheet workbook.",
  ],

  // --- Design process (the analysis arc) ---
  process: [
    {
      phase: "Stakeholder priorities → weights",
      body: "Turned Van Anda stakeholder needs (reliable water, low long-term cost, low maintenance) into the eight weighted satisfaction criteria the design would be judged on.",
      image: "/projects/rwh/process-weights.png",   // TODO(me): the satisfaction-weights pie chart
      alt: "Pie chart of the eight weighted satisfaction criteria",
    },
    {
      phase: "Subsystem modeling",
      body: "Built the workbook as linked subsystems — weather, catchment, storage, fluids and pump, treatment, and power — so each could be tested in the context of the whole system over five years.",
      image: "/projects/rwh/process-system.png",     // TODO(me): the RWH system flow diagram
      alt: "Flow diagram of the rainwater harvesting subsystems",
    },
    {
      phase: "Configuration comparison",
      body: "Ran each major decision — solar vs. diesel, ozone vs. chlorine, filter choice and placement, catchment area, tank sizes, consumption target, and non-potable inclusion — as a head-to-head satisfaction comparison.",
      image: "/projects/rwh/process-comparison.png", // TODO(me): one of the stacked-bar comparison charts (e.g. energy or water treatment)
      alt: "Stacked-bar charts comparing configuration options by total satisfaction",
    },
    {
      phase: "Final design & verification",
      body: "Locked in the highest-scoring configuration and verified it against the full 5-year simulation and required checks, including reliability and on-demand flow.",
      image: "/projects/rwh/process-placement.png",  // TODO(me): the topography placement map (storage + extra catchment) — this is my work
      alt: "Topography map showing chosen storage tank and additional catchment locations",
    },
  ],

  // --- Key engineering decisions (challenge -> analysis -> outcome) ---
  engineering: [
    {
      challenge: "Solar vs. diesel power",
      test: "Compared a full diesel-generator energy model against a solar-panel system on total satisfaction.",
      outcome: "Solar scored higher (≈0.88 vs ≈0.73) on cost, emissions, health, and maintenance — the team chose 12 solar panels with 5 batteries.",
    },
    {
      challenge: "Where to place storage & catchment",
      test: "Used the contour map to trade off elevation (which improves on-demand flow) against pipe length and pumping energy.",
      outcome: "Placed the storage tank at a close, elevated point and added 325 m² of catchment — balancing flow, pressure losses, and piping cost.",
    },
    {
      challenge: "Catchment tank size",
      test: "Compared collection-tank volumes on overall satisfaction.",
      outcome: "A 2,500 L tank scored best; larger tanks added cost and maintenance without enough capture gain.",
    },
    {
      challenge: "Ozone vs. chlorine disinfection",
      test: "Compared both chemical-treatment methods on health/environmental risk and cost.",
      outcome: "Ozone scored higher and avoided chlorine's handling risk and the broken, costly existing chlorine setup.",
    },
  ],

  // --- Final design summary (optional spec list) ---
  // If ProjectDetail doesn't yet handle `finalDesign`, add a section that renders it as a
  // simple label/value spec list when present (Chompy has no finalDesign, so it won't render there).
  finalDesign: [
    { label: "Catchment", value: "Full roof + 325 m² additional (425 m² total)" },
    { label: "Catchment tank", value: "2,500 L" },
    { label: "Storage tank", value: "30,000 L (30 m³)" },
    { label: "Pump", value: "Pump A" },
    { label: "Treatment", value: "Ozone + 40 W UV; 5 & 200 μm filters (plus required 1 μm)" },
    { label: "Power", value: "Solar — 12× HES-305P panels + 5 batteries + DC–AC inverter" },
    { label: "Design target", value: "620 L/day consumption; 29 LPM on-demand flow" },
  ],

  // --- Results ---
  results: {
    metrics: [
      { value: "2nd / 10", label: "in our studio section" },
      { value: "63.66%", label: "satisfaction on the coordinators' withheld-weather simulation" },
      { value: "0.882", label: "overall satisfaction on our own 5-year model" },
    ],
    narrative:
      "On our own 5-year model the final design scored 0.882 overall satisfaction at a projected cost of about $62,000 — roughly 58% of the cost of shipping water in. When the course coordinators ran every team's design through their independent simulator on withheld future weather, ours scored 63.66% and placed 2nd of 10 in our studio section. The gap between those two numbers is the lesson: a design tuned to historical weather has to hold up against conditions you can't see in advance.",
  },

  // --- Reflection ---
  reflection:
    "The biggest takeaway was how much unseen, drier-than-historical weather can pull down a design that looks strong on paper. On-demand flow rate was our weakest score, and reliability under drought is where the design was most exposed — next time I'd size in more margin there rather than optimizing tightly to the historical data we had.",

  // --- Media gallery (images only — no video) ---
  // TODO(me): drop files into public/projects/rwh/ and update paths/captions below.
  gallery: [
    { type: "image", src: "/projects/rwh/satisfaction-radar.png", caption: "Per-criterion satisfaction (design model)", alt: "Radar chart of satisfaction across the eight criteria" },
    { type: "image", src: "/projects/rwh/cost-breakdown.png",     caption: "5-year cost breakdown (~$62k)",               alt: "Donut chart of 5-year system costs by category" },
    { type: "image", src: "/projects/rwh/final-recommendation.png", caption: "Final system specification",              alt: "Table summarizing the final recommended RWH configuration" },
  ],

  // Plain-text fallback for any older rendering path.
  description:
    "A first-year cornerstone project to design an off-grid rainwater harvesting system for a remote BC household, evaluated through a team-built 5-year spreadsheet simulation scored on eight weighted criteria. I owned much of the quantitative core — the topography/elevation and component-placement model, the 5-year weather and catchment simulations, the on-demand flow and pump-to-storage fluid models, and the diesel power model. The final design placed 2nd of 10 in our studio section at 63.66% satisfaction on the coordinators' withheld-weather simulation.",
},
```

---

## Step 2 — Rendering notes

The detail page should already render the rich sections from the Chompy work. The only
addition here is the optional **`finalDesign`** field: render it as a labeled spec list
(label/value rows) in its own section — a good spot is right after `process` (the final
design) or just before `results`. Render it only when present, so Chompy is unaffected.

Everything else (`overview`, `contribution`, `process`, `engineering`, `results`,
`reflection`, `gallery`) uses the same components/sections as Chompy. The `gallery` here
is images only — no video items — so the video branch simply won't be used.

---

## Step 3 — Project grid card (Home.jsx)

- It should appear under **All** and **School**.
- Card uses `hero.image` (or the flat thumbnail field your cards read — adapt as needed,
  and if cards read a top-level `image`, mirror the hero path there too).
- Title/tagline from `title` / `tagline`.

---

## Step 4 — Media placeholders (for me to fill in)

Create `public/projects/rwh/` and a short note (README.txt or a comment) listing what I
need to drop in. Expected files (most come straight from my e-poster):

| File | What it should be |
|---|---|
| `hero.png` | RWH system flow diagram, or the satisfaction radar chart |
| `process-weights.png` | Satisfaction-weights pie chart |
| `process-system.png` | RWH system flow diagram (catchment → pump → treatment → storage → house) |
| `process-comparison.png` | One stacked-bar comparison chart (e.g. energy source, or water treatment) |
| `process-placement.png` | Topography map with chosen storage + extra-catchment locations |
| `satisfaction-radar.png` | Per-criterion satisfaction radar chart |
| `cost-breakdown.png` | 5-year cost donut chart (~$62k total) |
| `final-recommendation.png` | Final recommendation table |

**Path note:** reference images as `/projects/rwh/...` (Vite prepends the `/portfolio/`
base at build time). If existing projects reference `public/` images differently, match
their convention and update these paths. Keep every path marked `TODO(me)` and let the
page degrade gracefully if an image is missing (no crash; broken-image or an `onError`
guard is fine).

---

## Step 5 — Verify

1. `npm run dev`, load `/projects/rainwater-harvester` — every section renders, no
   placeholder breaks the page, and the `finalDesign` spec list shows.
2. Confirm Chompy's page is unchanged (no `finalDesign` section appears there).
3. Confirm the card shows on the home grid under **All** and **School**.
4. `npm run lint` and `npm run build` — both clean.

Then summarize: files changed, final field names used (if different from this spec), and
the exact list of image files I still need to add.

---

## Things to flag to me

- If my schema differs from this spec (or from the Chompy entry), adapt and report.
- Don't touch the Chompy project, the robotic-arm project, or the deploy workflow.
