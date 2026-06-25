export const projects = {
    'robotic-arm-design': {
        title: 'Leader-Follower Robotic Arm',
        category: 'personal',
        tagline: 'A 4-DOF arm that mirrors a hand-held replica in real time, with record and playback',
        tools: ['SolidWorks', 'KiCad', 'Arduino', 'JLCPCB', '3D Printing'],

        // Card thumbnail + big image at the top of the detail page.
        image: `${import.meta.env.BASE_URL}media/robotic-arm/Main_Photo.jpeg`,
        hero: `${import.meta.env.BASE_URL}media/robotic-arm/Main_Photo.jpeg`,

        summary: 'A 4 degree-of-freedom robotic arm that mirrors a hand-held twin in real time and can record and replay a sequence on its own. I designed and built every part of it: both 3D-printed arms, a custom Arduino shield PCB, and the firmware that ties them together.',

        sections: [
            {
                heading: 'Demo',
                text: 'The arm runs in three modes: live manual control, recording, and autonomous playback. The video below shows all three.',
                video: 'https://www.youtube.com/watch?v=MxQNZAP6aJA',
                speed: 2,
            },
            {
                heading: 'Leader and follower control',
                text: "The robot is driven by a passive twin, a hand-held arm with identical joint geometry. A potentiometer at each joint senses its angle, and the firmware writes that value straight to the matching servo, so control is just copying joint angles one to one with no inverse kinematics needed. It can also record a sequence and play it back on its own, like teaching an industrial robot by walking it through a path.",
                image: '', // TODO: the BASE_URL-prefixed path to media/robotic-arm/leader-arm.jpg (optional)
            },
            {
                heading: 'Mechanical design',
                text: 'Both arms are 3D printed in PLA and modeled in SolidWorks. The active arm is about 20 cm tall. I also designed a base enclosure around the electronics so the wiring stays hidden and the build looks like a finished product instead of a prototype.',
                video: `${import.meta.env.BASE_URL}media/robotic-arm/Full_Model.mp4`,
                loop: true,
            },
            {
                heading: 'Custom PCB',
                text: 'To get off the breadboard, I designed a custom Arduino shield in KiCad, my first board. It connects all four servos and potentiometers, adds status LEDs and mode buttons, and uses a ground pour to keep the analog signals clean. I sized the 5 V power trace using the IPC-2221 standard and had the board manufactured by JLCPCB.',
                carousel: [
                    {
                        image: `${import.meta.env.BASE_URL}media/robotic-arm/Robotic_Arm_Schematic.png`,
                        caption: 'Shield schematic',
                    },
                    {
                        image: `${import.meta.env.BASE_URL}media/robotic-arm/PCB_Layout.png`,
                        caption: 'PCB layout',
                    },
                    {
                        image: `${import.meta.env.BASE_URL}media/robotic-arm/PCB_Physical.jpeg`,
                        caption: 'Manufactured by JLCPCB',
                    },
                    {
                        image: `${import.meta.env.BASE_URL}media/robotic-arm/Inside_PCB.jpeg`,
                        caption: 'PCB fully integrated',
                    },
                ],
            },
            {
                heading: 'Firmware',
                text: 'The firmware runs in three modes: manual, record, and playback. Getting the movement to look clean was the hardest challenge. I had to smooth out the noisy sensor data, reject readings that jumped too fast to be physically possible, and ease jerky motion by blending between recorded points.',
                code: `// Reads a pot, applying smoothing (blends pot readings).
// Returns the raw reading if POT_SMOOTHING_PCT is 100.
int readSmoothedPot(int joint) {
  int raw = analogRead(POT_PINS[joint]);

  // Reject sudden spikes due to a loose connection
  if (abs(raw - smoothedPotValue[joint]) > 80) {
    return smoothedPotValue[joint];  // ignore this reading entirely
  }

  // so servos ease into pot positions rather than snapping
  int pct = (blendFramesRemaining > 0) ? BLEND_SMOOTHING_PCT : POT_SMOOTHING_PCT;
  if (pct >= 100) return raw;
  long sum = (long)pct * raw
           + (long)(100 - pct) * smoothedPotValue[joint];
  smoothedPotValue[joint] = (int)(sum / 100);
  return smoothedPotValue[joint];
}`,
                language: 'cpp',
            },
            {
                heading: 'Problems I solved',
                text: "Most of what I ran into turned out to be hardware problems, not bugs in the code. Turning on all four servos at once caused a brief power dip, so I staggered their startup instead. Loose jumper wires made the potentiometer readings jump around and the arm twitch; moving everything onto a soldered custom PCB fixed it, with solid connections and a ground pour to cut electrical noise. The biggest fix was swapping every SG90 for a metal-gear MG90D. The SG90s had loose, sloppy gears, so under load the arm would twitch because the servo couldn't actually hold the angle it thought it was at.",
                video: `${import.meta.env.BASE_URL}media/robotic-arm/Arm_Failure.mp4`,
                loop: true,
                sideBySide: true,
            },
            {
                heading: 'Evolution of the Build',
                gallery: [
                    {
                        image: `${import.meta.env.BASE_URL}media/robotic-arm/Pop_proto.jpeg`,
                        caption: 'Popsicle sticks and cheap servos taped to a bottle cap.',
                    },
                    {
                        image: `${import.meta.env.BASE_URL}media/robotic-arm/3D_printedArm_Early.jpeg`,
                        caption: '3D printed arm on a breadboard, before the custom PCB.',
                        objectFit: 'contain',
                    },
                ],
            },
            {
                heading: "What I'd Do Next",
                text: "A few things would make good next steps. Adding a fuse would protect the electronics by cutting the power instantly if a wire ever shorted. Gravity compensation, like a counterweight or spring to help hold the arm up, would stop the motors from working so hard just to keep it steady. Running a repeatability test to measure how consistently the arm returns to the same spot would give real data on how accurate it is. The most ambitious would be force feedback, so instead of control only going one way, the arm could sense when it touches something and push back on your hand, letting you feel what it's doing. That two way control is the same idea used in surgical and industrial robots.",
            },
            {
                heading: 'Other Views',
                carousel: [
                    { image: `${import.meta.env.BASE_URL}media/robotic-arm/extra/IMG_2196.jpeg`, caption: '' },
                    { image: `${import.meta.env.BASE_URL}media/robotic-arm/extra/IMG_2275.jpeg`, caption: '' },
                    { image: `${import.meta.env.BASE_URL}media/robotic-arm/extra/IMG_2281.jpeg`, caption: '' },
                    { image: `${import.meta.env.BASE_URL}media/robotic-arm/extra/IMG_2282.jpeg`, caption: '' },
                ],
            },
        ],
    },
    'axial-flux-generator': {
        title: 'Axial Flux Generator',
        category: 'personal',
        tagline: 'Parametric acrylic enclosure for an electronics project',
        image: 'https://picsum.photos/seed/laser-cut-enclosure/1200/800',
        tools: ['Fusion 360', 'Laser Cutting', 'Acrylic'],
        summary: 'A snap-fit enclosure generated from parametric sketches, designed for quick iteration on a laser cutter.',
        description: [
            'Describe the enclosure requirements: what it needed to house, tolerances, and assembly method (finger joints, snap-fit, fasteners).',
            'Explain your parametric design approach and how it sped up iteration between cutting tests.',
            'Note any lessons learned about kerf compensation, material choice, or fit tolerances.',
        ],
    },
    chompy: {
        // --- card / routing basics (match existing field names) ---
        title: 'Chompy: Underwater Retrieval Device',
        tagline: 'A sheet-metal scooping claw for an APSC 101 design competition',
        category: 'school',
        tools: [
            'Arduino',
            'C/C++',
            'Servo motors',
            'CAD', // TODO(me): replace with the actual package (Fusion 360 / SolidWorks / Onshape)
            'Sheet metal fabrication',
        ],

        // Card thumbnail (home grid). No hero banner on the detail page.
        image: `${import.meta.env.BASE_URL}projects/chompy/card.jpg`,
        hero: false,

        // --- quick facts strip ---
        meta: {
            context: 'APSC 101 · Module 5',
            team: '6-person team',
            myFocus: 'Arduino control code & 3D modeling',
            timeframe: 'First year',
        },

        // --- Problem ---
        overview:
            'For an APSC 101 design project, we built a device to retrieve underwater debris of varying shapes and sizes. We had limited materials (sheet metal, cardboard, craft items) and an Arduino-controlled servo. The device had to work both on its own and when operated by someone who couldn\'t see the field. Our strategy was to do one thing reliably instead of many things unpredictably.',
        overviewVideo: {
            src: `${import.meta.env.BASE_URL}projects/chompy/demo_vid.mov`,
            loop: true,
            speed: 1.5,
        },

        // --- What I did (clear individual ownership on a team project) ---
        contribution: [
            "Wrote the Arduino/servo code for the claw's open/close cycle.",
            'Tested the optional sonar sensor, found it unreliable, and swapped it for a timer-based approach that ran predictably.',
            'Built the 3D models and orthographic drawings.',
            'Fabricated the sheet-metal claw and ran jamming tests that caught an early design flaw.',
        ],

        // --- Design process (the narrative arc) ---
        process: [
            {
                phase: 'Concept exploration',
                body: 'Sketched several early concepts: a net-based expandable holder, an excavator-style scoop claw, and a fishing-net design.',
                // TODO(me): drop concept sketches at public/projects/chompy/process-concepts.jpg
                image: `${import.meta.env.BASE_URL}projects/chompy/process-concepts.jpg`,
                alt: 'Hand-drawn concept sketches of early retrieval-device ideas',
            },
            {
                phase: 'Physical prototyping',
                body: 'Built and compared three claw types (a four-arm claw, a three-prong claw, and a scoop claw) to test how each handled objects of different sizes.',
                images: [
                    `${import.meta.env.BASE_URL}projects/chompy/proto-1.png`,
                    `${import.meta.env.BASE_URL}projects/chompy/proto-2.png`,
                    `${import.meta.env.BASE_URL}projects/chompy/proto-3.png`,
                ],
                alt: 'Three sheet-metal claw prototypes side by side',
            },
            {
                phase: 'Targeted testing',
                body: 'Ran focused tests against our biggest technical risks: structural deformation, object jamming, and sonar reliability.',
                alt: 'Load and jamming testing of the claw',
            },
            {
                phase: 'Design decision',
                body: 'Ranked our three final designs (Chompy, Tetris, 4 Arms) on weighted criteria covering pickup versatility, capacity, strength, complexity, size, and material use. Chompy came out on top at 6.9, winning as the most versatile design.',
                images: [
                    { src: `${import.meta.env.BASE_URL}projects/chompy/design-1.png`, fit: 'contain', aspectRatio: '458/424', clipPath: 'inset(5% 0 0 0 round 10px)', maxWidth: '260px' },
                    { src: `${import.meta.env.BASE_URL}projects/chompy/design-2.png`, fit: 'cover', aspectRatio: '458/424', clipPath: 'inset(5% 0 0 0 round 10px)', maxWidth: '260px' },
                ],
                alt: 'Weighted scoring chart comparing the three final designs',
            },
            {
                phase: 'Final design',
                body: 'Chompy: two smooth circular scoops with a suspended platform above for the Arduino and electronics, documented with 3-view orthographic and isometric drawings.',
                images: [
                    { src: `${import.meta.env.BASE_URL}projects/chompy/final-1.png`, height: '220px' },
                    { src: `${import.meta.env.BASE_URL}projects/chompy/final-2.png`, height: '220px' },
                    { src: `${import.meta.env.BASE_URL}projects/chompy/final-3.png`, height: '220px' },
                ],
                alt: 'Orthographic and isometric assembly drawings of the final claw',
            },
        ],

        // --- Key engineering decisions (challenge -> test -> outcome) ---
        engineering: [
            {
                challenge: 'Deformation under load',
                test: 'Suspended the heaviest competition object from a bent metal sample for 20 seconds.',
                outcome: 'Bent only 0.5-1 mm, no significant deformation.',
                image: `${import.meta.env.BASE_URL}projects/chompy/test-1.png`,
                imageCropTop: '39%',
            },
            {
                challenge: 'Objects jamming in the claw',
                test: 'Our first two-prong claw wedged objects in the bent creases, causing inconsistent releases.',
                outcome: 'Redesigned to a smooth, bend-free scoop that releases cleanly.',
                image: `${import.meta.env.BASE_URL}projects/chompy/test-2.png`,
            },
            {
                challenge: 'Sonar reliability',
                test: 'Ran distance and code tests on the sonar sensor.',
                outcome: 'It detected non-target objects and needed an unobstructed signal, so I replaced it with simpler, more reliable timer-based control.',
                image: `${import.meta.env.BASE_URL}projects/chompy/test-3.png`,
            },
        ],

        // --- Results ---
        results: {
            metrics: [
                { value: '10/15', label: 'items retrieved in Round 1' },
                { value: '58', label: 'blocks scooped in Round 2 (target: 25)' },
                { value: '<1 mm', label: 'deformation under the heaviest load' },
            ],
            narrative:
                "Round 1 went as designed: the claw retrieved 10 of 15 items, though a pulley malfunction and the time limit cost us cycles (an unanticipated operational risk). In Round 2 we slowed the crane so the pulley stayed seated, and the claw scooped 58 blocks, more than double our target. In the final team round, Chompy collaborated well with other teams and contributed more than we'd expected.",
        },

        // --- Reflection ---
        reflection:
            "If I did it again, I'd cut the operating cycle from 20 s to under 15 s to leave room for mis-grabs, and practice more with the crane to keep the pulley seated. The biggest lesson was how much a simple, reliable design beats a clever but fragile one: dropping the sonar for a timer is what made our results consistent.",

        // --- Media gallery (photos + videos) ---
        // TODO(me): drop files into public/projects/chompy/ and update paths/captions below.
        gallery: [
            { type: 'video', src: `${import.meta.env.BASE_URL}projects/chompy/clip-1.mov`, loop: true, speed: 2 },
            { type: 'video', src: `${import.meta.env.BASE_URL}projects/chompy/clip-2.mov`, loop: true, speed: 2 },
            { type: 'video', src: `${import.meta.env.BASE_URL}projects/chompy/clip-3.mov`, loop: true, speed: 2 },
            // Videos: host on YouTube (unlisted is fine) and use type: "youtube", or
            // drop a short compressed clip at public/projects/chompy/demo.mp4 and use type: "video".
            // { type: 'video', src: `${import.meta.env.BASE_URL}projects/chompy/demo.mp4`, caption: 'Chompy in action' },
            // { type: 'youtube', id: 'TODO_VIDEO_ID', caption: 'Chompy in action' },
        ],

        // Plain-text fallback description, kept for parity with the simpler project entries.
        description:
            'Chompy is a sheet-metal scooping claw built for an APSC 101 design competition to retrieve underwater debris of varying sizes. On a 6-person team I owned the Arduino control code and the 3D modeling, replaced an unreliable sonar sensor with a timer-based control scheme, and ran fabrication and jamming tests. The final design scooped 58 blocks in the second competition round, more than double our target.',
    },
    'rainwater-harvester': {
        // --- card / routing basics ---
        title: 'Rainwater Harvester: System Simulation & Design',
        tagline: 'A 5-year spreadsheet model to design an off-grid drinking-water system',
        category: 'school',
        tools: [
            'Excel',
            'Spreadsheet simulation',
            'Fluid mechanics',
            'Energy systems modeling',
            'Data analysis',
        ],

        // Card thumbnail (home grid) + big image at the top of the detail page.
        image: `${import.meta.env.BASE_URL}projects/rwh/card.png`,
        hero: {
            image: `${import.meta.env.BASE_URL}projects/rwh/card.png`,
            alt: 'Diagram of a rainwater harvesting system: catchment, pump, treatment, storage, and supply to a house',
        },

        // --- quick facts strip ---
        meta: {
            context: 'APSC 101 · Module 7 · Cornerstone design project',
            team: '6-person team (Group M6)',
            myFocus: 'System simulation: topography, fluids, weather & power modeling',
            timeframe: 'First year',
        },

        // --- Problem ---
        overview:
            "Module 7 was the first-year cornerstone project: design a rainwater harvesting (RWH) system to supply safe drinking water to an off-grid, two-person household in Van Anda, a remote community on Texada Island, BC. Because the home has no grid power, the system also had to generate its own electricity. Rather than build hardware, each team built a spreadsheet simulation of five years of operation, and every design was scored by the course's independent simulator across eight weighted stakeholder priorities: consumption, cost, health and environmental risk, greenhouse-gas emissions, maintenance, non-potable supply, on-demand flow rate, and reliability.",

        // --- What I did (clear individual ownership on a team project) ---
        contribution: [
            "Built the topography model: computed pipe length as a 3-D distance and elevation head from the site's contour map, and made grid-based maps for placing the storage tank and additional catchment within the site's keep-out constraints.",
            'Modeled five years of weather by assembling multi-station historical rainfall into a daily series, including drier years to stress-test the design against climate variability.',
            'Built the 5-year catchment simulation: a daily water balance of collection vs. household demand that tracked reliability, how many days the system met full demand, and whether it cleared the 200-day requirement.',
            'Modeled the on-demand flow to the house, solving iteratively for flow rate given pipe friction, fitting losses, elevation, and filter resistance, capped by the UV unit\'s maximum treatable flow.',
            'Modeled pump-to-storage by matching the pump\'s pressure and efficiency curves to the system head, finding the daily operating point and the energy needed to refill the tank.',
            'Built the diesel power model: pumping energy plus the 24/7 UV load, converted to diesel use through generator and battery efficiencies, which became the baseline the team compared against solar.',
            'Debugged, corrected, and error-checked across nearly all sheets of the shared 17-sheet workbook.',
        ],

        // --- Design process (the analysis arc) ---
        process: [
            {
                phase: 'Stakeholder priorities → weights',
                body: 'Turned Van Anda stakeholder needs (reliable water, low long-term cost, low maintenance) into the eight weighted satisfaction criteria the design would be judged on.',
                // TODO(me): drop the satisfaction-weights pie chart at public/projects/rwh/process-weights.png
                image: `${import.meta.env.BASE_URL}projects/rwh/process-weights.png`,
                alt: 'Pie chart of the eight weighted satisfaction criteria',
            },
            {
                phase: 'Subsystem modeling',
                body: 'Built the workbook as linked subsystems (weather, catchment, storage, fluids and pump, treatment, and power) so each could be tested in the context of the whole system over five years.',
                // TODO(me): drop the RWH system flow diagram at public/projects/rwh/process-system.png
                image: `${import.meta.env.BASE_URL}projects/rwh/process-system.png`,
                alt: 'Flow diagram of the rainwater harvesting subsystems',
            },
            {
                phase: 'Configuration comparison',
                body: 'Ran each major decision (solar vs. diesel, ozone vs. chlorine, filter choice and placement, catchment area, tank sizes, consumption target, and non-potable inclusion) as a head-to-head satisfaction comparison.',
                // TODO(me): drop one of the stacked-bar comparison charts (e.g. energy or water treatment) at public/projects/rwh/process-comparison.png
                image: `${import.meta.env.BASE_URL}projects/rwh/process-comparison.png`,
                alt: 'Stacked-bar charts comparing configuration options by total satisfaction',
            },
            {
                phase: 'Final design & verification',
                body: 'Locked in the highest-scoring configuration and verified it against the full 5-year simulation and required checks, including reliability and on-demand flow.',
                // TODO(me): drop the topography placement map (storage + extra catchment) at public/projects/rwh/process-placement.png
                image: `${import.meta.env.BASE_URL}projects/rwh/process-placement.png`,
                alt: 'Topography map showing chosen storage tank and additional catchment locations',
            },
        ],

        // --- Key engineering decisions (challenge -> analysis -> outcome) ---
        engineering: [
            {
                challenge: 'Solar vs. diesel power',
                test: 'Compared a full diesel-generator energy model against a solar-panel system on total satisfaction.',
                outcome: 'Solar scored higher (≈0.88 vs ≈0.73) on cost, emissions, health, and maintenance, so the team chose 12 solar panels with 5 batteries.',
            },
            {
                challenge: 'Where to place storage & catchment',
                test: 'Used the contour map to trade off elevation (which improves on-demand flow) against pipe length and pumping energy.',
                outcome: 'Placed the storage tank at a close, elevated point and added 325 m² of catchment, balancing flow, pressure losses, and piping cost.',
            },
            {
                challenge: 'Catchment tank size',
                test: 'Compared collection-tank volumes on overall satisfaction.',
                outcome: 'A 2,500 L tank scored best; larger tanks added cost and maintenance without enough capture gain.',
            },
            {
                challenge: 'Ozone vs. chlorine disinfection',
                test: 'Compared both chemical-treatment methods on health/environmental risk and cost.',
                outcome: "Ozone scored higher and avoided chlorine's handling risk and the broken, costly existing chlorine setup.",
            },
        ],

        // --- Final design summary (optional spec list) ---
        finalDesign: [
            { label: 'Catchment', value: 'Full roof + 325 m² additional (425 m² total)' },
            { label: 'Catchment tank', value: '2,500 L' },
            { label: 'Storage tank', value: '30,000 L (30 m³)' },
            { label: 'Pump', value: 'Pump A' },
            { label: 'Treatment', value: 'Ozone + 40 W UV; 5 & 200 μm filters (plus required 1 μm)' },
            { label: 'Power', value: 'Solar: 12× HES-305P panels + 5 batteries + DC-AC inverter' },
            { label: 'Design target', value: '620 L/day consumption; 29 LPM on-demand flow' },
        ],

        // --- Results ---
        results: {
            metrics: [
                { value: '2nd / 10', label: 'in our studio section' },
                { value: '63.66%', label: "satisfaction on the coordinators' withheld-weather simulation" },
                { value: '0.882', label: 'overall satisfaction on our own 5-year model' },
            ],
            narrative:
                "On our own 5-year model the final design scored 0.882 overall satisfaction at a projected cost of about $62,000, roughly 58% of the cost of shipping water in. When the course coordinators ran every team's design through their independent simulator on withheld future weather, ours scored 63.66% and placed 2nd of 10 in our studio section. The gap between those two numbers is the lesson: a design tuned to historical weather has to hold up against conditions you can't see in advance.",
        },

        // --- Reflection ---
        reflection:
            "The biggest takeaway was how much unseen, drier-than-historical weather can pull down a design that looks strong on paper. On-demand flow rate was our weakest score, and reliability under drought is where the design was most exposed, so next time I'd size in more margin there rather than optimizing tightly to the historical data we had.",

        // --- Media gallery (images only, no video) ---
        // TODO(me): drop files into public/projects/rwh/ and update paths/captions below.
        gallery: [
            { type: 'image', src: `${import.meta.env.BASE_URL}projects/rwh/satisfaction-radar.png`, caption: 'Per-criterion satisfaction (design model)', alt: 'Radar chart of satisfaction across the eight criteria' },
            { type: 'image', src: `${import.meta.env.BASE_URL}projects/rwh/cost-breakdown.png`, caption: '5-year cost breakdown (~$62k)', alt: 'Donut chart of 5-year system costs by category' },
            { type: 'image', src: `${import.meta.env.BASE_URL}projects/rwh/final-recommendation.png`, caption: 'Final system specification', alt: 'Table summarizing the final recommended RWH configuration' },
        ],

        // Plain-text fallback for any older rendering path.
        description:
            "A first-year cornerstone project to design an off-grid rainwater harvesting system for a remote BC household, evaluated through a team-built 5-year spreadsheet simulation scored on eight weighted criteria. I owned much of the quantitative core: the topography/elevation and component-placement model, the 5-year weather and catchment simulations, the on-demand flow and pump-to-storage fluid models, and the diesel power model. The final design placed 2nd of 10 in our studio section at 63.66% satisfaction on the coordinators' withheld-weather simulation.",
    },
};
