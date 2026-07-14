import { marked } from 'marked';

const CONFIG = {
  github: { repo: 'M1noa/how', branch: 'main', userAgent: 'HowDoc/1.0' },
  site: { name: 'how.to.minoa.cat', url: 'https://how.to.minoa.cat' },
  favicon: 'https://cdn.discordapp.com/avatars/919656376807092304/1277c43f2298a39265c295e3d8ca883c.webp',
};

marked.setOptions({ breaks: true, gfm: true });

async function fetchMarkdown(path) {
  const url = `https://raw.githubusercontent.com/${CONFIG.github.repo}/${CONFIG.github.branch}/${path}`;
  const res = await fetch(url, { headers: { 'User-Agent': CONFIG.github.userAgent } });
  if (!res.ok) throw new Error(res.status === 404 ? 'Not Found' : `Fetch failed: ${res.status}`);
  return res.text();
}

async function fetchFileList() {
  const url = `https://api.github.com/repos/${CONFIG.github.repo}/git/trees/${CONFIG.github.branch}?recursive=1`;
  const res = await fetch(url, { headers: { 'User-Agent': CONFIG.github.userAgent } });
  if (!res.ok) throw new Error('GitHub API failed');
  const data = await res.json();
  return data.tree.filter(f => f.type === 'blob' && f.path.endsWith('.md') && !f.path.startsWith('.'));
}

