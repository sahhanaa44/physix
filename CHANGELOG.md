# PHYSIX 3.0.0 — simulation upgrade

## 2D workbench
- Replaced fixed-pixel projectile plotting with world-scaled SI coordinates and dynamic viewport fitting.
- Added analytic vacuum projectile motion and numerical quadratic-drag motion with adjustable mass, drag coefficient, speed, launch angle and gravity.
- Added semi-implicit fixed-step models for force/motion, nonlinear pendulum, spring–damper, central-force orbit, one-dimensional collisions, circular motion, incline-plane motion and Lorentz-force motion.
- Added travelling-wave superposition with adjustable amplitude, frequency and propagation speed.
- Added trajectory trails, velocity-vector display, play/pause/restart and saved parameter configurations.

## 3D workbench
- Replaced decorative scene switching with an integrated Newton–Euler rigid-body workbench.
- Added mass, gravity, force components, torque components, scalar moment of inertia, initial velocity components, world position, centre-of-mass offset, shape selection, restitution and damping.
- Added perspective, top, front and side camera presets, plus interactive orbit/zoom controls.
- Added a visible applied-force vector and a ground-plane contact model.

## Guided experiments
- Added module-specific parameter sets and calculated plots for all 12 curriculum experiments.
- Added equation-derived readouts and model assumptions to each experiment workspace.
- Added trial/sweep logging and lab-notebook saving.
- Fixed knowledge-check answer highlighting so it follows the correct answer for each module.

## Product and deployment
- Retained the account, student dashboard, learning progress, XP, achievements and MongoDB-backed experiment notebook.
- Added `PHYSICS_MODELS.md` describing equations, numerical methods and limitations.
- Updated deployment and product documentation.

## Deployment and analysis update

- Added a live motion-analysis panel to the 2D workbench with sampled position, speed, acceleration, kinetic-energy and momentum readouts, plus position/angular-displacement and speed-time plots.
- Extended trajectory trails to additional moving 2D modes and exposed an initial-velocity control for the inclined-plane model.
- Improved the inclined-plane friction model so a stationary block remains at rest when static friction can balance the downslope force.
- Added a Vercel serverless Express entry point, on-demand MongoDB connection reuse, same-origin API support and a GitHub-to-Vercel deployment guide.
