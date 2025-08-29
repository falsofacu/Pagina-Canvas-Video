import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

console.log("wwwww");

// Obtener estado del canvas
app.get("/canvas", (req, res) => {
  const filePath = path.join(".", "canvas.json");
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf-8");
    res.json(JSON.parse(data));
  } else {
    res.json([]); // si no existe, enviamos array vacío
  }
});

// Guardar estado del canvas
app.post("/canvas", (req, res) => {
  console.log("POST /canvas received");
  console.log(req.body); // ver qué está llegando

  const filePath = path.join(".", "canvas.json");
  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
  res.json({ status: "ok" });
});

app.listen(PORT, () =>
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
