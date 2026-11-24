# Verification status for this archive

- `src/App.tsx` passed the TypeScript TSX transpilation/parser check with zero syntax diagnostics.
- `server/index.js` and `api/[...path].js` passed Node.js syntax checks.
- A full `npm run build` could not be completed in the packaging environment: npm dependency installation could not reach the npm registry (`EAI_AGAIN`). The archive intentionally does not include `node_modules`.
- No live browser/WebGL interaction test or production deployment test was possible in this environment.

After extracting, run `npm install` and `npm run build`. Then test the 2D zero-gravity and air-drag cases, all ten 2D modes, 3D force/torque/contact controls, all 12 experiment workspaces, account registration/login, MongoDB persistence and the deployment checklist in `DEPLOYMENT.md`.
