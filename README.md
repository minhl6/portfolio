# Portfolio

Source for my personal portfolio site, showcasing engineering projects I've built as a mechanical engineering student at UBC. Live at https://minhl6.github.io/portfolio

## Projects featured

- Two-Speed Hand-Crank Generator
- Leader-Follower Robotic Arm
- Chompy: Underwater Retrieval Device
- Rainwater Harvester: System Simulation & Design

## Tech stack

- React 18, written in JSX
- Vite for the dev server and production build
- React Router (`react-router-dom`) for client-side routing
- Plain CSS (`src/style.css`), no framework
- ESLint for linting
- No backend — all project content lives in `src/data/projects.js` and is bundled at build time

## Running locally

```
npm install
npm run dev      # start the dev server
npm run build    # production build to dist/
npm run preview  # preview the production build
npm run lint     # run eslint
```

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys on every push to `main`: it runs `npm run build`, copies `dist/index.html` to `dist/404.html` as an SPA fallback for client-side routing, and publishes `dist/` to GitHub Pages.
