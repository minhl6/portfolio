# Architecture

## Stack

- **Vite** — build tool and dev server
- **React 18** — UI library
- **React Router** (`react-router-dom`) — client-side routing
- Plain CSS (no framework, no CSS-in-JS) — `src/style.css`

No backend, no database. All content is static and bundled at build time.

## Project structure

```
src/
  main.jsx              Entry point — mounts <App /> and imports style.css
  App.jsx                Router setup (BrowserRouter, Routes)
  style.css              All site styling

  components/
    Header.jsx            Site nav: logo, links, mobile menu, social icons
    Footer.jsx             Footer: copyright, social icons, email
    icons.jsx               SVG icon components (LinkedIn, GitHub, Instagram, Email)

  pages/
    Home.jsx                Hero, About, Projects grid (with filter), Contact
    ProjectDetail.jsx       Single project page, rendered at /projects/:slug

  data/
    projects.js              All project content (title, tagline, image, tools,
                              description, category) keyed by slug

  hooks/
    useFadeIn.js              Scroll-triggered fade-in animation (IntersectionObserver)

public/                  Static files served as-is (e.g. resume.pdf if added)
```

## Routing

- `/` — Home page (hero, about, projects, contact, all in one page with anchor links)
- `/projects/:slug` — Project detail page. Slug must match a key in `src/data/projects.js`;
  unknown slugs redirect back to `/`.

`App.jsx` sets `BrowserRouter`'s `basename` to `import.meta.env.BASE_URL` so routing works
correctly whether the site is served from the domain root (local dev) or a subpath
(GitHub Pages project site).

## Editing content

| What to change | Where |
|---|---|
| Name, hero text, about paragraph, skills | `src/pages/Home.jsx` |
| Projects (title, tagline, image, tools, description, category) | `src/data/projects.js` |
| Social links, email, resume link | `src/components/Header.jsx`, `src/components/Footer.jsx`, `src/pages/Home.jsx` |
| Colors, spacing, layout | `src/style.css` |
| Resume PDF | drop a `resume.pdf` file into `public/` |
| Profile/project photos | replace the `picsum.photos` placeholder URLs in `src/data/projects.js` and `src/pages/Home.jsx` with real image URLs or local files in `public/` |

Each project is identified by a slug (the object key in `projects.js`), which also becomes
its URL: `/projects/<slug>`. The `category` field (`"personal"` or `"school"`) controls
which filter tab a project shows up under.

## Running locally

```bash
npm install
npm run dev       # starts dev server, prints local URL
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run lint       # eslint
```

## Deployment (GitHub Pages)

The site deploys automatically via GitHub Actions (`.github/workflows/deploy.yml`) on every
push to `main`. The workflow builds the app, adds a `404.html` fallback copy of `index.html`
(required so direct loads/refreshes of `/projects/<slug>` work correctly on Pages, since
GitHub Pages has no server-side router), and publishes `dist/` to GitHub Pages.

`vite.config.js` sets `base: '/portfolio/'` to match the GitHub Pages project URL
(`https://<username>.github.io/portfolio/`). If the repository is ever renamed, update this
value to match.

**One-time manual setup required:** in the GitHub repo, go to
**Settings → Pages → Source** and select **GitHub Actions**. After that, every push to
`main` deploys automatically.
