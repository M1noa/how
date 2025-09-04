document.addEventListener('DOMContentLoaded', () => {
    // Add copy buttons to code blocks
    addCopyButtonsToCodeBlocks();
    
    // Initialize syntax highlighting
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });
    
    // Add anchor navigation functionality
    addAnchorNavigation();
    
    // Handle hash navigation on page load
    handleHashNavigation();
});

function addCopyButtonsToCodeBlocks() {
    // Find all pre elements
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach((codeBlock) => {
        // Wrap the pre in a div for positioning
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block';
        codeBlock.parentNode.insertBefore(wrapper, codeBlock);
        wrapper.appendChild(codeBlock);
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        
        // Add click event to copy code
        copyButton.addEventListener('click', () => {
            const code = codeBlock.querySelector('code') ? 
                codeBlock.querySelector('code').innerText : 
                codeBlock.innerText;
            
            navigator.clipboard.writeText(code).then(() => {
                // Visual feedback
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                copyButton.textContent = 'Error!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            });
        });
        
        // Add button to wrapper
        wrapper.appendChild(copyButton);
    });
}

function addAnchorNavigation() {
    // Find all headers and add IDs based on their text content
    const headers = document.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6');
    
    headers.forEach((header) => {
        // Create an ID from the header text
        const id = header.textContent
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // remove special characters
            .replace(/\s+/g, '-') // replace spaces with hyphens
            .replace(/-+/g, '-') // replace multiple hyphens with single
            .replace(/^-|-$/g, ''); // remove leading/trailing hyphens
        
        if (id) {
            header.id = id;
            
            // Create anchor button
            const anchorButton = document.createElement('button');
            anchorButton.className = 'header-anchor';
            anchorButton.textContent = '#';
            anchorButton.setAttribute('aria-label', 'Copy link to header');
            
            // Add click event to copy URL and navigate
            anchorButton.addEventListener('click', (e) => {
                e.preventDefault();
                const url = window.location.origin + window.location.pathname + '#' + id;
                
                // Copy to clipboard
                navigator.clipboard.writeText(url).then(() => {
                    // Visual feedback
                    anchorButton.classList.add('copied');
                    setTimeout(() => {
                        anchorButton.classList.remove('copied');
                    }, 1000);
                    
                    // Navigate to the anchor
                    window.location.hash = id;
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                    // Fallback: just navigate to the anchor
                    window.location.hash = id;
                });
            });
            
            // Add button to header
            header.appendChild(anchorButton);
        }
    });
}

function handleHashNavigation() {
    // Check if there's a hash in the URL
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Small delay to ensure page is fully loaded
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
}