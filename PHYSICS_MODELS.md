# PHYSIX simulation models and assumptions

This document describes what the current release actually calculates. The models are intended for learning and controlled experiments, not certified engineering or research output.

## Open 2D workbench

- **Projectile:** point-mass kinematics with constant gravity. With `k = 0`, the path is evaluated analytically; with `k > 0`, quadratic drag `F_d = -k|v|v` is integrated using 1/240 s steps. The mass and drag coefficient are adjustable. At `g = 0` and `k = 0`, the path is straight and the ideal model has no return-to-ground event. The viewport expands with the predicted path/time window.
- **Force & Motion:** Newton's second law with user mass, applied force direction/magnitude, gravity and linear viscous damping. Velocity is advanced with semi-implicit Euler substeps; a simple horizontal ground bounce uses the selected coefficient of restitution.
- **Pendulum:** nonlinear point-mass pendulum equation `θ̈ = -(g/L) sin(θ) - c θ̇`, not merely a sinusoidal animation.
- **Spring:** one-dimensional mass–spring–damper equation `m ẍ = F - kx - c ẋ`.
- **Orbit:** two-dimensional Newtonian central-force integration `r̈ = -μr/|r|³`; the initial tangential speed is a user-adjustable multiple of circular speed, so learners can create circular, elliptical and escape trajectories. This is a single central-body model, not an N-body solver.
- **Collision:** one-dimensional motion between two hard limits with a coefficient-of-restitution velocity reversal. It is not a general polygon collision engine.
- **Circular motion:** planar central acceleration `a = -v² r̂/r`; tangential initial velocity produces a circular path.
- **Inclined plane:** one-dimensional block motion along a fixed slope, `a = g(sin θ - μ cos θ) + F/m`.
- **Magnetic field:** planar Lorentz-force motion in a uniform field perpendicular to the motion, `a = (q/m)(v × B)`. Charge sign changes the curvature direction.
- **Wave:** travelling-wave superposition, `y = A sin(kx - ωt)` with `k = 2πf/v`.

The 2D integrator uses a maximum step of 1/240 s for the dynamic modes. Projectile motion is evaluated analytically in vacuum and numerically when quadratic drag is enabled. The display uses world-to-screen scaling rather than treating pixels as metres.

## 3D rigid-body workbench

The 3D studio integrates translation using `m a = ΣF` and rotation using the scalar-inertia approximation `I α = τ` about each world axis. It includes user-set mass, gravity, force vector, torque vector, scalar moment of inertia, initial velocity, world position, centre-of-mass offset, restitution and damping. The body can be a box, sphere or cylinder. The ground contact is a simplified plane collision with normal restitution and tangential damping.

Important limitations: the 3D model is not a full contact solver. It does not yet calculate arbitrary body-body collisions, friction cones, gyroscopic coupling, a full inertia tensor, joints, constraints or deformable bodies. The user-specified scalar inertia is applied independently on each axis. The geometry is shifted relative to the simulation origin to show the effect of an offset centre of mass; it is not a CAD mass-property calculation.

## Guided module experiments

Each of the 12 experiment workspaces has module-specific independent variables, physical equations, calculated readouts and a plot generated from the corresponding model:

1. Classical mechanics — projectile trajectory.
2. Rotational dynamics — angular velocity under constant torque.
3. Gravitation — central-force orbital path and circular-speed comparison.
4. Waves — two-source interference.
5. Electromagnetism — radial equipotential contours and Coulomb field readout.
6. Thermodynamics — ideal-gas isotherm in P–V space.
7. Quantum physics — double-slit fringe probability pattern.
8. Special relativity — inertial-frame worldlines and Lorentz factor.
9. Fluid mechanics — continuity-based area/velocity relationship.
10. Optics — thin-lens ray construction.
11. Nuclear physics — exponential radioactive decay and half-life.
12. Astrophysics — blackbody spectrum and Wien peak.

The charts and readouts are computed from the selected parameters; they are not recordings from physical apparatus. The sweep control moves a scan cursor across the calculated plot domain; it is not a physical time-domain animation. Parameter changes recalculate the governing model immediately. Dedicated time-domain solvers and richer apparatus for each bench remain a future extension.

## Numerical and scientific cautions

- Idealizations are part of the model; real air drag, turbulence, nonuniform fields, quantum measurement statistics, material deformation and multi-body contact require additional models.
- Extreme slider values can expose limitations of an ideal model. Interpret results within the stated assumptions.
- Validate any model against a trusted textbook, analytical solution or experimental dataset before using it for assessment or research.

## Live motion analysis

The 2D workbench now samples the active solver at 5 Hz for display and plots horizontal/generalized position, vertical position (or pendulum angular velocity), and speed against simulation time. Readouts include speed, model acceleration, kinetic energy (`½mv²`) and momentum magnitude (`mv`). For the pendulum, angular displacement and angular acceleration are shown, and the equivalent bob speed (`L|ω|`) is used for kinetic energy and momentum. These display samples do not control the solver timestep: the dynamic modes continue to integrate with a maximum step of 1/240 s. The analysis panel is intended for teaching and comparison, not precision metrology.
