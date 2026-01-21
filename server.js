// server.js
const express = require("express");
const axios = require("axios");
const path = require("path");

// Robust import for the scraper library
const instagramLib = require("instagram-url-direct");
const instagramGetUrl = instagramLib.instagramGetUrl || instagramLib.default || instagramLib;

const app = express();
const PORT = process.env.PORT || 3000;

// Serve files from the 'public' folder
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- ROUTE 1: Get Video Info ---
app.post("/get-video", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    const links = await instagramGetUrl(url);

    if (links.url_list && links.url_list.length > 0) {
      return res.json({
        status: "success",
        video_url: links.url_list[0],
      });
    } else {
      return res
        .status(404)
        .json({ error: "No video found. Account might be private." });
    }
  } catch (error) {
    console.error("Scraping error:", error);
    return res.status(500).json({ error: "Failed to fetch video details." });
  }
});

// --- ROUTE 2: Download Proxy ---
app.get("/download-proxy", async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send("Error: No URL provided");
  }

  try {
    const response = await axios({
      url: videoUrl,
      method: "GET",
      responseType: "stream",
    });

    const filename = `unknown_realm_reel_${Date.now()}.mp4`;
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "video/mp4");

    response.data.pipe(res);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).send("Error downloading file.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
