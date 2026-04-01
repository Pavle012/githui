function injectGitHui() {
    // GitHub often changes these, so we look for the "Add file" or "Code" button area
    const searchTarget = '.file-navigation, .gh-header-actions, #js-repo-pjax-container .d-flex';
    const container = document.querySelector(searchTarget);

    if (container && !document.getElementById('githui-btn')) {
        const btn = document.createElement('button');
        btn.id = 'githui-btn';
        btn.innerHTML = '<span>GitHUI Commit</span>'; // You can add an Octicon SVG here later

        // Using GitHub's official Primer CSS classes
        btn.className = 'btn btn-sm btn-primary ml-2 d-inline-block';
        btn.style.verticalAlign = 'middle';

        btn.onclick = () => {
            const msg = prompt("Enter commit message for githui:");
            if (msg) {
                try {
                    let port = browser.runtime.connectNative("com.pavle.githui");
                    port.postMessage({ action: "commit", msg: msg });
                    port.onMessage.addListener((response) => {
                        alert("GitHUI: " + response.status);
                    });
                } catch (e) {
                    alert("Native Host Error: Check your JSON manifest path.");
                }
            }
        };

        container.appendChild(btn);
        console.log("GitHUI: Button injected successfully!");
    }
}

// GitHub uses PJAX (it doesn't fully reload pages when you click folders)
// This observer watches for page changes to re-inject the button
const observer = new MutationObserver(() => injectGitHui());
observer.observe(document.body, { childList: true, subtree: true });

// Initial run
injectGitHui();