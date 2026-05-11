# AGENTS.md

## Project Shape
- Single Angular 18 app at the repo root.
- App entrypoint is `src/main.ts`; it bootstraps `AppComponent` with `appConfig`.
- The app is standalone Angular, not NgModule-based.
- `src/app/app.config.ts` provides the router, `provideHttpClient(withInterceptors([authInterceptor]))`, and `NgbModalConfig` with `animation: true` and `backdrop: 'static'`.
- `src/app/app.routes.ts` is the route map.
- `LayoutComponent` lives at `src/app/components/layout/layout.component.ts` and wraps the authenticated child routes.
- `authGuard` sends unauthenticated users to `/login`; `adminGuard` sends non-admins to `/mapa` and protects `inicio`, `difuntos`, `reportes`, and `dashboard`.

## Commands
- `npm install`
- `npm start` or `ng serve`
- `npm run build` or `ng build`
- `npm run watch` for `ng build --watch --configuration development`
- `npm test` or `ng test`

## Build / Test Notes
- Production builds output to `dist/cementerio-app`.
- `angular.json` uses `src/assets` and `public/` as build assets.
- Global styles include Bootstrap and Bootstrap Icons; `sweetalert2` is explicitly allowed as a CommonJS dependency.
- Build/test polyfills include `zone.js` and `@angular/localize/init`.
- `ng test` uses Karma with Chrome via `karma-chrome-launcher`.
- Production build replaces `src/environments/environment.development.ts` with `src/environments/environment.ts`.

## Editing Notes
- Keep route and guard changes consistent with the auth/admin flow.
