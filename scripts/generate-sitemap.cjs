// Build-time sitemap and robots generator
// Usage:
//   - Prefer setting environment variable SITE_URL to your production origin, e.g. https://example.com
//   - Optionally set BASE_PATH (e.g. /repo-name/ for GitHub Pages) — default '/'
//   - Fallbacks: VERCEL_URL, Netlify URL/DEPLOY_URL, public/CNAME
//   - The script writes public/sitemap.xml and public/robots.txt before Vite build

const fs = require('fs');
const path = require('path');

const BASE_PATH = process.env.BASE_PATH || '/';

function normalizeBase(base) {
  if (!base || base === '/') return '';
  if (!base.startsWith('/')) base = '/' + base;
  if (!base.endsWith('/')) base += '/';
  return base;
}

function normalizeOrigin(url) {
  if (!url) return null;
  return String(url).replace(/\s+/g, '').replace(/\/+$/, '');
}

function getOrigin() {
  // 1) Explicit env vars
  const envUrl = normalizeOrigin(process.env.SITE_URL || process.env.VITE_SITE_URL || process.env.PUBLIC_URL);
  if (envUrl) return envUrl;

  // 2) GitHub Pages / Custom Domain via public/CNAME
  // Prioritize this over Vercel/Netlify default URLs to ensure sitemap uses the custom domain
  try {
    const cnamePath = path.join(__dirname, '..', 'public', 'CNAME');
    if (fs.existsSync(cnamePath)) {
      const domain = fs.readFileSync(cnamePath, 'utf8').trim();
      if (domain) return normalizeOrigin(`https://${domain}`);
    }
  } catch (_) {}

  // 3) Vercel preview/prod URL
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
  const vercel = normalizeOrigin(vercelUrl);
  if (vercel) return vercel;

  // 4) Netlify URL/DEPLOY_URL
  const netlify = normalizeOrigin(process.env.URL || process.env.DEPLOY_URL);
  if (netlify) return netlify;

  // Last-resort fallback
  return 'https://example.com';
}

const base = normalizeBase(BASE_PATH);
const origin = getOrigin();

// Static routes — add more as needed
const routes = [
  '',
  'about',
  'career',
  'contact',
  'courses',
  'projects',
  'projects/enroll',
  'student-registration',
  'student-login',
  'student-portal',
  'networking-beginner',
  'networking-intermediate',
  'networking-advanced',
  'devops-beginner',
  'genai-beginner',
  'genai-intermediate',
  'genai-advanced',
  'cyber-security-beginner',
  'cyber-security-intermediate',
  'cyber-security-advanced'
];

function buildUrl(pathname) {
  const clean = String(pathname || '').replace(/^\/+|\/+$/g, '');
  const pathPart = [base.replace(/^\/+|\/+$/g, ''), clean].filter(Boolean).join('/');
  const full = pathPart ? `${origin}/${pathPart}/` : `${origin}/`;
  return full;
}

function generateSitemap(urls) {
  const body = urls
    .map((u) => `  <url><loc>${u}</loc></url>`) // minimal sitemap
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function generateRobots(siteUrl) {
  const robotsPath = `${siteUrl}${base || '/'}sitemap.xml`;
  return `User-agent: *\nAllow: /\nSitemap: ${robotsPath}\n`;
}

(function main() {
  const urls = routes.map(buildUrl);
  const sitemap = generateSitemap(urls);
  const robots = generateRobots(origin);

  const publicDir = path.join(__dirname, '..', 'public');
  fs.mkdirSync(publicDir, { recursive: true });

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);

  console.log('[sitemap] Generated with origin:', origin, 'base:', base);
})();