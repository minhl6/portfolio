# Robotic Arm — Project Brief for Claude Code

Briefing for the AI assistant. The owner is a second-year mechanical engineering student with
almost no web-coding experience. Make the changes below, explain each one in plain English, and
don't break the other projects that already work. (This brief replaces any earlier version.)

The goal is a **concise, media-first project page**: a short overview + hero image, then small
sections that each pair one or two sentences with a single piece of media (video, image, code).
Not one big wall of text.

---

## INSTRUCTIONS

1. **Add a sectioned layout** to the project detail page (see PAGE FEATURES below). It must be
   optional and backward-compatible: the other three projects use the old `description` array and
   must keep rendering exactly as they do now.

2. **Replace the placeholder project.** In `src/data/projects.js`, the `'robotic-arm-design'`
   entry is template text (wrongly says 5-DOF, gripper, inverse kinematics). Replace the whole
   entry with the PROJECT DATA block below. Keep the key `'robotic-arm-design'` so the URL stays
   the same. Match the file's formatting (4-space indent, single quotes).

3. **All local media paths** use the `import.meta.env.BASE_URL` pattern (no leading slash) so they
   work on GitHub Pages. Where a media file doesn't exist yet, the field is left empty with a TODO;
   the page must skip empty media gracefully (no broken images / empty boxes).

4. Run the dev server and summarize what changed.

---

## PROJECT DATA — paste into src/data/projects.js (replace the existing 'robotic-arm-design' entry)

```js
    'robotic-arm-design': {
        title: 'Master–Slave Robotic Arm',
        category: 'personal',
        tagline: 'A 4-DOF arm that mirrors a hand-held replica in real time, with record and playback',
        tools: ['SolidWorks', 'KiCad', 'Arduino', 'JLCPCB', '3D Printing'],

        // Card thumbnail + big image at the top of the detail page.
        // TODO: replace both with public/media/robotic-arm/hero.jpg (a photo of both arms).
        image: 'https://picsum.photos/seed/robotic-arm/1200/800',
        hero: 'https://picsum.photos/seed/robotic-arm/1200/800',

        // Short overview shown under the hero image.
        summary: 'A 4 degree-of-freedom robotic arm that copies a hand-held replica in real time. You move a larger passive twin of the arm and the real arm mirrors your motion with four servos — and it can record a sequence and play it back on its own. I designed and built the whole thing: both 3D-printed arms, a custom Arduino shield PCB, and the firmware.',

        // Sectioned, media-first body. Each section = a short statement + one piece of media.
        sections: [
            {
                heading: 'Demo',
                text: 'The arm runs in three modes — live manual control, recording, and autonomous playback. The video shows all three.',
                video: '', // TODO: unlisted YouTube link, OR public/media/robotic-arm/demo.mp4
            },
            {
                heading: 'Master–slave control',
                text: 'Instead of a joystick or an app, I drive the arm with a passive copy of itself. Four potentiometers on the held arm sense each joint angle and the servos match them. Copying angles directly means the arm never has to solve inverse kinematics.',
                image: '', // TODO: public/media/robotic-arm/master-arm.jpg (optional)
            },
            {
                heading: 'Mechanical design',
                text: 'Both arms are 3D printed in PLA and modeled in SolidWorks; the active arm is about 17 cm tall. I designed a base enclosure around the electronics so the wiring is hidden and it reads as a finished product.',
                image: '', // TODO: public/media/robotic-arm/exploded-view.png (SolidWorks exploded view)
            },
            {
                heading: 'Custom PCB',
                text: 'To get off the breadboard I designed a custom Arduino shield in KiCad — my first board. It connects all four servos and potentiometers, adds status LEDs and mode buttons, and uses a ground pour for clean signals. I sized the 5 V power trace with the IPC-2221 standard and had it manufactured by JLCPCB.',
                images: ['', ''], // TODO: kicad-schematic.png, kicad-pcb.png
            },
            {
                heading: 'Firmware',
                text: 'The firmware is a state machine with manual, record, and playback modes. The hardest part was clean motion: I smooth the noisy sensor readings, throw out physically impossible jumps, and interpolate between recorded points so the arm glides instead of snapping.',
                // TODO: paste ~15–25 lines of your REAL firmware here (keep it short).
                // Best pick: your readSmoothedPot() function — it shows the smoothing +
                // spike-rejection logic, which is the most interesting self-contained piece.
                code: '// paste your real Arduino code snippet here',
                language: 'cpp',
            },
            {
                heading: 'Problems I solved',
                text: 'Most of the issues turned out to be hardware, not code. The servos snapped to a default position on power-up until I set each angle before powering them. Turning all four on at once caused a power dip, so I staggered their startup. Loose jumper wires made the readings jump and the arm twitch, so I added a spike filter and hot-glued the connectors. And I replaced every servo with a metal-gear MG90D after the plastic-gear ones proved too sloppy to position repeatably.',
                image: '', // TODO: optional build/wiring photo
            },
            {
                heading: 'What I left out',
                text: 'I dropped a fuse and a dedicated servo-driver chip because they added complexity without improving the result, and I chose not to publish a repeatability number once I found the variation was not mechanical — better to omit it than report a misleading figure.',
            },
        ],
    },
```

> Each section is short on purpose. If you later get a photo for a specific fix, split
> "Problems I solved" into its own one-line sections, each with an image — that matches the
> media-first style best.

---

## PAGE FEATURES — add to src/pages/ProjectDetail.jsx

Add support for two optional fields on a project: `hero` (a big image path) and `sections`
(an array of content blocks). Keep everything backward-compatible.

Detail page render order:
1. Back link, title, tagline, tools chips (as now).
2. **Hero image** = `project.hero` if set, otherwise `project.image`. Use `import.meta.env.BASE_URL`.
3. **Overview** = the `summary` paragraph.
4. If `project.description` exists (old projects) → render those paragraphs as now.
5. If `project.sections` exists → render each block in order.

Each section block can include any of these fields; render only the ones present:
- `heading` → a section subheading (h3-style, reuse existing heading styles).
- `text` → one short paragraph.
- `image` → a single image (skip if empty string).
- `images` → an array of images shown side by side, wrapping on mobile (skip empties).
- `video` → if it's a YouTube/Vimeo URL, a responsive 16:9 iframe with a `title`; if it's a
  local `/public` path, an HTML5 `<video controls>` tag. Skip if empty.
- `code` → a styled, horizontally-scrollable monospace code block (`<pre><code>`). No syntax-
  highlighting library needed. `language` is just a label; ignore if you don't show it.
- `caption` → small muted text under the media (optional).

Rules:
- Local image/video paths use `import.meta.env.BASE_URL` (no leading slash).
- Empty-string or missing media must render nothing (no broken image, no empty player).
- Add styles to `src/style.css` reusing the existing design (container width, spacing, border
  radius, colors). Keep it accessible: alt text on images, `title` on the video iframe.
- Projects with no `sections`/`hero` must look identical to before.

---

## MEDIA MANIFEST — files to add under public/media/robotic-arm/

The owner is making these. Strongest visuals are the demo video, the KiCad schematic + PCB
layout, and the SolidWorks exploded view (the finished electronics are hidden in the enclosure).

- `hero.jpg` — both arms together (main photo)
- demo video — unlisted YouTube link (preferred) or `demo.mp4`, 60–90 s showing manual → record → playback
- `master-arm.jpg` — the hand-held passive arm (optional)
- `exploded-view.png` — SolidWorks exploded assembly
- `kicad-schematic.png` — the shield schematic
- `kicad-pcb.png` — the PCB layout
- a real firmware snippet pasted into the Firmware section's `code` field
