const express = require('express');
const axios = require('axios');
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_REPO = 'M1noa/how';

const darkBackground = '#02131f';
const textColor = '#f1f1f1';
const linkColor = '#c9d3f1';
const font = 'Ubuntu, sans-serif';

// Function to fetch raw Markdown content
async function fetchMarkdownContent(filePath) {
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${filePath}`;
    const response = await axios.get(rawUrl);
    return response.data;
}
// Middleware to serve index.html
app.get('/', async (req, res) => {
    try {
        const filePath = 'readme.md';
        const markdownContent = await fetchMarkdownContent(filePath);
        const htmlContent = marked(markdownContent);
        
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
            </head>
            <body>
                <h1>${filePath}</h1>
                <div>${htmlContent}</div>
                <br>
                <a href="/">Back to home</a>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Error fetching README content.');
    }
});

// Route to serve Markdown files as HTML
app.get('*', async (req, res) => {
    const filePath = req.params[0] + '.md';
    
    try {
        const markdownContent = await fetchMarkdownContent(filePath);
        const htmlContent = marked(markdownContent);
        
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
            </head>
            <body>
                <h1>${filePath}</h1>
                <div>${htmlContent}</div>
                <br>
                <a href="/">Back to home</a>
            </body>
            </html>
        `);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).send('File not found');
        }
        res.status(500).send('Error fetching Markdown content.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
