import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const base = import.meta.env.BASE_URL;

export default function Resume() {
    useEffect(() => {
        document.title = 'Resume — Minh Le';
    }, []);

    return (
        <section className="resume-page">
            <div className="container">
                <Link to="/" className="back-link">← Back to portfolio</Link>

                <div className="resume-header">
                    <div>
                        <h1>Resume</h1>
                        <p className="resume-subtitle">Minh Le — Mechanical Engineering Student at UBC</p>
                    </div>
                </div>

                <div className="resume-viewer-wrap">
                    <iframe
                        src={`${base}resume.pdf`}
                        className="resume-viewer"
                        title="Minh Le Resume"
                    />
                </div>

                <div className="resume-footer-actions">
                    <a
                        href={`${base}resume.pdf`}
                        download="Minh_Le_Resume.pdf"
                        className="btn btn-primary"
                    >
                        Download PDF
                    </a>
                    <a
                        href="mailto:benny.minh@gmail.com"
                        className="btn btn-secondary"
                    >
                        Get in touch
                    </a>
                </div>
            </div>
        </section>
    );
}
