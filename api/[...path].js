import app from '../server/index.js';

export default function handler(req, res) {
  // Vercel may strip the /api prefix when forwarding
  // requests to a catch-all serverless function.
  const url = req.url || '/';

  if (!url.startsWith('/api/') && url !== '/api') {
    req.url = `/api${url.startsWith('/') ? url : `/${url}`}`;
  }

  return app(req, res);
}
