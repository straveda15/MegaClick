import { spawn } from "child_process";
import axios from "axios";
import fs from "fs";
import path from "path";

/** Extract shortcode from any Instagram URL */
export const getInstagramShortcode = (url) => {
  if (!url) return null;
  const clean = url.split("?")[0].replace(/\/$/, "");
  const parts = clean.split("/").filter(Boolean);
  const idx = parts.findIndex((p) => ["reel", "reels", "p"].includes(p));
  return idx !== -1 ? parts[idx + 1] : null;
};

/** Fetch thumbnail from Instagram oEmbed */
export const fetchInstagramThumbnail = async (url) => {
  try {
    const res = await axios.get(
      `https://www.instagram.com/api/v1/oembed/?url=${encodeURIComponent(url)}&format=json`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1)" },
        timeout: 8000,
      }
    );
    return res.data?.thumbnail_url || null;
  } catch {
    return null;
  }
};

/** Download video via yt-dlp → Buffer */
export const downloadVideo = (url) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const ytDlpPath = "C:\\Users\\viraj\\AppData\\Local\\Microsoft\\WinGet\\Links\\yt-dlp.exe";
    
    // Path to cookies.txt in the backend root
    const cookiesPath = path.resolve(process.cwd(), "cookies.txt");

    // Check if cookies.txt exists (Required for Instagram to avoid rate-limits/blocks)
    if (!fs.existsSync(cookiesPath)) {
      return reject(new Error("cookies.txt not found. Please add a valid Instagram cookies file (Netscape format) to the backend root directory."));
    }
    
    /** 
     * NOTE: cookies.txt needs to be refreshed manually every few months.
     * Export it from your browser using an extension like "Get cookies.txt LOCALLY".
     */
    const proc = spawn(ytDlpPath, [
      "--format", "mp4/bestvideo+bestaudio/best",
      "--merge-output-format", "mp4",
      "--output", "-", 
      "--no-playlist",
      "--quiet",
      "--no-warnings",
      "--cookies", cookiesPath,
      url,
    ]);

    proc.stdout.on("data", (chunk) => chunks.push(chunk));
    let stderr = "";
    proc.stderr.on("data", (d) => { stderr += d.toString(); });

    proc.on("error", (err) => {
      reject(new Error(`Failed to start yt-dlp: ${err.message}`));
    });

    proc.on("close", (code) => {
      if (code === 0 && chunks.length > 0) {
        resolve(Buffer.concat(chunks));
      } else {
        reject(new Error(`yt-dlp exited with code ${code}. ${stderr.slice(0, 300)}`));
      }
    });
  });
};
