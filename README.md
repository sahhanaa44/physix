# PHYSIX — Interactive Physics Learning Lab

PHYSIX is a full-stack physics learning platform built with React, TypeScript, Vite, Three.js / React Three Fiber, Express and MongoDB. It combines guided learning modules, personal learning dashboards, interactive 2D/3D visual environments and a persistent experiment notebook.

## Product areas

- **Student account:** email/password registration and sign-in, JWT sessions, personal profile.
- **Dashboard:** XP, level, streak, completed lessons, saved experiments, recommended modules and quick access to labs.
- **Learning:** 12 structured university-level physics modules, lesson sequences, key equations, concept explanations and knowledge checks.
- **2D simulator:** responsive, world-scaled Canvas workbench with analytic/vacuum and quadratic-drag projectile kinematics, plus numerical force/motion, nonlinear pendulum, spring–damper, central-force orbit, 1D collisions, circular motion, incline-plane dynamics, Lorentz-force motion and travelling-wave superposition. Controls include speed, angle, gravity, mass, force, damping and restitution.
- **3D studio:** interactive Newton–Euler rigid-body workbench with force and torque vectors, mass, gravity, scalar inertia, initial velocity, world position, centre-of-mass offset, contact restitution, damping, shape selection and top/front/side/perspective camera views.
- **Guided experiments:** 12 module-specific mathematical workbenches with independent variables, governing equations, calculated readouts and model-derived plots (projectile, rotational dynamics, orbit, interference, Coulomb field, ideal gas, double slit, relativity, continuity, optics, decay and blackbody spectrum).
- **Progress & analytics:** completed lesson records, weekly activity, module coverage and achievements.
- **Lab notebook:** saved 2D/3D experiment configurations persisted to MongoDB.

## Run locally

Requirements: Node.js 20+ and MongoDB (local or Atlas).

1. Extract the ZIP and open the `physix-mongodb` directory.
2. Install packages:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and set `MONGODB_URI` and a long random `JWT_SECRET`.
4. Start the API and Vite development server:

   ```bash
   npm start
   ```

5. Open `http://localhost:5173`.

## Production deployment (GitHub + Vercel)\n\nThis ZIP includes a Vercel serverless Express entry point and SPA routing. Push the `physix-mongodb` folder to GitHub, import it into Vercel, set the project root to `physix-mongodb` (if needed), and add `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, and `NODE_ENV=production` in Vercel Environment Variables. Leave `VITE_API_URL` empty for same-domain requests. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete walkthrough.\n\n## Important scientific and implementation notes

The simulations now calculate model states from physical equations rather than moving pre-drawn shapes. Read `PHYSICS_MODELS.md` for the equations, numerical methods and limitations of every mode. In particular, the 3D workbench is a teaching-grade rigid-body model with scalar inertia and ground-plane contact, not a full-featured game/engineering physics engine. The guided experiment plots are calculated from each module's stated mathematical model; they are not laboratory measurements. Validate the assumptions before using results for formal assessment or research.

Weekly analytics are based on recorded lesson completions. No hidden sample data is generated for a new account. Password reset, email verification, classroom/teacher roles and AI tutoring are not included in this release.

## Security checklist before public launch

- Use HTTPS for frontend and API.
- Use a strong, unique `JWT_SECRET` and keep `.env` out of source control.
- Restrict `CLIENT_ORIGIN` to the real frontend domain.
- Use a dedicated production MongoDB user and network allowlist.
- Add rate limiting, email verification, password reset and monitoring before a large public launch.
- Review privacy requirements and provide a privacy policy / terms appropriate to your audience.

## Scripts

```bash
npm start       # Vite frontend + Express API
npm run client  # frontend only
npm run server  # API only
npm run build   # TypeScript check + production frontend build
npm run preview # preview built frontend
```
