document.addEventListener('DOMContentLoaded', () => {
    // Add copy buttons to code blocks
    addCopyButtonsToCodeBlocks();
    
    // Initialize syntax highlighting
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });
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