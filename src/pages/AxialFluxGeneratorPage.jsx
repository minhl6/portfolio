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

const CARDS = [
    {
        id: 'gearbox',
        title: 'Gearbox',
        blurb: 'Two-speed gear switching to match crank RPM to each device\'s ideal voltage range.',
        image: 'https://picsum.photos/seed/afg-gearbox-card/600/400',
        panel: {
            text: 'Placeholder copy describing the gearbox design: gear ratios, the shift mechanism, and how the two speeds were chosen. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            images: [
                'https://picsum.photos/seed/afg-gearbox-1/500/360',
                'https://picsum.photos/seed/afg-gearbox-2/500/360',
                'https://picsum.photos/seed/afg-gearbox-3/500/360',
            ],
        },
    },
    {
        id: 'generator',
        title: 'Axial Flux Generator',
        blurb: 'The axial flux alternator itself — coil layout, magnet rotor, and stator construction.',
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
                    subtitle: 'The generator was hand-spun across a range of speeds, logging RPM and voltage both with nothing connected and with a small DC motor as a load. The no-load line came out to about 0.0074V per RPM, which meant hitting the 15V target needed roughly 2,020 RPM at the generator, or about a 27× gear ratio for a comfortable 75 RPM hand crank. The loaded line sits lower because current has to push through the generator\'s own coil resistance on top of the load\'s, and that\'s really where the sag comes from. It also takes longer to get going, since the diode\'s voltage drop stays about the same no matter the speed, so it costs more at low voltages than high ones.',
                    images: [
                        `${import.meta.env.BASE_URL}projects/axial-flux-generator/spin-test-graph.png`,
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

    // Generator-only: the instant the expand animation settles, swap from the
    // static image to the exploded-view video (same spot, same size — see
    // showVideo below) and let it autoplay. Guarded on videoState === 'pending'
    // so this only fires once per open, not on every re-render while open.
    useEffect(() => {
        if (animPhase === 'open' && openCard === 'generator' && videoState === 'pending') {
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
                        <p className="project-detail-tagline">{project.tagline}</p>
                    </header>

                    <div className="project-detail-body">
                        <h3>The Big Idea</h3>
                        <p>
                            Placeholder paragraph explaining the core concept: a single hand crank drives a
                            two-speed gearbox feeding an axial flux generator, so the same crank can charge a
                            phone or a power tool battery just by shifting gears to match the target voltage.
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </p>
                    </div>

                    <div className="project-detail-image">
                        <img src="https://picsum.photos/seed/afg-results-graph/1100/550" alt="Placeholder results graph" />
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
                        <div className="afg-expanded-media" onClick={handleExplodedFrameDevClick}>
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
                                    className={`afg-expanded-image ${activeCard.mediaPosition ? 'afg-media-shift-right' : ''}`}
                                    src={activeCard.video}
                                    muted
                                    playsInline
                                    autoPlay
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
                                <h3>{section.heading}</h3>
                                {section.subtitle && <p className="afg-expanded-extra-subtitle">{section.subtitle}</p>}
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
                                                style={src.includes('build-1') ? { objectPosition: 'center 75%' } : undefined}
                                            />
                                        ))}
                                    </div>
                                ) : section.images?.length === 1 ? (
                                    // a single image (e.g. a chart) shows at its own natural aspect
                                    // ratio, uncropped — the side-by-side gallery above is only for
                                    // when there are two photos to crop into matching boxes
                                    <img className="afg-expanded-extra-image" src={section.images[0]} alt={section.heading} loading="lazy" />
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
