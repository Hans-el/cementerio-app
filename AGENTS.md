# AGENTS.md

## Repo Shape
- Single Angular app at the repo root; source is `src/` and the app bootstraps from `src/main.ts`.
- `src/app/app.config.ts` wires the router, HTTP client, and `authInterceptor`.
- `src/app/app.routes.ts` is the main route map; `LayoutComponent` wraps the authenticated child routes.
- `adminGuard` protects admin-only routes like `inicio`, `difuntos`, `reportes`, and `dashboard`.

## Commands
- Install deps with `npm install`.
- Start dev server with `npm start` or `ng serve`.
- Build with `npm run build` or `ng build`; output goes to `dist/cementerio-app`.
- Run unit tests with `npm test` or `ng test`.
- Use `npm run watch` for a development build loop.

## Build/Test Details
- Angular CLI version is 18.2.19.
- Production builds replace `src/environments/environment.development.ts` with `src/environments/environment.ts`.
- Build/test polyfills include `zone.js` and `@angular/localize/init`.
- `ng test` uses Karma; the repo is set up for Chrome via `karma-chrome-launcher`.

## Asset / Bundling Notes
- `src/assets` and `public/` are both copied into builds.
- Bootstrap and Bootstrap Icons are global styles from `angular.json`; `sweetalert2` is allowed as a CommonJS dependency.

## Editing Cautions
- Keep changes consistent with the existing standalone Angular setup; avoid introducing NgModule-based patterns.
- Check route and guard changes carefully when touching auth or admin flows.
