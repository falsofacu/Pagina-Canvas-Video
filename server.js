import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// Get canvas state
app.get("/canvas", (req, res) => {
  const filePath = path.join(".", "canvas.json");
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    res.json(JSON.parse(data));
  } else {
    res.json([]);
  }
});

// Save canvas state
app.post("/canvas", (req, res) => {
  console.log("POST /canvas received");
  console.log(req.body);

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
      canvas: loadedCanvas, // send back if needed
    });
  } catch (err) {
    console.error("Error updating canvas:", err);
    return res.status(500).json({ error: "Failed to update canvas" });
  }
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
