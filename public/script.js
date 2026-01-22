document
  .getElementById("downloadForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // 1. Get Elements
    const urlInput = document.getElementById("urlInput");
    const resultDiv = document.getElementById("result");
    const statusText = document.getElementById("status");
    const videoPlayer = document.getElementById("videoPlayer");
    const downloadLink = document.getElementById("downloadLink");
    const downloadBtn = downloadLink.querySelector("Button");
    const container = document.querySelector(".container");

    // 2. Reset UI State
    resultDiv.style.display = "block";
    statusText.innerText = "Connecting to the void...";
    statusText.style.color = "#b0b0b0"; 
    statusText.classList.remove("success-text");

    videoPlayer.classList.remove("show");
    downloadBtn.classList.remove("show");
    videoPlayer.pause(); 
    videoPlayer.src = "";

    downloadLink.classList.remove("show"); 
    container.classList.remove("success-mode"); 

    try {
      
      const response = await fetch("/get-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.value }),
      });

      const data = await response.json();

      
      if (data.status === "success") {
        
        statusText.innerText = "Artifact Extracted Successfully.";
        statusText.classList.add("success-text");

        
        container.classList.add("success-mode");

        
        videoPlayer.src = data.video_url;
        videoPlayer.classList.add("show");

        
        downloadLink.href = `/download-proxy?url=${encodeURIComponent(data.video_url)}`;
        downloadLink.classList.add("show");
        downloadBtn.classList.add("show");
      } else {
        statusText.innerText =
          "Error: " + (data.error || "The void returned nothing.");
        statusText.style.color = "#ff4d4d"; 
      }
    } catch (err) {
      console.error(err);
      statusText.innerText = "Critical Error: Server connection failed.";
      statusText.style.color = "#ff4d4d";
    }
  });


 
