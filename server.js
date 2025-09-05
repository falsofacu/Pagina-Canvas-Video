import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// Trust proxy so req.ip gives real client IP
app.set("trust proxy", true);

// Get canvas state
app.get("/canvas", (req, res) => {
  const filePath = path.join(".", "public", "game", "canvas.json");

  try {
    const rawData = fs.readFileSync(filePath, "utf8");
    const loadedCanvas = JSON.parse(rawData);

    res.json({
      status: "ok",
      canvas: loadedCanvas,
    });
  } catch (err) {
    console.error("Error reading canvas:", err);
    return res.status(500).json({ error: "Failed to load canvas" });
  }
});

// Post rate limiting based on IP
const ipTimerFile = path.join(".", "public", "ip-timer.json");

function loadIpTimes() {
  if (fs.existsSync(ipTimerFile)) {
    return JSON.parse(fs.readFileSync(ipTimerFile, "utf8"));
  }
  return {};
}

function saveIpTimes(ipTimes) {
  fs.writeFileSync(ipTimerFile, JSON.stringify(ipTimes));
}

// Paint canvas with server-side cooldown
app.post("/canvas", (req, res) => {
  const filePath = path.join(".", "public", "game", "canvas.json");
  const ip = req.ip;
  const ipTimes = loadIpTimes();
  const currentTime = Date.now();
  const cooldown = 10000; // 10 seconds

  if (ipTimes[ip] && currentTime - ipTimes[ip] < cooldown) {
    return res.status(429).json({
      error: `Please wait before placing another pixel.`,
    });
  }

  try {
    // Load existing canvas state
    const rawData = fs.readFileSync(filePath, "utf8");
    const loadedCanvas = JSON.parse(rawData);
    // Update pixel
    const { x, y, color } = req.body;
    loadedCanvas[y][x] = color;
    // Save updated canvas state
    fs.writeFileSync(filePath, JSON.stringify(loadedCanvas));

    //Save the time of the last pixel placement
    ipTimes[ip] = currentTime;
    saveIpTimes(ipTimes);

    res.json({
      status: "ok",
    });
  } catch (err) {
    console.error("Error updating canvas:", err);
    return res.status(500).json({ error: "Failed to update canvas" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
