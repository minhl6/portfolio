import { IconLinkedin, IconGithub, IconEmail } from './icons.jsx';

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="container footer-inner">
                <p>&copy; {new Date().getFullYear()} Minh Le. Built with React.</p>
                <div className="footer-social">
                    <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener" aria-label="LinkedIn">
                        <IconLinkedin />
                    </a>
                    <a href="https://github.com/your-profile" target="_blank" rel="noopener" aria-label="GitHub">
                        <IconGithub />
                    </a>
                    <a href="mailto:benny.minh@gmail.com" aria-label="Email">
                        <IconEmail />
                    </a>
                </div>
            </div>
        </footer>
    );
}
