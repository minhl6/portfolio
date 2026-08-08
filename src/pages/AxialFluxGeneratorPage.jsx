import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects.js';
import { useFadeIn } from '../hooks/useFadeIn.js';
import './AxialFluxGeneratorPage.css';

// Prototype-only page for the two-speed-hand-crank-generator project. Doesn't reuse
// ProjectDetail.jsx because this layout (shared-element expand transition) doesn't
// fit the generic project schema. Safe to delete along with the CSS file and its
// route in App.jsx without touching any other page.

// must match the CSS transition durations below (.afg-overview, .afg-expanded,
// and the inline FLIP transition applied to the clone image) — kept as one
// constant so the JS phase timing and the CSS animations can never drift apart
const TRANSITION_MS = 450;

// positions are % of the media box, 0-100 from top-left. `anchors` is a list
// (not a single point) so a label can fan out multiple leader lines to
// several spots on the part — Double 12 Magnet Rotors and Frame each point
// at two locations from one text box. `label` is where the text sits.
const GENERATOR_EXPLODED_LABELS = [
    { id: 'stator', text: '9 Coil Stator', label: [38.4, 14.1], anchors: [[47.7, 40.5]] },
    { id: 'rotors', text: 'Double 12 Magnet Rotors', label: [86.4, 22.6], anchors: [[67.7, 33.8]] },
    { id: 'pulley', text: '20T Pulley', label: [17.4, 42.4], anchors: [[29.0, 61.1]] },
    { id: 'frame', text: 'Frame', label: [89, 50], anchors: [[75.8, 42.4], [74.6, 57.4]] },
    { id: 'shaft', text: '8mm Steel Shaft', label: [62.9, 77.8], anchors: [[49.3, 45.6]] },
];

// same [x%, y%] label/anchors scheme as GENERATOR_EXPLODED_LABELS above, but
// for the always-visible "How it Works?" real-photo overlay (no video-state
// gating — this one isn't tied to the exploded-view sequence).
const REAL_PHOTO_LABELS = [
    { id: 'generator', text: 'Generator', label: [77.8, 22.7], anchors: [[66.9, 43.1]] },
    { id: 'electronics', text: 'Measurement Electronics & Rectifier Circuit', label: [66.2, 87.4], anchors: [[80.4, 64.7]] },
    { id: 'gearbox', text: 'Gearbox', label: [46.3, 19.2], anchors: [[35.0, 44.9]] },
];

const SOLIDWORKS_VIEWS = [
    { image: `${import.meta.env.BASE_URL}projects/axial-flux-generator/solidworks-isometric.png`, caption: 'Isometric View' },
    { image: `${import.meta.env.BASE_URL}projects/axial-flux-generator/solidworks-top.png`, caption: 'Top View' },
    { image: `${import.meta.env.BASE_URL}projects/axial-flux-generator/solidworks-side.png`, caption: 'Side View' },
    { image: `${import.meta.env.BASE_URL}projects/axial-flux-generator/solidworks-back.png`, caption: 'Back View' },
];

const EARLY_PROTOTYPE_PHOTOS = [
    { image: `${import.meta.env.BASE_URL}projects/axial-flux-generator/opensource-gearbox.jpeg`, caption: 'Open-source mini two-speed gearbox' },
    { image: `${import.meta.env.BASE_URL}projects/axial-flux-generator/v1-gearbox.jpeg`, caption: 'Fixed single-ratio gearbox' },
    { image: `${import.meta.env.BASE_URL}projects/axial-flux-generator/gearbox-comparison.jpeg`, caption: 'Side-by-side comparison to final gearbox' },
    { image: `${import.meta.env.BASE_URL}projects/axial-flux-generator/fixed-gearbox-27x-iso.png`, caption: 'Fixed gearbox CAD model' },
];

const GEARBOX_PROBLEMS_SOLVED = [
    {
        challenge: 'Set Screw Slipping',
        description: 'The gears kept slipping on the smooth steel shaft under load. I machined a flat where each set screw lands, giving it a solid surface to bite into instead of relying on friction alone.',
        image: `${import.meta.env.BASE_URL}projects/axial-flux-generator/filed-flat.jpeg`,
    },
    {
        challenge: 'Bulged Gear Teeth',
        description: 'Printed with too little infill, the top of each tooth bulged out and made the gears bind. More infill gave the top layers a solid base to print on and the teeth came out clean.',
        image: `${import.meta.env.BASE_URL}projects/axial-flux-generator/bulge-teeth.jpeg`,
    },
    {
        challenge: 'Dialing In Tolerances',
        description: 'Printed holes come out undersized, so I made test blocks to find the right fit for bearings, shafts, screws, and magnet pockets, plus a gauge to lock in the gear spacing before committing to real parts.',
        image: `${import.meta.env.BASE_URL}projects/axial-flux-generator/test-blocks.jpeg`,
    },
];

