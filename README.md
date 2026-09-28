# Clare’s World

Clare Zou’s personal portfolio. React 19, TypeScript, Vite and CSS, with the original 2.5D character assets and a continuous character carousel.

## Local development

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## GitHub Pages

Push to `main` to build and deploy through `.github/workflows/pages.yml`. Repository Settings → Pages must use **GitHub Actions** as the source.

```sh
pnpm build:pages
```

The Pages build uses `/clare-world-portfolio/` as its base. Character, project and detail-image URLs respect that base. Real HTML entrypoints are generated for `/about/`, `/internship/`, `/projects/`, `/contact/` and the three project detail routes so direct links and browser refresh work without an SPA redirect. React Router normalizes trailing slashes. No server, database or secrets are needed.

## Content

- `src/data/characters.ts`: character assets and section labels
- `src/data/projects.ts`: three projects and detail screenshots
- `src/pages/About.tsx`, `Internship.tsx`, `Contact.tsx`: page content
- `public/`: original supplied images

## Motion

One requestAnimationFrame loop controls the continuous four-character orbit. Mouse, drag, horizontal wheel and keyboard controls share this system; React only updates when the active character changes. Home exits overlap destination entrances. Images and route modules preload without blocking the initial render. Click sparks ignore drags. Reduced-motion disables automatic movement, tilt and entrance sequences. Animation loops pause when the page is hidden.

## Validation

Desktop Chromium and Chrome navigation, arrows, horizontal wheel, drag suppression, character click and return navigation checked. Phone-width drag/menu, tablet layout, reduced-motion navigation and three-card native list checked. Safari automation timed out; Safari and real touch devices remain unverified.
