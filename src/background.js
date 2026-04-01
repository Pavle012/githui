// Background script for GitHUI to bridge content scripts and native host

browser.runtime.onMessage.addListener((message, sender) => {
    return new Promise((resolve, reject) => {
        try {
            console.log("GitHUI Background: Connecting to native host...");
            const port = browser.runtime.connectNative("com.pavle.githui");

            port.onMessage.addListener((response) => {
                console.log("GitHUI Background: Received from native host:", response);
                resolve(response);
                port.disconnect();
            });

            port.onDisconnect.addListener((p) => {
                if (p.error) {
                    console.error("GitHUI Background: Native host disconnected with error:", p.error);
                    reject({ status: "error", message: p.error.message });
                } else {
                    console.log("GitHUI Background: Native host disconnected.");
                    // If we haven't resolved yet, it means no message was received
                    reject({ status: "error", message: "Native host disconnected without response" });
                }
            });

            port.postMessage(message);
        } catch (error) {
            console.error("GitHUI Background: Failed to connect to native host:", error);
            reject({ status: "error", message: error.message });
        }
    });
});
