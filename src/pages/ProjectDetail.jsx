import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { projects } from '../data/projects.js';
import { useFadeIn } from '../hooks/useFadeIn.js';

const VIDEO_HOST_PATTERN = /youtube\.com|youtu\.be|vimeo\.com/i;

function toEmbedUrl(video) {
    return video.includes('youtu.be')
        ? video.replace('youtu.be/', 'www.youtube.com/embed/')
        : video.replace('watch?v=', 'embed/');
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
                                        <div className="project-detail-video">
                                            {VIDEO_HOST_PATTERN.test(section.video) ? (
                                                <iframe
                                                    src={toEmbedUrl(section.video)}
                                                    title={section.heading || 'Project demo video'}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
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
        </section>
    );
}
