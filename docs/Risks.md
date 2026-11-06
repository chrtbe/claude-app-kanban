# Risks

- **localStorage** – data is per browser/device, limited in size and lost if site data is cleared.
- **No sync / multi-user** – two tabs overwrite each other (last write wins).
- **Accessibility** – keyboard drag works, but screen-reader announcements are default only and not tuned.
- **Delete is permanent** – no undo for tasks or columns.
- **Pre-release dependencies** – the installed versions are very recent (Next 16, Tailwind 4, Motion 14); expect breaking changes on upgrades.
- **Column colors are decorative** – the title carries the meaning; color alone is never relied on. Old saved boards have no stored color and get a position-based one until columns are re-created.
- **Touch drag delay** – drags on touch start after a ~200 ms press; users may need to hold slightly longer.
# Risks

- **localStorage** – data is per browser/device, limited in size and lost if site data is cleared.
- **No sync / multi-user** – two tabs overwrite each other (last write wins).
- **Accessibility** – keyboard drag works, but screen-reader announcements are default only and not tuned.
- **Delete is permanent** – no undo for tasks or columns.
- **Pre-release dependencies** – the installed versions are very recent (Next 16, Tailwind 4, Motion 14); expect breaking changes on upgrades.
- **Column colors are decorative** – the title carries the meaning; color alone is never relied on. Old saved boards have no stored color and get a position-based one until columns are re-created.
- **Touch drag delay** – drags on touch start after a ~200 ms press; users may need to hold slightly longer.
- **New UI dependencies** – `lucide-react` and Inter (fetched from Google Fonts at build time, then self-hosted); the build needs network access to Google Fonts. Blurred background blobs cost some GPU on weak devices.
- **Confetti dependency** – `canvas-confetti` is loaded lazily on first use. Animations are decorative and disabled for reduced motion.

## Review (2026-11-06)

Checks: `npm test` ✅ (9 passed), `npm run typecheck` ✅, `npm run lint` ❌, `npm audit` not run (network blocked in sandbox).

### Problems
- **Lint is broken** – `eslint-config-next` bundles typescript-eslint, which rejects TypeScript 7 ("does not support TS 7.0"). Fix: pin `typescript` to a supported 5.x/6.x or wait for support.
- **Dependency audit not done** – run `npm audit` locally.
- **No CI** – no `.github/` workflows; test/lint/typecheck only run by hand.

### Security
- **Unvalidated stored data** – `storage.ts` casts `JSON.parse` to `Board`. Corrupt or edited localStorage can crash the UI. Add a shape check and fall back to a new board.
- **No input limits** – titles/descriptions have no `maxLength`; huge text can fill localStorage and slow the board.
- **No security headers** – `next.config.mjs` sets none (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`). Add via `headers()` before deploying.
- **XSS** – no `dangerouslySetInnerHTML`/`eval` in `src`; React escapes text. Low risk.
- **Secrets** – `.env` is git-ignored; none used by the app.

### Health checks
- No health endpoint (app is client-only). If deployed, add `src/app/api/health/route.ts` returning `{ status: "ok" }` for the host/uptime monitor.

### Possible improvements
- Undo for delete (toast with "Undo").
- Listen to the `storage` event to sync tabs and avoid overwrites.
- Component tests for drag and drop (Testing Library is installed, unused).
- Add `typecheck` + `lint` + `test` GitHub Action on pull requests.


Checks: `npm test` ✅ (9 passed), `npm run typecheck` ✅, `npm run lint` ❌, `npm audit` not run (network blocked in sandbox).

### Problems
- **Lint is broken** – `eslint-config-next` bundles typescript-eslint, which rejects TypeScript 7 ("does not support TS 7.0"). Fix: pin `typescript` to a supported 5.x/6.x or wait for support.
- **Dependency audit not done** – run `npm audit` locally.
- **No CI** – no `.github/` workflows; test/lint/typecheck only run by hand.

### Security
- **Unvalidated stored data** – `storage.ts` casts `JSON.parse` to `Board`. Corrupt or edited localStorage can crash the UI. Add a shape check and fall back to a new board.
- **No input limits** – titles/descriptions have no `maxLength`; huge text can fill localStorage and slow the board.
- **No security headers** – `next.config.mjs` sets none (CSP, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`). Add via `headers()` before deploying.
- **XSS** – no `dangerouslySetInnerHTML`/`eval` in `src`; React escapes text. Low risk.
- **Secrets** – `.env` is git-ignored; none used by the app.

### Health checks
- No health endpoint (app is client-only). If deployed, add `src/app/api/health/route.ts` returning `{ status: "ok" }` for the host/uptime monitor.

### Possible improvements
- Undo for delete (toast with "Undo").
- Listen to the `storage` event to sync tabs and avoid overwrites.
- Component tests for drag and drop (Testing Library is installed, unused).
- Add `typecheck` + `lint` + `test` GitHub Action on pull requests.
