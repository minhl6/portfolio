import { useEffect, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { projects } from '../data/projects.js';
import { useFadeIn } from '../hooks/useFadeIn.js';
import CodeBlock from '../components/CodeBlock.jsx';

const VIDEO_HOST_PATTERN = /youtube\.com|youtu\.be|vimeo\.com/i;

function toEmbedUrl(video) {
    return video.includes('youtu.be')
        ? video.replace('youtu.be/', 'www.youtube.com/embed/')
        : video.replace('watch?v=', 'embed/');
}

// placeholder media paths (e.g. project TODOs not filled in yet) shouldn't
// show a broken-image icon — just collapse the element
function hideOnError(e) {
    e.currentTarget.style.display = 'none';
}

function ProjectProcess({ steps }) {
    return (
        <ol className="project-process">
            {steps.map((step, i) => (
                <li className="project-process-step" key={step.phase || i}>
                    <div className="project-process-marker" aria-hidden="true">{i + 1}</div>
                    <div className="project-process-content">
                        <h4>{step.phase}</h4>
                        <p>{step.body}</p>
                        {step.image && (
                            <img src={step.image} alt={step.alt || step.phase} loading="lazy" onError={hideOnError} />
                        )}
                    </div>
                </li>
            ))}
        </ol>
    );
}

function ProjectEngineering({ items }) {
    return (
        <div className="project-engineering-grid">
            {items.map((item, i) => (
                <div className="project-engineering-card" key={item.challenge || i}>
                    <h4>{item.challenge}</h4>
                    <p><strong>Test:</strong> {item.test}</p>
                    <p><strong>Outcome:</strong> {item.outcome}</p>
                </div>
            ))}
        </div>
    );
}

function ProjectResults({ results }) {
    return (
        <>
            {results.metrics && (
                <div className="project-results-metrics">
                    {results.metrics.map((metric, i) => (
                        <div className="project-result-stat" key={metric.label || i}>
                            <span className="project-result-value">{metric.value}</span>
                            <span className="project-result-label">{metric.label}</span>
                        </div>
                    ))}
                </div>
            )}
            {results.narrative && <p>{results.narrative}</p>}
        </>
    );
}

function ProjectFinalDesign({ specs }) {
    return (
        <dl className="project-final-design">
            {specs.map((spec) => (
                <div className="project-final-design-row" key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                </div>
            ))}
        </dl>
    );
}

function ProjectGallery({ items }) {
    return (
        <div className="project-gallery-grid">
            {items.map((item, i) => {
                if (item.type === 'youtube') {
                    return (
                        <div className="project-detail-video project-gallery-video" key={item.id || i}>
                            <iframe
                                src={`https://www.youtube.com/embed/${item.id}`}
                                title={item.caption || 'Project video'}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    );
                }
                if (item.type === 'video') {
                    return (
                        <div className="project-detail-video project-gallery-video" key={item.src || i}>
                            <video controls src={item.src} onError={hideOnError} />
                        </div>
                    );
                }
                return (
                    <figure className="project-gallery-item" key={item.src || i}>
                        <img src={item.src} alt={item.alt || item.caption || ''} loading="lazy" onError={hideOnError} />
                        {item.caption && <figcaption>{item.caption}</figcaption>}
                    </figure>
                );
            })}
        </div>
    );
}

function ProjectCarousel({ items, heading }) {
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
        drag.current.velocity *= 0.94; // friction: how quickly the glide settles
        if (!track || Math.abs(drag.current.velocity) < 0.1) {
            drag.current.rafId = null;
            return;
        }
        track.scrollLeft -= drag.current.velocity;
        drag.current.rafId = requestAnimationFrame(runMomentum);
    };

    const onPointerDown = (e) => {
        if (e.pointerType !== 'mouse') return; // let touch use native swipe scrolling
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
        // smooth the instantaneous speed so a single jittery frame doesn't dominate the glide
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

export default function ProjectDetail() {
    const { slug } = useParams();
    const project = projects[slug];

    useFadeIn([slug]);

    useEffect(() => {
        if (project) {
            document.title = `${project.title} — Minh Le`;
        }
    }, [project]);

    if (!project) {
        return <Navigate to="/" replace />;
    }

    // hero is either a plain URL string (older entries), a richer
    // { image, alt } object, or explicitly `false` to hide the banner entirely
    const isHeroObject = typeof project.hero === 'object' && project.hero !== null;
    const heroImage = project.hero === false
        ? null
        : isHeroObject ? project.hero.image : (project.hero || project.image);
    const heroAlt = isHeroObject ? project.hero.alt : project.title;

    return (
        <section className="project-detail">
            <div className="container fade-in">
                <Link to="/#projects" className="back-link">← Back to projects</Link>

                <header className="project-detail-header">
                    <h1>{project.title}</h1>
                    <p className="project-detail-tagline">{project.tagline}</p>
                    <ul className="project-tools">
                        {project.tools.map((tool) => (
                            <li key={tool}>{tool}</li>
                        ))}
                    </ul>
                </header>

                {heroImage && (
                    <div className="project-detail-image">
                        <img src={heroImage} alt={heroAlt} onError={hideOnError} />
                    </div>
                )}

                <div className="project-detail-body">
                    {project.summary && <p className="project-summary">{project.summary}</p>}
                    {project.overview && (
                        <>
                            <h3>The Problem</h3>
                            <p>{project.overview}</p>
                        </>
                    )}
                    {!project.overview && project.description && (
                        Array.isArray(project.description)
                            ? project.description.map((paragraph, i) => <p key={i}>{paragraph}</p>)
                            : <p>{project.description}</p>
                    )}
                </div>

                {project.contribution && (
                    <div className="project-detail-sections">
                        <div className="project-section project-role">
                            <h3>What I Did</h3>
                            <ul className="project-role-list">
                                {project.contribution.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {project.process && (
                    <div className="project-detail-sections">
                        <div className="project-section">
                            <h3>Design Process</h3>
                            <ProjectProcess steps={project.process} />
                        </div>
                    </div>
                )}

                {project.engineering && (
                    <div className="project-detail-sections">
                        <div className="project-section">
                            <h3>Engineering &amp; Testing</h3>
                            <ProjectEngineering items={project.engineering} />
                        </div>
                    </div>
                )}

                {project.finalDesign && (
                    <div className="project-detail-sections">
                        <div className="project-section">
                            <h3>Final Design</h3>
                            <ProjectFinalDesign specs={project.finalDesign} />
                        </div>
                    </div>
                )}

                {project.results && (
                    <div className="project-detail-sections">
                        <div className="project-section">
                            <h3>Results</h3>
                            <ProjectResults results={project.results} />
                        </div>
                    </div>
                )}

                {project.reflection && (
                    <div className="project-detail-sections">
                        <div className="project-section">
                            <h3>Reflection</h3>
                            <p>{project.reflection}</p>
                        </div>
                    </div>
                )}

                {project.gallery && (
                    <div className="project-detail-sections">
                        <div className="project-section">
                            <h3>Gallery</h3>
                            <ProjectGallery items={project.gallery} />
                        </div>
                    </div>
                )}

                {project.sections && (
                    <div className="project-detail-sections">
                        {project.sections.map((section, i) => {
                            // a sideBySide section with no video pairs its single `image` with the
                            // text in the row instead of the full-width images strip below
                            const rowImage = section.sideBySide && !section.video && !section.images && section.image;
                            const images = (section.images || (rowImage ? [] : [section.image])).filter(Boolean);

                            const videoElement = section.video && (
                                <div className={`project-detail-video ${section.loop ? 'is-zoomed' : ''}`}>
                                    {VIDEO_HOST_PATTERN.test(section.video) ? (
                                        <iframe
                                            src={toEmbedUrl(section.video)}
                                            title={section.heading || 'Project demo video'}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : section.loop ? (
                                        <video
                                            src={section.video}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            onLoadedMetadata={(e) => { e.currentTarget.playbackRate = 2; }}
                                        />
                                    ) : (
                                        <video controls src={section.video} />
                                    )}
                                </div>
                            );

                            return (
                                <div className="project-section" key={section.heading || i}>
                                    {section.heading && <h3>{section.heading}</h3>}

                                    {section.sideBySide ? (
                                        <div className="project-section-row">
                                            {section.text && <p>{section.text}</p>}
                                            {videoElement}
                                            {rowImage && (
                                                <div className="project-section-row-media">
                                                    <img src={rowImage} alt={section.heading || project.title} loading="lazy" />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            {section.text && <p>{section.text}</p>}
                                            {videoElement}
                                        </>
                                    )}

                                    {images.length > 0 && (
                                        <div className="project-section-images">
                                            {images.map((src) => (
                                                <img key={src} src={src} alt={section.heading || project.title} loading="lazy" />
                                            ))}
                                        </div>
                                    )}

                                    {section.gallery && (
                                        <div className="project-section-gallery">
                                            {section.gallery.map(({ image, caption }) => (
                                                <figure key={image}>
                                                    <img src={image} alt={caption || section.heading} loading="lazy" />
                                                    {caption && <figcaption>{caption}</figcaption>}
                                                </figure>
                                            ))}
                                        </div>
                                    )}

                                    {section.carousel && (
                                        <ProjectCarousel items={section.carousel} heading={section.heading} />
                                    )}

                                    {section.blocks && (
                                        <div className="project-section-blocks">
                                            {section.blocks.map((block) => (
                                                <div className="project-section-block" key={block.image}>
                                                    {block.image && (
                                                        <img src={block.image} alt={block.caption || section.heading} loading="lazy" />
                                                    )}
                                                    {block.caption && <p>{block.caption}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {section.code && (
                                        <CodeBlock code={section.code} language={section.language} />
                                    )}

                                    {section.caption && (
                                        <p className="project-section-caption">{section.caption}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
