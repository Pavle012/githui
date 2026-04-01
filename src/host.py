import os
import subprocess

# Define your "Master" directory
BASE_DIR = os.path.expanduser("~/.githui-repos")
if not os.path.exists(BASE_DIR):
    os.makedirs(BASE_DIR)

def handle_sync(repo_name, clone_url):
    repo_path = os.path.join(BASE_DIR, repo_name)
    
    if os.path.exists(repo_path):
        # Already exists, just pull updates
        subprocess.run(["git", "-C", repo_path, "pull"], check=True)
        return {"status": "synced", "path": repo_path}
    else:
        # Clone it for the first time
        subprocess.run(["git", "clone", clone_url, repo_path], check=True)
        return {"status": "cloned", "path": repo_path}
