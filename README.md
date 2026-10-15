# Explore Vietnam

An interactive 3D tour of Vietnam: a stylised terrain map with sixteen
destinations, a north-to-south scroll journey, search and filters, and a
guide for each place.

Built with React, TypeScript, Vite, Three.js (React Three Fiber), Framer
Motion and Tailwind CSS.

![Explore Vietnam home page: the 3D terrain map of Vietnam with glowing destination markers](docs/screenshot.png)

## Run locally

```bash
npm install
npm run dev
```

`npm run build` type-checks and writes the production site to `dist/`.

## Project layout

- `src/data/` holds all content: destinations, regions, categories, the
  country outline and the photo list. Add a destination by appending an entry
  to `destinations.ts`.
- `src/three/` is the 3D scene: terrain, water, markers, camera and the
  performance governor that lowers quality on slower devices.
- `src/components/` is the interface.
- `public/images/` holds the photographs. See `IMAGE_CREDITS.md` for their
  sources.

## Deployment

The site is published to GitHub Pages by the workflow in
`.github/workflows/deploy.yml`. Every push to `main` builds the site with the
repository name as the base path (`/explore-vietnam/`) and deploys it; it can
also be run by hand from the Actions tab. In the repository settings,
Pages → Source must be set to "GitHub Actions".

To build the same output locally:

```bash
npm run build -- --base=/explore-vietnam/
```

This is an independent showcase, not an official tourism service.
