// Send the current URL to the background script
chrome.runtime.sendMessage({ url: window.location.href });

// Listen for warning messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showWarning") {
    const warning = document.createElement("div");
    warning.style.position = "fixed";
    warning.style.top = "0";
    warning.style.left = "0";
    warning.style.width = "100%";
    warning.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
    warning.style.color = "white";
    warning.style.textAlign = "center";
    warning.style.padding = "10px";
    warning.style.zIndex = "10000";
    warning.style.fontFamily = "Arial, sans-serif";
    warning.textContent = `🚨 ALERT! This site is HIGHLY SUSPICIOUS! 🚨\n⚠️ ${message.phishing_prob}% chance it’s a PHISHING attempt!\n❗ Avoid entering personal information!`

    document.body.appendChild(warning);
  }
});