# Project Summary

A personal portfolio website for Minh Le, a mechanical engineering student. The
site presents a hero/intro section, an about section, a filterable grid of
personal and school projects, and a contact section, with a dedicated detail
page per project.

## Technology

- **Vite** — dev server and production bundler. `vite.config.js` uses
  `@vitejs/plugin-react` for Fast Refresh and sets `base: '/portfolio/'` so the
  built app works under the GitHub Pages subpath
  `https://<username>.github.io/portfolio/`.
- **React 18** — component-based UI, written in JSX (`.jsx` files), with
  functional components and hooks (`useState`, plus a custom
  `useFadeIn` hook built on `IntersectionObserver` for scroll-triggered
  fade-ins).
- **React Router (`react-router-dom`)** — client-side routing via
  `BrowserRouter`. `App.jsx` defines two routes: `/` (home) and
  `/projects/:slug` (project detail). The router's `basename` is set to
  `import.meta.env.BASE_URL` so links resolve correctly both in local dev and
  under the GitHub Pages subpath.
- **Plain CSS** (`src/style.css`) — no CSS framework or CSS-in-JS library.
- **ESLint** — linting via `eslint.config.js` with React/React Hooks plugins.
- No backend or database — all content is static and bundled at build time.

## Implementation

- Content for each project (title, tagline, image, tools, category,
  description) lives in a single data module, `src/data/projects.js`, keyed by
  slug. Pages read from this module rather than hardcoding project content,
  so adding/editing a project is a data change, not a UI change.
- `src/pages/Home.jsx` renders the project grid from that data, with a
  client-side filter (All / Personal / School) driven by the `category` field.
- `src/pages/ProjectDetail.jsx` reads the `:slug` route param, looks it up in
  `projects.js`, and renders that project's full detail; unknown slugs redirect
  back to `/`.
- Shared UI (`Header.jsx`, `Footer.jsx`, `icons.jsx`) lives under
  `src/components/`.
- Deployment is automated with a GitHub Actions workflow
  (`.github/workflows/deploy.yml`): on every push to `main` it runs
  `npm run build`, copies `index.html` to `404.html` (so direct loads of
  `/projects/<slug>` don't 404 on GitHub Pages, which has no server-side
  router), and publishes `dist/` to GitHub Pages.

See `documentation/ARCHITECTURE.md` for the full file-by-file breakdown and
local development commands.
