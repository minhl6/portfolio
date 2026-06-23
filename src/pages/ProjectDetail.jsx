import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { projects } from '../data/projects.js';
import { useFadeIn } from '../hooks/useFadeIn.js';

const VIDEO_HOST_PATTERN = /youtube\.com|youtu\.be|vimeo\.com/i;

function toEmbedUrl(video) {
    return video.includes('youtu.be')
        ? video.replace('youtu.be/', 'www.youtube.com/embed/')
        : video.replace('watch?v=', 'embed/');
}

function ProjectCarousel({ items, heading }) {
    const trackRef = useRef(null);
    const drag = useRef({ active: false, lastX: 0, lastTime: 0, velocity: 0, rafId: null });

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
            {items.map(({ image, caption }) => (
                <figure className="project-carousel-item" key={image}>
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
    const [lightboxImage, setLightboxImage] = useState(null);

    useFadeIn([slug]);

    useEffect(() => {
        if (project) {
            document.title = `${project.title} — Minh Le`;
        }
    }, [project]);

    useEffect(() => {
        if (!lightboxImage) return;

        const onKeyDown = (e) => {
            if (e.key === 'Escape') setLightboxImage(null);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [lightboxImage]);

    if (!project) {
        return <Navigate to="/" replace />;
    }

    const heroImage = project.hero || project.image;

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
                        <img src={heroImage} alt={project.title} />
                    </div>
                )}

                <div className="project-detail-body">
                    <p className="project-summary">{project.summary}</p>
                    {project.description && project.description.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                    ))}
                </div>

                {project.sections && (
                    <div className="project-detail-sections">
                        {project.sections.map((section, i) => {
                            const images = (section.images || [section.image]).filter(Boolean);

                            return (
                                <div className="project-section" key={section.heading || i}>
                                    {section.heading && <h3>{section.heading}</h3>}
                                    {section.text && <p>{section.text}</p>}

                                    {section.video && (
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
                                            {section.gallery.map(({ src, caption }) => (
                                                <figure key={src}>
                                                    <button
                                                        type="button"
                                                        className="project-section-gallery-trigger"
                                                        onClick={() => setLightboxImage({ src, caption })}
                                                        aria-label={`Expand image: ${caption || section.heading}`}
                                                    >
                                                        <img src={src} alt={caption || section.heading} loading="lazy" />
                                                    </button>
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
                                        <pre className="project-section-code">
                                            <code>{section.code}</code>
                                        </pre>
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

            {lightboxImage && (
                <div className="lightbox" onClick={() => setLightboxImage(null)}>
                    <button
                        type="button"
                        className="lightbox-close"
                        onClick={() => setLightboxImage(null)}
                        aria-label="Close expanded image"
                    >
                        ×
                    </button>
                    <img src={lightboxImage.src} alt={lightboxImage.caption || project.title} />
                </div>
            )}
        </section>
    );
}
