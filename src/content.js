function getRepoInfo() {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length < 3) return null;
    
    const user = pathParts[1];
    const repo = pathParts[2];
    return {
        user: user,
        repo: repo,
        cloneUrl: `https://github.com/${user}/${repo}.git`
    };
}

function injectButtons() {
    // Select selectors for the header/navigation area where buttons should go
    const searchTarget = '.file-navigation, .gh-header-actions, #js-repo-pjax-container .d-flex';
    const container = document.querySelector(searchTarget);

    if (!container) return;

    // Repo Info
    const repoInfo = getRepoInfo();
    if (!repoInfo) return;

    // 1. Inject GitHUI Commit Button
    if (!document.getElementById('githui-btn')) {
        const btn = document.createElement('button');
        btn.id = 'githui-btn';
        btn.innerHTML = '<span>GitHUI Commit</span>';
        btn.className = 'btn btn-sm btn-primary ml-2 d-inline-block';
        btn.style.verticalAlign = 'middle';

        btn.onclick = () => {
            const msg = prompt("Enter commit message for githui:");
            if (msg) {
                browser.runtime.sendMessage({ 
                    action: "commit", 
                    msg: msg 
                }).then(response => {
                    if (response && response.status) {
                        alert("GitHUI: " + response.status);
                    }
                }).catch(err => {
                    alert("Native Host Error: Ensure the background script and native host are properly configured.");
                    console.error(err);
                });
            }
        };
        container.appendChild(btn);
    }

    // 2. Inject Sync to PC Button
    if (!document.getElementById('githui-sync-btn')) {
        const syncBtn = document.createElement('button');
        syncBtn.id = 'githui-sync-btn';
        syncBtn.innerText = 'Sync to PC';
        syncBtn.className = 'btn btn-sm ml-2 d-inline-block';
        syncBtn.style.verticalAlign = 'middle';

        syncBtn.onclick = () => {
            browser.runtime.sendMessage({ 
                action: "sync", 
                repo_name: repoInfo.repo, 
                clone_url: repoInfo.cloneUrl 
            }).then(response => {
                if (response && response.status) {
                    alert(`GitHUI: Repo ${response.status} at ${response.path}`);
                }
            }).catch(err => {
                alert("Native Host Error: Ensure the background script and native host are properly configured.");
                console.error(err);
            });
        };
        container.appendChild(syncBtn);
    }
}

// GitHub uses PJAX/Turbo (it doesn't fully reload pages when you click folders)
// This observer watches for page changes to re-inject the buttons
const observer = new MutationObserver(() => injectButtons());
observer.observe(document.body, { childList: true, subtree: true });

// Initial run
injectButtons();