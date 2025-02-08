const express = require('express');
const axios = require('axios');
const { marked } = require('marked');
const { createWriteStream } = require('fs');
const { get } = require('https');

const app = express();
const PORT = process.env.PORT || 3000;
const GITHUB_REPO = 'M1noa/how';

const darkBackground = '#22212a';
const textColor = '#f1f1f1';
const linkColor = '#c9d3f1';
const font = 'Ubuntu, sans-serif';
const codeBackground = '#4b4958'; // Background color for code blocks
const faviconUrl = 'https://cdn.discordapp.com/avatars/919656376807092304/1277c43f2298a39265c295e3d8ca883c.webp';

// Middleware to log all requests
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url} | Request Method: ${req.method}`);
    next();
});

// Serve favicon directly
app.get('/favicon.ico', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'image/webp' });
    get(faviconUrl, (response) => {
        response.pipe(res);
    });
});

// Function to fetch raw Markdown content
async function fetchMarkdownContent(filePath) {
    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/${filePath}`;
    console.log(`Fetching content from: ${rawUrl}`);
    
    const response = await axios.get(rawUrl);
    return response.data;
}

// Route to serve Markdown files as HTML
app.get('*', async (req, res) => {
    let filePath = req.params[0] + '.md';

    // If the path is just /, use README.md
    if (req.params[0] === '') {
        filePath = 'README.md';
    }
    // If the path is just /, use README.md
    if (req.params[0] === '/') {
        filePath = 'README.md';
    }
    
    try {
        const markdownContent = await fetchMarkdownContent(filePath);
        const htmlContent = marked(markdownContent);
        const firstLine = extractFirstLine(markdownContent);
        
        res.send(`
            <html>
            <head>
            <script type="text/javascript">
(function(window, document, dataLayerName, id) {
window[dataLayerName]=window[dataLayerName]||[],window[dataLayerName].push({start:(new Date).getTime(),event:"stg.start"});var scripts=document.getElementsByTagName('script')[0],tags=document.createElement('script');
function stgCreateCookie(a,b,c){var d="";if(c){var e=new Date;e.setTime(e.getTime()+24*c*60*60*1e3),d="; expires="+e.toUTCString();f="; SameSite=Strict"}document.cookie=a+"="+b+d+f+"; path=/"}
var isStgDebug=(window.location.href.match("stg_debug")||document.cookie.match("stg_debug"))&&!window.location.href.match("stg_disable_debug");stgCreateCookie("stg_debug",isStgDebug?1:"",isStgDebug?14:-1);
var qP=[];dataLayerName!=="dataLayer"&&qP.push("data_layer_name="+dataLayerName),isStgDebug&&qP.push("stg_debug");var qPString=qP.length>0?("?"+qP.join("&")):"";
tags.async=!0,tags.src="https://minoa.containers.piwik.pro/"+id+".js"+qPString,scripts.parentNode.insertBefore(tags,scripts);
!function(a,n,i){a[n]=a[n]||{};for(var c=0;c<i.length;c++)!function(i){a[n][i]=a[n][i]||{},a[n][i].api=a[n][i].api||function(){var a=[].slice.call(arguments,0);"string"==typeof a[0]&&window[dataLayerName].push({event:n+"."+i+":"+a[0],parameters:[].slice.call(arguments,1)})}}(i[c])}(window,"ppms",["tm","cm"]);
})(window, document, 'dataLayer', '04ac5a8b-f82b-4ef7-b602-07c42ca1f0da');
</script>
            <script defer src="https://cloud.umami.is/script.js" data-website-id="1aa208b9-94f3-498b-9a80-170a4e5bf62e"></script>
            <!-- Cloudflare Web Analytics --><script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "509a9fa178fb4b9081f3cf33e475fbab"}'></script><!-- End Cloudflare Web Analytics -->
            <!-- 100% privacy-first analytics -->
<script data-collect-dnt="true" async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
<noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true" alt="" referrerpolicy="no-referrer-when-downgrade"/></noscript>
                <title>${filePath}</title>
                <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400&display=swap" rel="stylesheet">
                <link href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400&display=swap" rel="stylesheet">
                <style>
                    body {
                        background-color: ${darkBackground};
                        color: ${textColor};
                        font-family: ${font};
                        text-shadow: 1px 1px 2px black;
                        padding: 20px;
                        opacity: 0;
                        animation: fadeIn 0.5s forwards;
                        animation-delay: 0.5s; /* Delay for the fade-in animation */
                    }
                    @keyframes fadeIn {
                        from {
                            transform: translateX(-20px);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    a {
                        color: ${linkColor};
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    pre {
                        background-color: ${codeBackground};
                        border-radius: 8px;
                        padding: 15px; /* Increased padding */
                        overflow: auto;
                        font-family: 'Ubuntu Mono', monospace;
                        position: relative;
                        white-space: nowrap; /* Prevent text wrapping */
                    }
                    code {
                        background-color: ${codeBackground};
                        border-radius: 4px;
                        padding: 2px 4px;
                        font-family: 'Ubuntu Mono', monospace;
                    }
                </style>
                <meta name="description" content="${firstLine}">
                <meta property="og:title" content="${filePath.replace('.md', '')}">
                <meta property="og:description" content="${firstLine}">
                <meta property="og:image" content="/favicon.ico">
                <meta property="og:url" content="http://localhost:${PORT}/${filePath.replace('.md', '')}">
                <meta property="og:type" content="website">
                <meta property="og:color" content="${linkColor}">
            </head>
            <body>
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