// copied from ProjectCarousel in ProjectDetail.jsx (same drag/momentum/
// infinite-loop behavior as the robotic arm's Custom PCB carousel) — kept
// local to this file since this page doesn't go through ProjectDetail's
// rendering pipeline.
function SolidworksCarousel({ items, heading }) {
    const trackRef = useRef(null);
    const drag = useRef({ active: false, lastX: 0, lastTime: 0, velocity: 0, rafId: null });
    const tripledItems = [...items, ...items, ...items];

    useEffect(() => {
        const track = trackRef.current;
        track.scrollLeft = track.scrollWidth / 3;

        const onScroll = () => {
            const band = track.scrollWidth / 3;
            if (track.scrollLeft >= band * 2) {
                track.scrollLeft -= band;
            } else if (track.scrollLeft < band) {
                track.scrollLeft += band;
            }
        };
        track.addEventListener('scroll', onScroll);
        return () => track.removeEventListener('scroll', onScroll);
    }, [items]);

    const stopMomentum = () => {
        if (drag.current.rafId) {
            cancelAnimationFrame(drag.current.rafId);
            drag.current.rafId = null;
        }
    };

    const runMomentum = () => {
        const track = trackRef.current;
        drag.current.velocity *= 0.94;
        if (!track || Math.abs(drag.current.velocity) < 0.1) {
            drag.current.rafId = null;
            return;
        }
        track.scrollLeft -= drag.current.velocity;
        drag.current.rafId = requestAnimationFrame(runMomentum);
    };

    const onPointerDown = (e) => {
        if (e.pointerType !== 'mouse') return;
        e.preventDefault();
        stopMomentum();
        const track = trackRef.current;
        track.classList.add('is-dragging');
        drag.current = { active: true, lastX: e.clientX, lastTime: performance.now(), velocity: 0, rafId: null };
        track.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        if (!drag.current.active) return;
        const track = trackRef.current;
        const now = performance.now();
        const dx = e.clientX - drag.current.lastX;
        const dt = Math.max(now - drag.current.lastTime, 1);
        track.scrollLeft -= dx;
        drag.current.velocity = drag.current.velocity * 0.7 + (dx / dt) * 16 * 0.3;
        drag.current.lastX = e.clientX;
        drag.current.lastTime = now;
    };

    const endDrag = (e) => {
        if (!drag.current.active) return;
        drag.current.active = false;
        const track = trackRef.current;
        track.classList.remove('is-dragging');
        track.releasePointerCapture(e.pointerId);
        if (Math.abs(drag.current.velocity) > 0.5) {
            drag.current.rafId = requestAnimationFrame(runMomentum);
        }
    };

    return (
        <div
            className="project-carousel"
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
        >
            {tripledItems.map(({ image, caption }, i) => (
                <figure className="project-carousel-item" key={`${image}-${i}`}>
                    <img src={image} alt={caption || heading} loading="lazy" draggable={false} />
                    {caption && <figcaption>{caption}</figcaption>}
                </figure>
            ))}
        </div>
    );
}

