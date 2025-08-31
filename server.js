import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

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

// Save canvas state
app.post("/canvas", (req, res) => {
  const filePath = path.join(".", "public", "game", "canvas.json");

  try {
    // Load existing canvas state
    const rawData = fs.readFileSync(filePath, "utf8");
    const loadedCanvas = JSON.parse(rawData);
    // Update pixel
    const { x, y, color } = req.body;
    loadedCanvas[y][x] = color;
    // Save updated canvas state
    fs.writeFileSync(filePath, JSON.stringify(loadedCanvas));

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
