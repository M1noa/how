const express = require('express');
const axios = require('axios');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_REPO = 'M1noa/how';

const darkBackground = '#080a1a';
const textColor = '#f1f1f1';
const linkColor = '#c9d3f1';
const font = 'Ubuntu, sans-serif';

// Middleware to log all requests
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url} | Request Method: ${req.method}`);
    next();
});

// Function to fetch raw Markdown content
async function fetchMarkdownContent(filePath) {
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${filePath}`;
    console.log(`Fetching content from: ${rawUrl}`);
    
    const response = await axios.get(rawUrl);
    return response.data;
}

// Middleware to serve index.html
app.get('/', async (req, res) => {
    try {
        const filePath = 'README.md'; // Use lowercase for consistency
        const markdownContent = await fetchMarkdownContent(filePath);
        const htmlContent = marked(markdownContent);
        const firstLine = extractFirstLine(markdownContent);
        
        res.send(`
            <html>
            <head>
                <title>README Files</title>
                <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400&display=swap" rel="stylesheet">
                <style>
                    body {
                        background-color: ${darkBackground};
                        color: ${textColor};
                        font-family: ${font};
                        text-shadow: 1px 1px 2px black;
                        padding: 20px;
                    }
                    h1 {
                        text-align: center;
                    }
                    a {
                        color: ${linkColor};
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
                <meta name="description" content="${firstLine}">
                <meta property="og:title" content="${filePath.replace('.md', '')}">
                <meta property="og:description" content="${firstLine}">
                <meta property="og:image" content="URL_TO_IMAGE"> <!-- Optional: Add an image URL if needed -->
                <meta property="og:url" content="http://localhost:${PORT}/${filePath.replace('.md', '')}">
                <meta property="og:type" content="website">
                <meta property="og:color" content="${linkColor}">
            </head>
            <body>
                <h1>${filePath}</h1>
                <div>${htmlContent}</div>
                <br>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error fetching README content:', error.message);
        res.status(500).send('Error fetching README content.');
    }
});

// Route to serve Markdown files as HTML
app.get('*', async (req, res) => {
    const filePath = req.params[0] + '.md';
    
    try {
        const markdownContent = await fetchMarkdownContent(filePath);
        const htmlContent = marked(markdownContent);
        const firstLine = extractFirstLine(markdownContent);
        
        res.send(`
            <html>
            <head>
                <title>${filePath}</title>
                <style>
                    body {
                        background-color: ${darkBackground};
                        color: ${textColor};
                        font-family: ${font};
                        text-shadow: 1px 1px 2px black;
                        padding: 20px;
                    }
                    h1, h2, h3, h4 {
                        color: ${textColor};
                    }
                    a {
                        color: ${linkColor};
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
                <meta name="description" content="${firstLine}">
                <meta property="og:title" content="${filePath.replace('.md', '')}">
                <meta property="og:description" content="${firstLine}">
                <meta property="og:image" content="URL_TO_IMAGE"> <!-- Optional: Add an image URL if needed -->
                <meta property="og:url" content="http://localhost:${PORT}/${filePath.replace('.md', '')}">
                <meta property="og:type" content="website">
                <meta property="og:color" content="${linkColor}">
            </head>
            <body>
                <h1>${filePath}</h1>
                <div>${htmlContent}</div>
                <br>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Error fetching Markdown content:', error.message);
        if (error.response && error.response.status === 404) {
            return res.status(404).send('File not found');
        }
        res.status(500).send('Error fetching Markdown content.');
    }
});

// Function to extract the first line from Markdown content
function extractFirstLine(markdown) {
    const firstLine = markdown.split('\n')[0].replace(/(^#+\s+|[\*\_\[\]\(\)])/g, '').trim();
    return firstLine;
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
