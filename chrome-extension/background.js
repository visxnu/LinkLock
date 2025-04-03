chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const url = message.url;
  
    fetch("https://linklock.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.is_phishing) {
          chrome.tabs.sendMessage(sender.tab.id, {
            action: "showWarning",
            url: url,
            phishing_prob: data.phishing_probability
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  });