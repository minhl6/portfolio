import hljs from 'highlight.js/lib/core';
import cpp from 'highlight.js/lib/languages/cpp';
import 'highlight.js/styles/atom-one-dark.css';

hljs.registerLanguage('cpp', cpp);

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

export default function CodeBlock({ code, language }) {
    if (!code) return null;

    let html;
    try {
        html = hljs.getLanguage(language)
            ? hljs.highlight(code, { language }).value
            : hljs.highlightAuto(code).value;
    } catch {
        html = escapeHtml(code);
    }

    return (
        <pre className="code-block">
            <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
    );
}
