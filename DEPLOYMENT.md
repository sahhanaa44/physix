# Deploy PHYSIX to GitHub + Vercel

PHYSIX is a Vite/React frontend with an Express API and MongoDB persistence. This repository is configured for a **single Vercel project**: Vercel serves the built frontend and runs the Express API through a serverless catch-all function at `api/[...path].js`.

## 1. Push the project to GitHub

1. Extract the ZIP.
2. Open the `physix-mongodb` folder in VS Code.
3. Create a GitHub repository (for example, `physix-interactive-physics-lab`).
4. In the project terminal run:

   ```bash
   git init
   git add .
   git commit -m "Prepare PHYSIX for deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

   Replace the remote URL with your own repository URL. Never commit `.env`; it is ignored by `.gitignore`.

## 2. Prepare MongoDB Atlas

1. Create a MongoDB Atlas cluster and a database named `physix`.
2. Create a database user and password.
3. In Atlas Network Access, allow access from Vercel. For a quick first deployment, Atlas may require `0.0.0.0/0`; this permits connections from any IP, so use a strong database password and review Atlas network controls for a production setup.
4. Copy the application connection string and replace its username, password and database name. URL-encode special characters in the password.

## 3. Import the GitHub repository into Vercel

1. Sign in to Vercel and choose **Add New → Project**.
2. Import your GitHub repository.
3. Set the **Root Directory** to `physix-mongodb` if the repository contains the folder as its top-level directory. If the repository itself is the contents of `physix-mongodb`, leave Root Directory as `./`.
4. Use these build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

The included `vercel.json` handles the frontend SPA fallback and the API function route.

## 4. Add Vercel environment variables

In **Project → Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A unique random secret, at least 32 characters |
| `CLIENT_ORIGIN` | Your exact Vercel URL, e.g. `https://your-project.vercel.app` |
| `NODE_ENV` | `production` |
| `VITE_API_URL` | Leave unset or empty for same-domain API requests |
| `GOOGLE_CLIENT_ID` | Optional; only if configuring Google sign-in |

Generate a strong JWT secret locally with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Do not put `MONGODB_URI` or `JWT_SECRET` in any `VITE_` variable. Vite variables are included in the browser bundle.

Deploy once to obtain your Vercel domain. Set `CLIENT_ORIGIN` to that exact domain (no trailing slash), save the variable and redeploy.

## 5. Verify the deployment

Open these URLs, replacing the host with your deployed domain:

- `https://YOUR-DOMAIN.vercel.app/` — application
- `https://YOUR-DOMAIN.vercel.app/api/health` — API/database health

The health endpoint should return `ok: true` and `database: connected`. Then test account registration, sign-in, lesson completion and saved experiments. If health returns a database error, check the Atlas URI, database user/password and Atlas Network Access.

## Local development

Requirements: Node.js 20+ and MongoDB Atlas or a local MongoDB instance.

```bash
npm install
```

Copy `.env.example` to `.env`, set `MONGODB_URI` and a development `JWT_SECRET`, then run:

```bash
npm start
```

Open `http://localhost:5173`. In local development, Vite proxies `/api` to `http://localhost:5000`.

## Important deployment notes

- Vercel serverless functions are not persistent processes. The API connects to MongoDB on demand and reuses the Mongoose connection within a warm function instance.
- Do not rely on local disk for uploads or permanent files. Use object storage for future user-uploaded assets.
- Google sign-in remains optional and requires a configured OAuth client ID and matching authorized origins.
- Configure a privacy notice and terms before inviting public users. Add rate limiting, email verification, password reset and monitoring before a large public launch.
- Physics models are educational approximations. Read `PHYSICS_MODELS.md` for governing equations and model limitations.
