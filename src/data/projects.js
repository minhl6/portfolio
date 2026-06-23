export const projects = {
    'robotic-arm-design': {
        title: 'Leader-Follower Robotic Arm',
        category: 'personal',
        tagline: 'A 4-DOF arm that mirrors a hand-held replica in real time, with record and playback',
        tools: ['SolidWorks', 'KiCad', 'Arduino', 'JLCPCB', '3D Printing'],

        // Card thumbnail + big image at the top of the detail page.
        // TODO: replace both with the BASE_URL-prefixed path to media/robotic-arm/hero.jpg (a photo of both arms).
        image: 'https://picsum.photos/seed/robotic-arm/1200/800',
        hero: 'https://picsum.photos/seed/robotic-arm/1200/800',

        summary: 'A 4 degree-of-freedom robotic arm that mirrors a hand-held twin in real time and can record and replay a sequence on its own. I designed and built every part of it: both 3D-printed arms, a custom Arduino shield PCB, and the firmware that ties them together.',

        sections: [
            {
                heading: 'Demo',
                text: 'The arm runs in three modes: live manual control, recording, and autonomous playback. The video below shows all three.',
                video: '', // TODO: unlisted YouTube link, OR the BASE_URL-prefixed path to media/robotic-arm/demo.mp4
            },
            {
                heading: 'Leader and follower control',
                text: "The robot is driven by a passive twin, a hand-held arm with identical joint geometry. A potentiometer at each joint senses its angle, and the firmware writes that value straight to the matching servo, so control is just copying joint angles one to one with no inverse kinematics needed. It can also record a sequence and play it back on its own, like teaching an industrial robot by walking it through a path.",
                image: '', // TODO: the BASE_URL-prefixed path to media/robotic-arm/leader-arm.jpg (optional)
            },
            {
                heading: 'Mechanical design',
                text: 'Both arms are 3D printed in PLA and modeled in SolidWorks. The active arm is about 20 cm tall. I also designed a base enclosure around the electronics so the wiring stays hidden and the build looks like a finished product instead of a prototype.',
                image: '', // TODO: the BASE_URL-prefixed path to media/robotic-arm/exploded-view.png (SolidWorks exploded view)
            },
            {
                heading: 'Custom PCB',
                text: 'To get off the breadboard, I designed a custom Arduino shield in KiCad, my first board. It connects all four servos and potentiometers, adds status LEDs and mode buttons, and uses a ground pour to keep the analog signals clean. I sized the 5 V power trace using the IPC-2221 standard and had the board manufactured by JLCPCB.',
                images: ['', ''], // TODO: kicad-schematic.png, kicad-pcb.png
            },
            {
                heading: 'Firmware',
                text: 'The firmware runs in three modes: manual, record, and playback. Getting the movement to look clean was the hardest challenge. I had to smooth out the noisy sensor data, reject readings that jumped too fast to be physically possible, and ease jerky motion by blending between recorded points.',
                // TODO: paste ~15–25 lines of your REAL firmware here (keep it short).
                // Best pick: your readSmoothedPot() function, it shows the smoothing and
                // spike-rejection logic, which is the most interesting self-contained piece.
                code: '// paste your real Arduino code snippet here',
                language: 'cpp',
            },
            {
                heading: 'Problems I solved',
                text: "Most of what I ran into turned out to be hardware problems, not bugs in the code. Turning on all four servos at once caused a brief power dip, so I staggered their startup instead. Loose jumper wires made the potentiometer readings jump around and the arm twitch; moving everything onto a soldered custom PCB fixed it, with solid connections and a ground pour to cut electrical noise. The biggest fix was swapping every SG90 for a metal-gear MG90D. The SG90s had loose, sloppy gears, so under load the arm would twitch because the servo couldn't actually hold the angle it thought it was at.",
                image: '', // TODO: optional build/wiring photo
            },
            {
                heading: "What I'd Do Next",
                text: "A few things would make good next steps. Adding a fuse would protect the electronics by cutting the power instantly if a wire ever shorted. Gravity compensation, like a counterweight or spring to help hold the arm up, would stop the motors from working so hard just to keep it steady. Running a repeatability test to measure how consistently the arm returns to the same spot would give real data on how accurate it is. The most ambitious would be force feedback, so instead of control only going one way, the arm could sense when it touches something and push back on your hand, letting you feel what it's doing. That two way control is the same idea used in surgical and industrial robots.",
            },
        ],
    },
    'laser-cut-enclosure': {
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
    'fea-bracket-analysis': {
        title: 'FEA Bracket Analysis',
        category: 'school',
        tagline: 'Structural optimization of a mounting bracket',
        image: 'https://picsum.photos/seed/fea-bracket-analysis/1200/800',
        tools: ['SolidWorks Simulation', 'ANSYS', 'Topology Optimization'],
        summary: 'A finite element study used to reduce mass in a structural bracket while keeping it within stress and deflection limits.',
        description: [
            'Outline the loading conditions, boundary conditions, and material assumptions used in the analysis.',
            'Show the iteration from initial design to optimized geometry, referencing stress plots or factor-of-safety results.',
            'Summarize the final mass reduction achieved and how the result was validated.',
        ],
    },
    'go-kart-suspension': {
        title: 'Go-Kart Suspension',
        category: 'school',
        tagline: 'Double wishbone suspension for a student go-kart team',
        image: 'https://picsum.photos/seed/go-kart-suspension/1200/800',
        tools: ['SolidWorks', 'Suspension Kinematics', 'Manufacturing'],
        summary: 'A double wishbone suspension system designed and manufactured as part of a student design team.',
        description: [
            'Explain the design targets: ride height, camber/caster behavior, track conditions, and packaging constraints.',
            'Walk through the kinematic analysis and how it informed control arm geometry.',
            'Cover manufacturing and testing, including any on-track tuning or changes made after build.',
        ],
    },
};
