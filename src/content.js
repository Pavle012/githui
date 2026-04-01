function injectButton() {
    // Find the 'Add file' button group on GitHub
    const fileHeader = document.querySelector('.file-navigation');

    if (fileHeader && !document.getElementById('githui-btn')) {
        const btn = document.createElement('button');
        btn.id = 'githui-btn';
        btn.innerText = 'GitHUI Commit';
        
        // These are GitHub's real CSS classes (Primer)
        btn.className = 'btn btn-sm btn-primary ml-2';
        
        btn.onclick = () => {
            const msg = prompt("Enter commit message:");
            if (msg) {
                let port = browser.runtime.connectNative("com.pavle.githui");
                port.postMessage({ action: "commit", msg: msg });
                
                port.onMessage.addListener((response) => {
                    alert("Status: " + response.status);
                });
            }
        };

        fileHeader.appendChild(btn);
    }
}

// Run the injection
injectButton();