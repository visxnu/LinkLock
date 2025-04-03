chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const url = tabs[0].url;
  const statusElement = document.getElementById("status");
  
  // Show loading message
  statusElement.innerHTML = `<span style="color: #3498db;">Checking <b>${url}</b>...</span>`;

  fetch("https://linklock.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url }),
  })
  .then((response) => response.json())
  .then((data) => {
      if (data.is_phishing) {
          statusElement.innerHTML = `<span style="color: #e74c3c;"> Warning:This Site is ${data.phishing_probability}%</b> likely phishing site!</span>`;
      } else {
          statusElement.innerHTML = `<span style="color: #2ecc71;"> Safe: This Site is <b>${data.safe_probability}%</b> likely safe.</span>`;
      }
  })
  .catch((error) => {
      statusElement.innerHTML = `<span style="color: #e67e22;">Error: Could not check the URL. Please try again.</span>`;
      console.error(error);
  });
});
