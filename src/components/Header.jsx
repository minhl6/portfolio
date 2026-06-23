import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IconLinkedin, IconGithub, IconInstagram } from './icons.jsx';

const base = import.meta.env.BASE_URL;

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    function closeNav() {
        setIsOpen(false);
    }

    return (
        <header className="site-header">
            <div className="container header-inner">
                <Link to="/" className="logo" onClick={closeNav}>
                    Minh Le
                </Link>

                <button
                    className="nav-toggle"
                    aria-label="Toggle navigation"
                    aria-expanded={isOpen}
                    onClick={() => setIsOpen((open) => !open)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={`site-nav ${isOpen ? 'is-open' : ''}`}>
                    <a href={`${base}#about`} onClick={closeNav}>About</a>
                    <a href={`${base}#projects`} onClick={closeNav}>Projects</a>
                    <a href={`${base}resume.pdf`} onClick={closeNav}>Resume</a>
                    <a href={`${base}#contact`} onClick={closeNav}>Contact</a>
                    <div className="nav-social">
                        <a href="https://www.linkedin.com/in/minh-le-26b0103b1/" target="_blank" rel="noopener" aria-label="LinkedIn">
                            <IconLinkedin />
                        </a>
                        <a href="https://github.com/minhl6" target="_blank" rel="noopener" aria-label="GitHub">
                            <IconGithub />
                        </a>
                        <a href="https://www.instagram.com/benny.minh/" target="_blank" rel="noopener" aria-label="Instagram">
                            <IconInstagram />
                        </a>
                    </div>
                </nav>
            </div>
        </header>
    );
}