function extractDescription(md) {
  const text = md.replace(/^#.*$/m, '').trim().split('\n\n')[0]?.replace(/[#*[\]`>|]/g, '')?.trim() || '';
  return text.substring(0, 200) || 'Documentation and resources by Minoa';
}

function fileNameToTitle(filePath) {
  const name = filePath.replace('.md', '').split('/').pop().replace('README', 'Home');
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function pathToFilePath(pathname) {
  const p = pathname.replace(/^\//, '');
  if (!p || p.endsWith('/')) return p ? `${p}README.md` : 'README.md';
  return `${p}.md`;
}

const OG_DESC = 'Curated collection of digital resources, guides, and tools. Software, gaming, media, OSINT, and more.';

function renderPage(title, description, content, filePath, files) {
  const isHome = filePath === 'README.md';
  const currentSlug = '/' + filePath.replace('.md', '');
  const allFiles = (files || []).filter(f => f.path !== 'README.md');

  const rootItems = allFiles.filter(f => !f.path.includes('/')).map(f => ({
    path: '/' + f.path.replace('.md', ''),
    title: fileNameToTitle(f.path),
    active: ('/' + f.path.replace('.md', '')) === currentSlug
  }));

  const dirGroups = {};
  allFiles.filter(f => f.path.includes('/')).forEach(f => {
    const dir = f.path.split('/')[0];
    if (!dirGroups[dir]) dirGroups[dir] = [];
    dirGroups[dir].push({
      path: '/' + f.path.replace('.md', ''),
      title: fileNameToTitle(f.path.split('/').slice(1).join('/')),
      active: ('/' + f.path.replace('.md', '')) === currentSlug
    });
  });

  function sidebarNav() {
    let html = '<a href="/" class="sidebar-link' + (isHome ? ' active' : '') + '">Home</a>';
    rootItems.forEach(n => { html += '<a href="' + n.path + '" class="sidebar-link' + (n.active ? ' active' : '') + '">' + n.title + '</a>'; });
    Object.keys(dirGroups).sort().forEach(dir => {
      html += '<div class="sidebar-group">' + fileNameToTitle(dir) + '</div>';
      dirGroups[dir].forEach(n => {
        html += '<a href="' + n.path + '" class="sidebar-link sidebar-indent' + (n.active ? ' active' : '') + '">' + n.title + '</a>';
      });
    });
    return html;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}${isHome ? '' : ' | how.to.minoa.cat'}</title>
<meta name="description" content="${isHome ? OG_DESC : description}">
<meta name="author" content="Minoa">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${CONFIG.site.url}/${isHome ? '' : filePath.replace('.md', '')}">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">

<meta property="og:type" content="website">
<meta property="og:url" content="${CONFIG.site.url}${filePath === 'README.md' ? '/' : '/' + filePath.replace('.md', '')}">
<meta property="og:site_name" content="how.to.minoa.cat">
<meta property="og:title" content="${title}${isHome ? '' : ' | how.to.minoa.cat'}">
<meta property="og:description" content="${isHome ? OG_DESC : description}">
<meta property="og:image" content="${CONFIG.favicon}">

<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="${title}${isHome ? '' : ' | how.to.minoa.cat'}">
<meta property="twitter:description" content="${isHome ? OG_DESC : description}">
<meta property="twitter:image" content="${CONFIG.favicon}">

<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebSite","name":"how.to.minoa.cat","url":"${CONFIG.site.url}","description":"Documentation and resources by Minoa","author":{"@type":"Person","name":"Minoa"}}
</script>
${isHome ? '' : `<script type="application/ld+json">
{"@context":"https://schema.org","@type":"WebPage","name":"${title}","url":"${CONFIG.site.url}/${filePath.replace('.md', '')}","isPartOf":{"@type":"WebSite","name":"how.to.minoa.cat","url":"${CONFIG.site.url}"},"description":"${description}"}
</script>`}

<meta name="theme-color" content="#ffb6c1">
<link rel="icon" type="image/webp" href="${CONFIG.favicon}">
<link rel="stylesheet" href="/css/style.css">
<script defer src="https://analytics.minoa.cat/script.js" data-website-id="fcaf3205-63ec-4918-bee3-aa42283926ef"></script>
</head>
<body>
<div class="noise-bg"></div>

<header class="header">
  <div class="header-inner">
    <a href="/" class="site-logo">how.to.minoa.cat</a>
    <div class="header-actions">
      <button class="header-action sidebar-toggle" id="sidebarToggle" aria-label="Toggle navigation">&#9776;</button>
    </div>
  </div>
</header>

<aside class="sidebar" id="sidebar">
  <div class="sidebar-header">
    <h2>Navigation</h2>
    <button class="sidebar-close" id="sidebarClose" aria-label="Close navigation">&times;</button>
  </div>
  <nav class="sidebar-nav">
    ${sidebarNav()}
  </nav>
  <div class="sidebar-footer">
    <a href="https://github.com/M1noa/how" target="_blank">GitHub</a>
    <a href="/sitemap.xml">Sitemap</a>
  </div>
</aside>
<div class="sidebar-overlay" id="sidebarOverlay"></div>

<main class="main${isHome ? ' home' : ''}">
  ${isHome ? '' : `<nav class="breadcrumb"><a href="/">Home</a> <span class="sep">/</span> <span>${fileNameToTitle(filePath)}</span></nav>`}
  <article class="markdown${isHome ? ' home-content' : ''}">
    ${content}
  </article>
  ${isHome ? '' : `<div class="edit-link"><a href="https://github.com/${CONFIG.github.repo}/blob/${CONFIG.github.branch}/${filePath}" target="_blank">Edit this page on GitHub</a></div>`}
</main>

<footer class="footer">
  <div class="footer-inner">
    <p>Made with ♥ by <a href="https://github.com/M1noa" target="_blank">Minoa</a></p>
    <nav class="footer-nav">
      <a href="/">Home</a>
      <a href="https://github.com/M1noa/how" target="_blank">GitHub</a>
    </nav>
  </div>
</footer>

<script src="/js/script.js"></script>
</body>
</html>`;
}

function render404() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>404 | how.to.minoa.cat</title>
<meta name="description" content="Page not found">
<meta name="robots" content="noindex, follow">
<meta property="og:title" content="404 | how.to.minoa.cat">
<meta property="og:description" content="Page not found">
<meta name="theme-color" content="#ffb6c1">
<link rel="icon" type="image/webp" href="${CONFIG.favicon}">
<link rel="stylesheet" href="/css/style.css">
<script defer src="https://analytics.minoa.cat/script.js" data-website-id="fcaf3205-63ec-4918-bee3-aa42283926ef"></script>
</head>
<body>
<div class="noise-bg"></div>
<header class="header">
  <div class="header-inner">
    <a href="/" class="site-logo">how.to.minoa.cat</a>
  </div>
</header>
<div class="error-page">
  <h1 class="error-code">404</h1>
  <pre class="error-cat">
 /\___/\\
(  o o  )
(  =^=  )
 (--m-m-)</pre>
  <p class="error-message">Page not found. The cat ate it.</p>
  <a href="/" class="error-btn">Return Home</a>
</div>
<footer class="footer">
  <div class="footer-inner">
    <p>Made with ♥ by <a href="https://github.com/M1noa" target="_blank">Minoa</a></p>
  </div>
</footer>
</body>
</html>`;
}

function renderError(msg) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Error | how.to.minoa.cat</title>
<meta name="description" content="Something went wrong">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#ffb6c1">
<link rel="icon" type="image/webp" href="${CONFIG.favicon}">
<link rel="stylesheet" href="/css/style.css">
</head>
<body>
<header class="header">
  <div class="header-inner">
    <a href="/" class="site-logo">how.to.minoa.cat</a>
  </div>
</header>
<div class="error-page">
  <p class="error-message">${msg}</p>
  <a href="/" class="error-btn">Return Home</a>
</div>
<footer class="footer">
  <div class="footer-inner">
    <p>Made with ♥ by <a href="https://github.com/M1noa" target="_blank">Minoa</a></p>
  </div>
</footer>
</body>
</html>`;
}

function generateSitemap(files) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n    <loc>${CONFIG.site.url}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
  for (const f of files) {
    if (f.path === 'README.md') continue;
    const loc = `${CONFIG.site.url}/${f.path.replace('.md', '')}`;
    xml += `  <url>\n    <loc>${loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }
  xml += `</urlset>`;
  return xml;
}

function securityHeaders() {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://analytics.minoa.cat; connect-src 'self' https://raw.githubusercontent.com https://api.github.com;",
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const headers = { ...securityHeaders() };

    try {
      // Try to serve from static assets first (excluding sitemap.xml and robots.txt which we generate dynamically)
      if (env.ASSETS && path !== '/sitemap.xml' && path !== '/robots.txt') {
        const assetResponse = await env.ASSETS.fetch(request);
        if (assetResponse.ok) {
          return assetResponse;
        }
      }

      let body, contentType, cacheControl;

      if (path === '/sitemap.xml') {
        const files = await fetchFileList();
        body = generateSitemap(files);
        contentType = 'application/xml';
        cacheControl = 'public, max-age=86400, s-maxage=604800';
      } else if (path === '/robots.txt') {
        body = `User-agent: *\nAllow: /\nSitemap: ${CONFIG.site.url}/sitemap.xml\n`;
        contentType = 'text/plain';
        cacheControl = 'public, max-age=86400';
      } else {
        let filePath = pathToFilePath(path);
        let files;

        try { files = await fetchFileList(); } catch (_) { files = []; }

        let md = await fetchMarkdown(filePath).catch(async () => {
          const match = files.find(f => f.path.toLowerCase() === filePath.toLowerCase());
          if (match) {
            filePath = match.path;
            return fetchMarkdown(filePath);
          }
          throw new Error('Not Found');
        });

        const html = marked.parse(md);
        const title = fileNameToTitle(filePath);
        const desc = extractDescription(md);
        body = renderPage(title, desc, html, filePath, files);
        contentType = 'text/html; charset=utf-8';
        cacheControl = 'public, max-age=3600, s-maxage=86400';
      }

      return new Response(body, {
        status: 200,
        headers: {
          ...headers,
          'Content-Type': contentType,
          'Cache-Control': cacheControl,
        }
      });

    } catch (err) {
      if (err.message === 'Not Found') {
        return new Response(render404(), {
          status: 404,
          headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      console.error('Worker error:', err);
      return new Response(renderError('Something went wrong fetching that page.'), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' }
      });
    }
  }
};
