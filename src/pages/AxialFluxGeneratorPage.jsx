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
        image: 'https://picsum.photos/seed/afg-generator-card/600/400',
        panel: {
            text: 'Placeholder copy describing the generator build: coil winding, magnet arrangement, and stator/rotor spacing. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            images: [
                'https://picsum.photos/seed/afg-generator-1/500/360',
                'https://picsum.photos/seed/afg-generator-2/500/360',
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

    const handleExpand = (id) => {
        if (animPhase !== 'idle') return;
        const imgEl = cardImgRefsMap.current.get(id);
        if (!imgEl) return;

        pendingRectRef.current = { start: rectToPlain(imgEl.getBoundingClientRect()), end: null };
        setOpenCard(id);
        setAnimPhase('opening');

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
                        <img ref={flipImgRef} className="afg-expanded-image" src={activeCard.image} alt={activeCard.title} />
                    </div>

                    <div className="afg-expanded-body">
                        <p>{activeCard.panel.text}</p>
                        <div className="afg-expanded-gallery">
                            {activeCard.panel.images.map((src) => (
                                <img key={src} src={src} alt={`${activeCard.title} placeholder`} loading="lazy" />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
