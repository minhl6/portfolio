import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { projects } from '../data/projects.js';
import { useFadeIn } from '../hooks/useFadeIn.js';

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

                <div className="project-detail-image">
                    <img src={project.image} alt={project.title} />
                </div>

                <div className="project-detail-body">
                    <p className="project-summary">{project.summary}</p>
                    {project.description.map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </section>
    );
}
