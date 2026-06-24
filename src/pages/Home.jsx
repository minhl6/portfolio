import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects.js';
import { useFadeIn } from '../hooks/useFadeIn.js';

export default function Home() {
    const [filter, setFilter] = useState('all');
    const isFirstFilterRender = useRef(true);

    useFadeIn();

    useEffect(() => {
        document.title = 'Minh Le — Mechanical Engineering Student';
    }, []);

    useEffect(() => {
        // skip on mount so the initial scroll-triggered fade-in still plays;
        // on later filter switches, show cards immediately instead of waiting
        // for IntersectionObserver to catch up with the layout change
        if (isFirstFilterRender.current) {
            isFirstFilterRender.current = false;
            return;
        }
        document.querySelectorAll('.project-card.fade-in').forEach((el) => el.classList.add('is-visible'));
    }, [filter]);

    const entries = Object.entries(projects);

    return (
        <>
            <section className="hero" id="home">
                <div className="container hero-inner">
                    <div className="hero-text fade-in">
                        <p className="hero-eyebrow">Hi, I&apos;m</p>
                        <h1>Minh Le</h1>
                        <p className="hero-subtitle">
                            a Mechanical Engineering student designing, building, and testing things that move.
                        </p>
                        <p className="hero-description">
                            Currently in my second year, working toward joining a UBC design team and looking for an
                            engineering internship. I like turning ideas into CAD models, then into parts you can
                            actually hold.
                        </p>
                        <div className="hero-actions">
                            <a href="#projects" className="btn btn-primary">View Projects</a>
                            <a href={`${import.meta.env.BASE_URL}resume.pdf`} className="btn btn-secondary">Resume</a>
                            <a href="https://www.linkedin.com/in/minh-le-26b0103b1/" target="_blank" rel="noopener" className="btn btn-secondary">
                                LinkedIn
                            </a>
                        </div>
                    </div>
                    <div className="hero-photo fade-in">
                        <img
                            src="https://picsum.photos/seed/minh-le-profile/640/640"
                            alt="Portrait of Minh Le"
                            width="640"
                            height="640"
                        />
                    </div>
                </div>
            </section>

            <section className="about" id="about">
                <div className="container">
                    <h2 className="section-heading fade-in">About</h2>
                    <div className="about-grid fade-in">
                        <p className="about-text">
                            Replace this paragraph with your own story: where you&apos;re studying, what got you
                            interested in mechanical engineering, and what kind of problems you like working on (e.g.
                            mechanisms, robotics, manufacturing, vehicle dynamics). Keep it to a few sentences — this
                            is the elevator-pitch version of you.
                        </p>
                        <ul className="skills-list">
                            <li>SolidWorks / Fusion 360</li>
                            <li>ANSYS &amp; FEA</li>
                            <li>3D Printing &amp; Laser Cutting</li>
                            <li>Arduino / Embedded Basics</li>
                            <li>Manufacturing &amp; Machining</li>
                            <li>Technical Drawing (GD&amp;T)</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className="projects" id="projects">
                <div className="container">
                    <h2 className="section-heading fade-in">Projects</h2>

                    <div className="project-filters fade-in" role="group" aria-label="Filter projects by category">
                        <button
                            className={`filter-btn ${filter === 'all' ? 'is-active' : ''}`}
                            aria-pressed={filter === 'all'}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${filter === 'personal' ? 'is-active' : ''}`}
                            aria-pressed={filter === 'personal'}
                            onClick={() => setFilter('personal')}
                        >
                            Personal Projects
                        </button>
                        <button
                            className={`filter-btn ${filter === 'school' ? 'is-active' : ''}`}
                            aria-pressed={filter === 'school'}
                            onClick={() => setFilter('school')}
                        >
                            School Projects
                        </button>
                    </div>

                    <div className="projects-grid">
                        {entries.map(([slug, project]) => (
                            <article
                                key={slug}
                                className={`project-card fade-in ${filter !== 'all' && project.category !== filter ? 'is-filtered-out' : ''}`}
                            >
                                <Link to={`/projects/${slug}`} className="project-card-link">
                                    <div className="project-card-image">
                                        <img src={project.image} alt={project.title} loading="lazy" />
                                        <span className="project-card-badge">
                                            {project.category === 'school' ? 'School' : 'Personal'}
                                        </span>
                                    </div>
                                    <div className="project-card-body">
                                        <h3>{project.title}</h3>
                                        <p>{project.tagline}</p>
                                        <span className="learn-more">Learn more →</span>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="contact" id="contact">
                <div className="container fade-in">
                    <h2 className="section-heading">Get in touch</h2>
                    <p className="contact-text">
                        I&apos;m currently applying to UBC design teams and looking for internship opportunities.
                        Feel free to reach out.
                    </p>
                    <div className="contact-links">
                        <a href="mailto:benny.minh@gmail.com" className="btn btn-primary">benny.minh@gmail.com</a>
                        <a href="https://www.linkedin.com/in/minh-le-26b0103b1/" target="_blank" rel="noopener" className="btn btn-secondary">
                            LinkedIn
                        </a>
                        <a href="https://github.com/minhl6" target="_blank" rel="noopener" className="btn btn-secondary">
                            GitHub
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
