# ReadmeHow - Modern Dynamic README Viewer

A beautiful, responsive web application that transforms GitHub markdown files into stunning HTML pages with modern UI/UX design.

## ✨ Features

- **🎨 Modern Design**: Beautiful gradient backgrounds, smooth animations, and responsive layout
- **📱 Mobile-First**: Fully responsive design that works perfectly on all devices
- **⚡ Fast Performance**: Intelligent caching system and optimized loading
- **🔒 Secure**: Built-in security headers and XSS protection
- **📋 Copy Code**: One-click code copying from code blocks
- **🔍 SEO Optimized**: Proper meta tags and Open Graph support
- **♿ Accessible**: WCAG compliant with keyboard navigation support
- **🌙 Dark Theme**: Eye-friendly dark theme with beautiful color scheme

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/M1noa/how.git
cd how

# Install dependencies
npm install

# Start the server
npm start
```

Visit `http://localhost:3000` to see your README files rendered beautifully!

## 📖 How It Works

1. **Dynamic Routing**: Any path like `/docs/api` automatically looks for `docs/api.md` in your GitHub repository
2. **Smart Caching**: Frequently accessed files are cached for better performance
3. **Error Handling**: Beautiful 404 and error pages with helpful suggestions
4. **Breadcrumb Navigation**: Easy navigation through your documentation structure

## 🛠️ Configuration

Update the `GITHUB_REPO` variable in `index.js` to point to your repository:

```javascript
const GITHUB_REPO = 'your-username/your-repo';
```

## 🎨 Customization

The theme can be easily customized by modifying the `theme` object in `index.js`:

```javascript
const theme = {
    primary: '#1a1a2e',
    secondary: '#16213e',
    accent: '#0f3460',
    text: '#e94560',
    // ... more colors
};
```

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Deploy automatically with the included `vercel.json` configuration

### Other Platforms

The application works on any Node.js hosting platform:

- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## 🔧 Technical Stack

- **Backend**: Node.js + Express
- **Markdown**: Marked.js with GitHub Flavored Markdown
- **Styling**: Modern CSS with CSS Variables
- **Fonts**: Inter + JetBrains Mono
- **Analytics**: Umami, Cloudflare, Simple Analytics

## 📄 License

MIT License - feel free to use this project for your own documentation needs!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Made with ❤️ for better documentation experiences**