const CARDS = [
    {
        id: 'gearbox',
        title: 'Gearbox & Transmission',
        blurb: 'How I designed the transmission, and the early gearbox prototypes and failures that got me to the final design.',
        image: `${import.meta.env.BASE_URL}projects/axial-flux-generator/gearbox-card.png`,
        video: `${import.meta.env.BASE_URL}projects/axial-flux-generator/gearbox-assembly.mp4`,
        loopVideo: true,
        mediaZoom: true,
        caption: 'The two-speed transmission is the heart of the project. It turns gear selection into voltage selection, doing mechanically what an electronic regulator normally does.',
        panel: {
            text: 'The dog clutch is what lets the gearbox change ratio while the crank is still turning. Both gears spin freely on the output shaft until a sliding collar locks one of them, driving the shaft through a splined sleeve. What makes it hold is the 4° back taper on the dog teeth: each tooth is slightly wider at the tip than at the root, so the harder you crank, the more the torque pulls the collar inward and keeps it engaged.',
            images: [
                `${import.meta.env.BASE_URL}projects/axial-flux-generator/transmission-labelled-diagram.png`,
                `${import.meta.env.BASE_URL}projects/axial-flux-generator/collar-section-view.png`,
            ],
            extraSections: [
                {
                    id: 'collar-detail-photos',
                    images: [
                        `${import.meta.env.BASE_URL}projects/axial-flux-generator/through-hole-screw.jpeg`,
                        `${import.meta.env.BASE_URL}projects/axial-flux-generator/closeup-collar.jpeg`,
                    ],
                },
                {
                    id: 'early-prototypes',
                    heading: 'The Build Process',
                    subtitle: "None of this worked the first time. The gearbox started as a fixed single-ratio box before becoming two-speed, and dialing in print tolerances and part fit took plenty of reprints along the way. These are some of the versions and failures that got it there, and what each one taught me.",
                    subheading: 'Early Gearbox Prototypes',
                    subheadingText: 'I started by printing an open-source two-speed gearbox to understand how a dog clutch shifts in practice. Then I built my own fixed 27× box, belt-coupled to the generator, which proved the drivetrain and generator worked. It later became my efficiency baseline, running about 7 percent more efficient than the final two-speed box under identical conditions, since the extra gear meshes were the price of adding gear selection.',
                    carousel: EARLY_PROTOTYPE_PHOTOS,
                },
                {
                    id: 'custom-gears',
                    heading: 'Custom Gears',
                    subtitle: 'The following engineering drawing was a common combo gear I made for both my early fixed gearbox and my final design.',
                    images: [
                        `${import.meta.env.BASE_URL}projects/axial-flux-generator/60-teeth-gear-drawing.png`,
                    ],
                },
                {
                    id: 'problems-solved',
                    heading: 'Problems I Solved',
                    engineering: GEARBOX_PROBLEMS_SOLVED,
                },
            ],
        },
    },
    {
        id: 'generator',
        title: 'Axial Flux Generator',
        blurb: 'Hand-wound stator and magnet rotor design, with the voltage and sag data measured from it.',
        // first frame of exploded.mp4 (extracted, not a separate screenshot) so the
        // card thumbnail, the settled pre-video image, and the video's own opening
        // frame are pixel-identical — the swap to <video> on open has nothing to hide
        image: `${import.meta.env.BASE_URL}projects/axial-flux-generator/exploded-first-frame.png`,
        video: `${import.meta.env.BASE_URL}projects/axial-flux-generator/exploded.mp4`,
        // the model isn't centered in the source frame (it sits right of the
        // frame's true center) — shifting the object-fit:cover crop's focal
        // point right of the default 50% balances the left/right margins
        // instead of cropping straight down the frame's own midline
        mediaPosition: '64% center',
        explodedLabels: GENERATOR_EXPLODED_LABELS,
        caption: 'A 3D printed, hand-wound generator that turns rotation into three-phase electricity. As the magnet rotor spins past the stator coils, it induces an AC current, later rectified into the DC power that drives the load.',
        panel: {
            text: 'The stator carries 9 coils wound with 160 turns of 24-gauge wire in a three-phase star configuration, sitting 2mm from a double 12-magnet rotor. That gap was chosen as tight as it could safely go: close enough to keep magnetic flux strong, since flux falls off sharply with distance, but with enough clearance that the spinning magnets never touch the coils.',
            images: [
                `${import.meta.env.BASE_URL}projects/axial-flux-generator/rotor-and-stator.jpeg`,
                `${import.meta.env.BASE_URL}projects/axial-flux-generator/air-gap.jpeg`,
            ],
            extraSections: [
                {
                    id: 'building-the-stator',
                    heading: 'Building the Stator',
                    subtitle: 'Each coil was hand-wound using a 3D-printed jig, then assembled into the stator. Measuring across any two of the three AC leads read about 6.8Ω. Since the star winding puts two coil groups in series between any pair of leads, that works out to roughly 3.4Ω per single phase, a number used later to check voltage sag under load.',
                    images: [
                        `${import.meta.env.BASE_URL}projects/axial-flux-generator/build-2.jpeg`,
                        `${import.meta.env.BASE_URL}projects/axial-flux-generator/build-1.jpeg`,
                    ],
                },
                {
                    id: 'spin-test',
                    heading: 'The Spin Test',
                    subtitle: "The spin test set the target for the whole drivetrain. By measuring voltage per RPM, both unloaded and under a small DC motor load, I could calculate how fast the generator had to spin to reach my voltage goal, and from there what gear ratio would get there from a comfortable 75 RPM hand crank. That's what fixed the high gear at 27×.",
                    images: [
                        `${import.meta.env.BASE_URL}projects/axial-flux-generator/spin-test-graph.png`,
                    ],
                },
                {
                    id: 'voltage-sag',
                    heading: 'Voltage Sag Under Load',
                    subtitle: "The generator's voltage drops as it delivers more current. To measure it, I held a steady crank speed and swapped in different resistor loads, logging voltage and current at each. The points fall on a straight line whose slope lands close to the coil resistance I measured with a multimeter. This confirms the voltage sag comes mainly from coil resistance, a normal generator trait.",
                    images: [
                        `${import.meta.env.BASE_URL}projects/axial-flux-generator/voltage-sag.png`,
                    ],
                },
                {
                    id: 'improvements-limitations',
                    heading: 'Improvements & Limitations',
                    bullets: [
                        {
                            label: 'Wire gauge',
                            text: 'I went with thinner 24 AWG wire to fit more turns per coil and boost open-circuit voltage, accepting more sag under load as the tradeoff. Thicker wire would\'ve meant less sag but a lower starting voltage.',
                        },
                        {
                            label: 'Diodes',
                            text: 'I used standard silicon diodes, which cost about 1.4V, a hit at low voltages. Switching to Schottky diodes (~0.6V) is a cheap upgrade I\'d make next time.',
                        },
                    ],
                },
            ],
        },
    },
    {
        id: 'measurement',
        title: 'Measurement & Electronics',
        blurb: 'Voltage/current sensing and the electronics used to characterize output at each speed.',
        image: 'https://picsum.photos/seed/afg-measurement-card/600/400',
        panel: {
            text: 'Placeholder copy describing the measurement setup: sensing circuit, data logging, and how output was tested across crank speeds. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.',
            images: [
                'https://picsum.photos/seed/afg-measurement-1/500/360',
                'https://picsum.photos/seed/afg-measurement-2/500/360',
                'https://picsum.photos/seed/afg-measurement-3/500/360',
            ],
        },
    },
];

const CARD_IDS = CARDS.map((c) => c.id);
const CARD_BY_ID = Object.fromEntries(CARDS.map((c) => [c.id, c]));

