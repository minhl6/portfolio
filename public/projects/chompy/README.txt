Drop these files in this folder (public/projects/chompy/) to fill in the Chompy
project page. Paths are wired up in src/data/projects.js already — just add the
files with these exact names.

  card.jpg (added)            Home grid card thumbnail + detail page hero banner
  process-concepts.jpg        Early concept sketches
  process-prototypes.jpg      The three claw prototypes together
  process-testing.jpg         A load/jamming testing photo
  process-decision.jpg        The weighted-comparison chart
  process-final-drawing.jpg   Orthographic / isometric drawings
  action-blocks-round.jpg     Action shot — blocks round
  action-team-round.jpg       Action shot — team round
  demo.mp4 (optional)         Short demo clip, self-hosted

Until a file is added, the page just skips that image — no broken-image icon.

Videos: prefer hosting on YouTube (unlisted is fine) instead of committing an
mp4 — keeps the repo and GitHub Pages deploy small. In src/data/projects.js,
swap the commented-out gallery entry:
  { type: 'youtube', id: 'YOUR_VIDEO_ID', caption: 'Chompy in action' }
Only use the type: 'video' + demo.mp4 entry if you specifically want it
self-hosted instead.
