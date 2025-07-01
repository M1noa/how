const express = require('express');
const axios = require('axios');
const { marked } = require('marked');
const path = require('path');
const ejs = require('ejs');
const hljs = require('highlight.js');

const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_REPO = 'M1noa/how';
const BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:${PORT}`;
const faviconUrl = 'https://cdn.discordapp.com/avatars/919656376807092304/1277c43f2298a39265c295e3d8ca883c.webp';

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Configure marked
marked.setOptions({
    breaks: true,
    gfm: true,
    highlight: (code, lang) => {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    }
});

// Security and logging middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${req.ip}`);
    next();
});

// Cache for markdown content
const contentCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchMarkdownContent(filePath) {
    const cacheKey = filePath;
    const cached = contentCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`Cache hit for: ${filePath}`);
        return cached.content;
    }

    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${filePath}`;
    console.log(`Fetching content from: ${rawUrl}`);

    try {
        const response = await axios.get(rawUrl, {
            timeout: 10000,
            headers: { 'User-Agent': 'ReadmeHow-Bot/1.0' }
        });

        contentCache.set(cacheKey, {
            content: response.data,
            timestamp: Date.now()
        });

        return response.data;
    } catch (error) {
        console.error(`Error fetching ${filePath}:`, error.message);
        throw error;
    }
}

function extractDescription(markdown) {
    if (!markdown) return 'A dynamic README file viewer.';
    const firstParagraph = markdown.split('\n\n')[0];
    return firstParagraph.replace(/[^a-zA-Z0-9 .,!?'"-]/g, ' ').substring(0, 160);
}

// Function to fetch repository file tree
async function fetchRepoTree() {
    try {
        const response = await axios.get(`https://api.github.com/repos/${GITHUB_REPO}/git/trees/main?recursive=1`, {
            timeout: 10000,
            headers: { 'User-Agent': 'ReadmeHow-Bot/1.0' }
        });
        
        return response.data.tree.filter(item => 
            item.type === 'blob' && 
            item.path.endsWith('.md') &&
            !item.path.includes('node_modules') &&
            !item.path.includes('.git')
        );
    } catch (error) {
        console.error('Error fetching repo tree:', error.message);
        return [];
    }
}

// Sitemap route
app.get('/sitemap.xml', async (req, res) => {
    try {
        const files = await fetchRepoTree();
        const baseUrl = 'https://how.to.minoa.cat';
        
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        
        // Add homepage
        sitemap += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
        
        // Add all markdown files
        files.forEach(file => {
            const urlPath = file.path.replace('.md', '').replace('README', '');
            const cleanPath = urlPath.endsWith('/') ? urlPath.slice(0, -1) : urlPath;
            const url = cleanPath ? `${baseUrl}/${cleanPath}` : `${baseUrl}/`;
            
            // Skip duplicate homepage entries
            if (cleanPath !== '' && cleanPath !== 'README') {
                sitemap += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
            }
        });
        
        sitemap += `</urlset>`;
        
        res.set('Content-Type', 'application/xml');
        res.send(sitemap);
    } catch (error) {
        console.error('Error generating sitemap:', error.message);
        res.status(500).send('Error generating sitemap');
    }
});

// Main route
app.get('*', async (req, res) => {
    let filePath = (req.params[0] || '/').substring(1);
    if (!filePath || filePath.endsWith('/')) {
        filePath = (filePath || '') + 'README.md';
    } else {
        filePath += '.md';
    }

    try {
        const markdownContent = await fetchMarkdownContent(filePath);
        const htmlContent = marked(markdownContent);
        const pageTitle = path.basename(filePath, '.md');
        const description = extractDescription(markdownContent);

        res.render('layout', {
            title: pageTitle,
            description,
            content: htmlContent,
            url: `${BASE_URL}${req.path}`,
            faviconUrl,
            githubRepo: GITHUB_REPO,
            filePath
        });
    } catch (error) {
        const statusCode = error.response?.status === 404 ? 404 : 500;
        
        if (statusCode === 404) {
            // Use the custom 404.html page
            res.status(404).sendFile(path.join(__dirname, 'public/404.html'));
        } else {
            // For other errors, use the error template
            const title = '500 - Server Error';
            const message = 'An error occurred while fetching the content.';
            const suggestion = 'Check the URL or return to the <a href="/">homepage</a>.';

            res.status(500).render('layout', {
                title,
                description: 'An error occurred.',
                content: await ejs.renderFile(path.join(__dirname, 'views/error.ejs'), { title, statusCode: 500, message, suggestion }),
                url: `${BASE_URL}${req.path}`,
                faviconUrl,
                githubRepo: GITHUB_REPO,
                filePath: ''
            });
        }
    }
});

// Start the server with explicit IPv4 binding
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // For Vercel