// Reads the hash directly off window.location rather than react-router's
// useLocation() so opening/closing a panel doesn't touch react-router's
// history state at all — that state is what ScrollToTop.jsx watches to
// scroll the page. We still get a real, shareable URL hash via
// history.pushState, just outside router's view.
function initialOpenCard() {
    const hash = window.location.hash.replace('#', '');
    return CARD_IDS.includes(hash) ? hash : null;
}

function rectToPlain(rect) {
    return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
}

export default function AxialFluxGeneratorPage() {
    const project = projects['two-speed-hand-crank-generator'];

    // animPhase drives every transition in this page:
    //   'idle'     - overview showing, nothing expanded
    //   'opening'  - a card's image is flying from its card rect to the panel
    //   'open'     - settled, expanded panel fully showing
    //   'closing'  - the image is flying back from the panel to its card rect
    const [openCard, setOpenCard] = useState(initialOpenCard);
    const [animPhase, setAnimPhase] = useState(() => (initialOpenCard() ? 'open' : 'idle'));

    // exploded-view sequence for the Generator card only:
    //   'pending' - not started (also the state while any other card is open)
    //   'playing' - hero has swapped from the static image to the video, autoplaying
    //   'ended'   - video finished and is holding on its last frame; labels fade in
    const [videoState, setVideoState] = useState('pending');

    const cardImgRefsMap = useRef(new Map());
    const cardTriggerRefsMap = useRef(new Map());
    const flipImgRef = useRef(null);
    const panelRef = useRef(null);
    const closeButtonRef = useRef(null);
    const pendingRectRef = useRef(null); // { start, end|null } for the FLIP currently in flight
    const rafRef = useRef([]);
    const timeoutRef = useRef(null);

    useFadeIn();

    useEffect(() => {
        document.title = `${project.title} — Minh Le`;
    }, [project.title]);

    const clearPendingAnimation = () => {
        rafRef.current.forEach((id) => cancelAnimationFrame(id));
        rafRef.current = [];
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    // Runs the actual shared-element (FLIP) animation whenever we enter the
    // 'opening' or 'closing' phase: snap the clone image to its start rect
    // instantly, force a reflow, then transition it to the end rect. For
    // 'opening' the end rect isn't known ahead of time — the panel's own
    // padding/max-width determine it — so instead of hand-computing that
    // math, we briefly let the browser lay the image out naturally (its
    // settled CSS) and measure the real result, which is more robust than
    // recomputing container/padding math by hand.
    useLayoutEffect(() => {
        if (animPhase !== 'opening' && animPhase !== 'closing') return undefined;

        const img = flipImgRef.current;
        const rects = pendingRectRef.current;
        if (!img || !rects) return undefined;

        let endRect = rects.end;
        if (!endRect) {
            img.style.cssText = '';
            endRect = rectToPlain(img.getBoundingClientRect());
        }

        img.style.transition = 'none';
        img.style.position = 'fixed';
        img.style.margin = '0';
        img.style.zIndex = '41';
        img.style.top = `${rects.start.top}px`;
        img.style.left = `${rects.start.left}px`;
        img.style.width = `${rects.start.width}px`;
        img.style.height = `${rects.start.height}px`;

        // force a synchronous layout flush so the browser commits the start
        // position before we switch on the transition below
        void img.getBoundingClientRect();

        const isOpening = animPhase === 'opening';
        const raf1 = requestAnimationFrame(() => {
            const raf2 = requestAnimationFrame(() => {
                img.style.transition = `top ${TRANSITION_MS}ms ease, left ${TRANSITION_MS}ms ease, width ${TRANSITION_MS}ms ease, height ${TRANSITION_MS}ms ease`;
                img.style.top = `${endRect.top}px`;
                img.style.left = `${endRect.left}px`;
                img.style.width = `${endRect.width}px`;
                img.style.height = `${endRect.height}px`;
                // toggle the panel's own fade in the SAME frame the image starts
                // moving, so they're locked together. This has to be deferred
                // via rAF (not applied on the same render that mounts the
                // panel) — a class present on an element's very first paint
                // never animates, since there's no "before" state for the
                // browser to transition from.
                panelRef.current?.classList.toggle('is-active', isOpening);
            });
            rafRef.current.push(raf2);
        });
        rafRef.current.push(raf1);

        timeoutRef.current = setTimeout(() => {
            if (animPhase === 'opening') {
                // settle: hand layout back to plain CSS (position:static,
                // width:100%, aspect-ratio) with no lingering inline overrides
                img.style.cssText = '';
                setAnimPhase('open');
                closeButtonRef.current?.focus();
            } else {
                const closedId = openCard;
                setOpenCard(null);
                setAnimPhase('idle');
                cardTriggerRefsMap.current.get(closedId)?.focus();
            }
        }, TRANSITION_MS + 30);

        return clearPendingAnimation;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animPhase]);

    // Handles the hash-loaded case: the page can mount directly into the
    // 'open' phase (skipping 'opening' entirely), so the rAF-driven toggle
    // above never runs for it. Show the panel immediately, no animation.
    useLayoutEffect(() => {
        if (animPhase === 'open') {
            panelRef.current?.classList.add('is-active');
        }
    }, [animPhase]);

    // Escape closes the expanded panel
    useEffect(() => {
        if (animPhase !== 'open') return undefined;
        const onKeyDown = (e) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animPhase]);

    // For any card with a video: the instant the expand animation settles,
    // swap from the static image to the video (same spot, same size — see
    // showVideo below) and let it autoplay. Guarded on videoState === 'pending'
    // so this only fires once per open, not on every re-render while open.
    useEffect(() => {
        if (animPhase === 'open' && CARD_BY_ID[openCard]?.video && videoState === 'pending') {
            setVideoState('playing');
        }
    }, [animPhase, openCard, videoState]);

    const handleVideoEnded = () => {
        setVideoState('ended');
    };

    // ==== TEMP DEV HELPER — delete this whole block + its onClick prop on
    // .afg-expanded-media below (search "TEMP DEV HELPER") once done ====
    // Click anywhere on the paused exploded-view frame to log where you
    // clicked as a % of the media box's own width/height (not raw pixels,
    // so it stays correct however the box ends up sized) — for finding real
    // values to plug into GENERATOR_EXPLODED_LABELS' anchor/label points.
    const handleExplodedFrameDevClick = (e) => {
        if (openCard !== 'generator' || videoState !== 'ended') return;
        const rect = e.currentTarget.getBoundingClientRect();
        const xPct = ((e.clientX - rect.left) / rect.width) * 100;
        const yPct = ((e.clientY - rect.top) / rect.height) * 100;
        // eslint-disable-next-line no-console
        console.log(`Clicked at: ${xPct.toFixed(1)}%, ${yPct.toFixed(1)}%`);
    };
    // ==== END TEMP DEV HELPER ====

    // ==== TEMP DEV HELPER 2 — delete this whole block + its onClick prop on
    // the "How it Works?" real photo below (search "TEMP DEV HELPER 2") once
    // done ====
    // Same idea as the one above: click anywhere on the labelled real photo
    // to log where you clicked as a % of the image box's own width/height —
    // for finding real values to plug into HOW_IT_WORKS_LABELS' anchor/label
    // points.
    const handleRealPhotoDevClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPct = ((e.clientX - rect.left) / rect.width) * 100;
        const yPct = ((e.clientY - rect.top) / rect.height) * 100;
        // eslint-disable-next-line no-console
        console.log(`Clicked at: ${xPct.toFixed(1)}%, ${yPct.toFixed(1)}%`);
    };
    // ==== END TEMP DEV HELPER 2 ====

    const handleExpand = (id) => {
        if (animPhase !== 'idle') return;
        const imgEl = cardImgRefsMap.current.get(id);
        if (!imgEl) return;

        pendingRectRef.current = { start: rectToPlain(imgEl.getBoundingClientRect()), end: null };
        setOpenCard(id);
        setAnimPhase('opening');
        setVideoState('pending');

        const url = `${window.location.pathname}${window.location.search}#${id}`;
        window.history.pushState(null, '', url);
    };

    const handleClose = () => {
        if (animPhase !== 'open' || !openCard) return;
        const flipImg = flipImgRef.current;
        const targetImg = cardImgRefsMap.current.get(openCard);
        if (!flipImg || !targetImg) return;

        pendingRectRef.current = {
            start: rectToPlain(flipImg.getBoundingClientRect()),
            end: rectToPlain(targetImg.getBoundingClientRect()),
        };
        setAnimPhase('closing');

        const url = `${window.location.pathname}${window.location.search}`;
        window.history.pushState(null, '', url);
    };

    const onCardKeyDown = (e, id) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleExpand(id);
        }
    };

    const activeCard = openCard ? CARD_BY_ID[openCard] : null;
    // overview fades back in (and the panel starts fading out) the instant
    // 'closing' begins, concurrent with the image's shrink-back — not only
    // once 'idle' is fully reached, which would delay the fade-in until
    // after the whole close animation already finished
    const overviewHidden = animPhase === 'opening' || animPhase === 'open';

    return (
        <section className="project-detail afg-page">
            {/* this outer div's className must stay static forever — useFadeIn
                adds "is-visible" to it imperatively, outside React. If React ever
                rewrites this className it clobbers that class and the page silently
                resets to opacity:0. State-driven classes live on the elements below. */}
            <div className="container fade-in afg-content">
                <div className={`afg-overview ${overviewHidden ? 'is-hidden' : ''}`} aria-hidden={overviewHidden}>
                    <Link to="/#projects" className="back-link">← Back to projects</Link>

                    <header className="project-detail-header">
                        <h1>{project.title}</h1>
                        <p className="project-detail-tagline">A 3D printed hand-cranked generator that matches its own output voltage to the load using gear ratios, not electronics.</p>
                    </header>

                    <div className="project-detail-video">
                        <iframe
                            src="https://www.youtube.com/embed/4W6Q12jll-k"
                            title="Two-Speed Hand-Crank Generator demo video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    <div className="project-detail-body">
                        <h3>How it Works?</h3>
                        <p>
                            A hand crank drives a two-speed gearbox that uses a constant-mesh dog
                            clutch, so the ratio can be changed while the crank is still turning.
                            The gearbox turns a custom-wound axial flux generator through a belt,
                            producing 3-phase AC that is rectified to DC and smoothed by capacitors.
                            From there the output either drives a DC load directly or passes through
                            a 5V buck regulator to charge a phone over USB. High gear suits phone
                            charging; low gear extends the usable range down to smaller loads.
                        </p>
                        <div className="project-section-images afg-how-it-works-images">
                            {/* onClick is TEMP DEV HELPER 2 — see handleRealPhotoDevClick above */}
                            <div className="afg-how-it-works-image" onClick={handleRealPhotoDevClick}>
                                <img
                                    src={`${import.meta.env.BASE_URL}projects/axial-flux-generator/labelled-real.jpeg`}
                                    alt="The two-speed hand-crank generator"
                                />
                                <div className="afg-exploded-labels is-visible">
                                    <svg className="afg-exploded-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        {REAL_PHOTO_LABELS.flatMap((lbl, i) =>
                                            lbl.anchors.map((anchor, j) => (
                                                <line
                                                    key={`${lbl.id}-${j}`}
                                                    x1={lbl.label[0]}
                                                    y1={lbl.label[1]}
                                                    x2={anchor[0]}
                                                    y2={anchor[1]}
                                                    style={{ transitionDelay: `${i * 0.15}s` }}
                                                />
                                            ))
                                        )}
                                    </svg>
                                    {REAL_PHOTO_LABELS.flatMap((lbl, i) =>
                                        lbl.anchors.map((anchor, j) => (
                                            <span
                                                key={`${lbl.id}-dot-${j}`}
                                                className="afg-exploded-dot"
                                                style={{ left: `${anchor[0]}%`, top: `${anchor[1]}%`, transitionDelay: `${i * 0.15}s` }}
                                            />
                                        ))
                                    )}
                                    {REAL_PHOTO_LABELS.map((lbl, i) => (
                                        <span
                                            key={lbl.id}
                                            className="afg-exploded-label-text"
                                            style={{ left: `${lbl.label[0]}%`, top: `${lbl.label[1]}%`, transitionDelay: `${i * 0.15}s` }}
                                        >
                                            {lbl.text.split('\n').map((line, k, arr) => (
                                                <span key={k}>
                                                    {line}
                                                    {k < arr.length - 1 && <br />}
                                                </span>
                                            ))}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="afg-how-it-works-image">
                                <img
                                    src={`${import.meta.env.BASE_URL}projects/axial-flux-generator/power-train-diagram.png`}
                                    alt="Power train diagram: hand crank to two-speed gearbox to belt drive to axial flux generator to bridge rectifier to DC power rail"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="project-detail-body">
                        <h3>Why a Two-Speed Gearbox?</h3>
                        <p>
                            A generator's voltage depends on how fast it spins, but a hand can only crank
                            within a narrow speed range. Normally an electronic regulator would fix the
                            output. This design does that job mechanically instead: each gear ratio turns
                            the same crank speed into a different output voltage, so selecting a gear is
                            selecting a voltage. There is no battery, and no regulation electronics on the
                            main output.
                        </p>
                        <div className="project-detail-image afg-gear-ratio-graph">
                            <img
                                src={`${import.meta.env.BASE_URL}projects/axial-flux-generator/gear-ratio-graph.png`}
                                alt="Graph of generator voltage vs crank RPM for high gear (27x) and low gear (15x)"
                            />
                        </div>

                        <h3>Up to 48% Drivetrain Efficiency</h3>
                        <p>
                            Efficiency rises with crank speed, from about 17% at low RPM to a plateau
                            near 48% by 42 to 52 crank RPM, the peak within the measured range. A
                            comfortable hand-cranking speed is around 75 RPM, above the measured range,
                            so real-world use likely sits at or beyond this plateau.
                        </p>
                        <div className="afg-efficiency-images">
                            <img
                                src={`${import.meta.env.BASE_URL}projects/axial-flux-generator/efficiency-vs-rpm.png`}
                                alt="Efficiency vs crank RPM for the two-speed gearbox in high gear (27x, 51-ohm load), peaking around 48%"
                            />
                            <img
                                src={`${import.meta.env.BASE_URL}projects/axial-flux-generator/power-vs-rpm.png`}
                                alt="Mechanical and electrical power vs crank RPM for the two-speed gearbox in high gear (27x, 51-ohm load)"
                            />
                        </div>
                    </div>

                    <div className="project-detail-body">
                        <h3>Mechanical Design</h3>
                        <p>
                            I designed the entire system in SolidWorks and 3D printed it in PLA, built
                            around standard hardware: 608 bearings, 8 mm steel rod, a GT2 timing belt,
                            and off-the-shelf screws and bolts. The printed parts were designed to fit
                            these directly, with hand-machining only where needed, like the cross-drilled
                            shafts and filed flats that lock the drivetrain together.
                        </p>
                        <SolidworksCarousel items={SOLIDWORKS_VIEWS} heading="Mechanical Design" />
                    </div>

                    <div className="project-detail-body">
                        <h3>Other Demo Videos and Media</h3>
                        <div className="afg-efficiency-images">
                            <div className="project-detail-video">
                                <iframe
                                    src="https://www.youtube.com/embed/XeyOtD_APX4?mute=1"
                                    title="USB Lamp Gearbox Generator Demo"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                            <div className="project-detail-video">
                                <iframe
                                    src="https://www.youtube.com/embed/MTipZfEfMKA"
                                    title="Two-Speed Hand-Crank Generator demo video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                        <div className="project-detail-image afg-gear-ratio-graph">
                            <img
                                src={`${import.meta.env.BASE_URL}projects/axial-flux-generator/me-and-gearbox.jpeg`}
                                alt="Me with the finished two-speed hand-crank generator"
                            />
                        </div>
                    </div>

                    <div className="project-detail-body">
                        <p><strong>Click in each system below to see how I designed, built, and tested it!</strong></p>
                    </div>

                    <div className="afg-cards-grid">
                        {CARDS.map((card) => (
                            <div className="afg-card-wrap" key={card.id}>
                                <div
                                    className="project-card afg-card-trigger"
                                    role="button"
                                    tabIndex={overviewHidden ? -1 : 0}
                                    aria-expanded={openCard === card.id}
                                    ref={(el) => cardTriggerRefsMap.current.set(card.id, el)}
                                    onClick={() => handleExpand(card.id)}
                                    onKeyDown={(e) => onCardKeyDown(e, card.id)}
                                >
                                    <div className="project-card-image">
                                        {/* hidden (not removed) while its own card is expanded/animating so
                                            we can always measure this exact element's real rect for the
                                            shrink-back animation, however the user has scrolled/resized */}
                                        <img
                                            ref={(el) => cardImgRefsMap.current.set(card.id, el)}
                                            className={card.mediaPosition ? 'afg-media-shift-right' : ''}
                                            src={card.image}
                                            alt={card.title}
                                            loading="lazy"
                                            style={openCard === card.id && animPhase !== 'idle' ? { visibility: 'hidden' } : undefined}
                                        />
                                    </div>
                                    <div className="project-card-body">
                                        <h3>{card.title}</h3>
                                        <p>{card.blurb}</p>
                                        <span className="learn-more">Learn more ↓</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* rendered as a sibling of .afg-content (not nested inside it) on
                purpose: .afg-content carries the shared .fade-in class, whose
                translateY() transform (even translateY(0) once settled) would
                establish a new containing block for any position:fixed
                descendant, silently breaking this panel's fixed positioning
                relative to the real viewport */}
            {activeCard && (
                <div className={`container afg-expanded ${animPhase !== 'open' ? 'is-flying' : ''}`} ref={panelRef}>
                    <div className="afg-expanded-topbar">
                        <button
                            type="button"
                            className="afg-expanded-close"
                            aria-label={`Close ${activeCard.title}`}
                            ref={closeButtonRef}
                            onClick={handleClose}
                        >
                            ×
                        </button>
                    </div>

                    <div className={`afg-expanded-hero ${animPhase === 'open' ? 'is-settled' : ''}`}>
                        <h2 className="afg-expanded-title">{activeCard.title}</h2>
                        {activeCard.caption && <p className="afg-expanded-caption">{activeCard.caption}</p>}
                        {/* onClick is the TEMP DEV HELPER — see handleExplodedFrameDevClick above */}
                        <div
                            className={`afg-expanded-media ${activeCard.compactMedia ? 'afg-media-compact' : ''} ${animPhase === 'open' ? 'afg-media-clip' : ''}`}
                            onClick={handleExplodedFrameDevClick}
                        >
                            {/* once the exploded-view video has been kicked off (videoState
                                leaves 'pending'), it replaces the static image in this exact
                                spot and keeps showing (playing, then paused on its last frame)
                                through 'open' AND 'closing' — only the plain <img> participates
                                in the FLIP grow/shrink measurement, so swapping mid-'opening'
                                would break that; the swap only happens once already settled. */}
                            {/* object-position is applied via a CSS class, not an inline style —
                                the FLIP settle logic (opening's finalize timeout) does
                                `img.style.cssText = ''` on this exact element, which would wipe
                                an inline style but leaves className alone */}
                            {activeCard.video && videoState !== 'pending' ? (
                                <video
                                    ref={flipImgRef}
                                    className={`afg-expanded-image ${activeCard.mediaPosition ? 'afg-media-shift-right' : ''} ${activeCard.mediaZoom ? 'afg-media-zoom' : ''}`}
                                    src={activeCard.video}
                                    muted
                                    playsInline
                                    autoPlay
                                    loop={activeCard.loopVideo}
                                    preload="auto"
                                    onEnded={handleVideoEnded}
                                />
                            ) : (
                                <img
                                    ref={flipImgRef}
                                    className={`afg-expanded-image ${activeCard.mediaPosition ? 'afg-media-shift-right' : ''}`}
                                    src={activeCard.image}
                                    alt={activeCard.title}
                                />
                            )}
                            {activeCard.explodedLabels && (
                                // gated on animPhase === 'open' too (not just videoState), so
                                // the labels disappear the instant 'closing' starts — they sit
                                // in normal document flow while the video/image shrinks away
                                // via its own independent fixed-position FLIP, so leaving them
                                // visible during close would strand them floating over the now-
                                // empty spot instead of following the shrinking media.
                                <div className={`afg-exploded-labels ${videoState === 'ended' && animPhase === 'open' ? 'is-visible' : ''}`}>
                                    <svg className="afg-exploded-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        {/* one <line> per anchor — a label with multiple anchors (e.g.
                                            "Double 12 Magnet Rotors", "Frame") fans out several lines
                                            from the same text box, all sharing that label's stagger delay */}
                                        {activeCard.explodedLabels.flatMap((lbl, i) =>
                                            lbl.anchors.map((anchor, j) => (
                                                <line
                                                    key={`${lbl.id}-${j}`}
                                                    x1={lbl.label[0]}
                                                    y1={lbl.label[1]}
                                                    x2={anchor[0]}
                                                    y2={anchor[1]}
                                                    style={{ transitionDelay: `${i * 0.15}s` }}
                                                />
                                            ))
                                        )}
                                    </svg>
                                    {/* endpoint dots as plain HTML circles (not SVG) so they render
                                        as true circles regardless of the media box's aspect ratio —
                                        the SVG lines above use preserveAspectRatio="none", which would
                                        stretch an <svg><circle> into an ellipse in a non-square box */}
                                    {activeCard.explodedLabels.flatMap((lbl, i) =>
                                        lbl.anchors.map((anchor, j) => (
                                            <span
                                                key={`${lbl.id}-dot-${j}`}
                                                className="afg-exploded-dot"
                                                style={{ left: `${anchor[0]}%`, top: `${anchor[1]}%`, transitionDelay: `${i * 0.15}s` }}
                                            />
                                        ))
                                    )}
                                    {activeCard.explodedLabels.map((lbl, i) => (
                                        <span
                                            key={lbl.id}
                                            className="afg-exploded-label-text"
                                            style={{ left: `${lbl.label[0]}%`, top: `${lbl.label[1]}%`, transitionDelay: `${i * 0.15}s` }}
                                        >
                                            {lbl.text}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`afg-expanded-body ${animPhase === 'open' ? 'is-settled' : ''}`}>
                        <p>{activeCard.panel.text}</p>
                        <div className="afg-expanded-gallery">
                            {activeCard.panel.images.map((src) => (
                                <img key={src} src={src} alt={`${activeCard.title} placeholder`} loading="lazy" />
                            ))}
                        </div>
                        {activeCard.panel.extraSections?.map((section) => (
                            <div className="afg-expanded-extra-section" key={section.id}>
                                {section.heading && (
                                    <h3 className={section.id === 'early-prototypes' ? 'afg-heading-title-size' : ''}>
                                        {section.heading}
                                    </h3>
                                )}
                                {section.subtitle && <p className="afg-expanded-extra-subtitle">{section.subtitle}</p>}
                                {section.subheading && <h4 className="afg-expanded-extra-subheading">{section.subheading}</h4>}
                                {section.subheadingText && <p className="afg-expanded-extra-subtitle">{section.subheadingText}</p>}
                                {section.bullets && (
                                    <ul className="afg-expanded-extra-bullets">
                                        {section.bullets.map((bullet) => (
                                            <li key={bullet.label}>
                                                <strong>{bullet.label}:</strong> {bullet.text}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {section.images?.length > 1 ? (
                                    <div className="afg-expanded-gallery">
                                        {section.images.map((src) => (
                                            // build-1.jpeg is a tall portrait shot cropped down to this
                                            // gallery's 4:3 box — shifting the crop window down (Y>50%)
                                            // keeps more of the bottom of the frame and trims more off
                                            // the top, instead of the default even top/bottom crop
                                            <img
                                                key={src}
                                                src={src}
                                                alt={section.heading}
                                                loading="lazy"
                                                style={
                                                    src.includes('build-1') ? { objectPosition: 'center 75%' }
                                                    : src.includes('closeup-collar') ? { objectPosition: 'center 75%' }
                                                    : src.includes('through-hole-screw') ? { objectPosition: '65% 65%' }
                                                    : undefined
                                                }
                                            />
                                        ))}
                                    </div>
                                ) : section.images?.length === 1 ? (
                                    // a single image (e.g. a chart) shows at its own natural aspect
                                    // ratio, uncropped — the side-by-side gallery above is only for
                                    // when there are two photos to crop into matching boxes
                                    <img
                                        className={`afg-expanded-extra-image ${['spin-test', 'voltage-sag', 'custom-gears'].includes(section.id) ? 'afg-gear-ratio-graph' : ''}`}
                                        src={section.images[0]}
                                        alt={section.heading}
                                        loading="lazy"
                                    />
                                ) : null}
                                {section.carousel && (
                                    <SolidworksCarousel items={section.carousel} heading={section.heading} />
                                )}
                                {section.engineering && (
                                    <div className="project-engineering-grid">
                                        {section.engineering.map((item) => (
                                            <div className="project-engineering-card" key={item.challenge}>
                                                <h4>{item.challenge}</h4>
                                                {item.description && <p>{item.description}</p>}
                                                {item.test && <p><strong>Test:</strong> {item.test}</p>}
                                                {item.outcome && <p><strong>Outcome:</strong> {item.outcome}</p>}
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.challenge}
                                                        loading="lazy"
                                                        className="project-engineering-card-img"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
