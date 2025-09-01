import { isCooldownActive } from "./timer.js";
import { resetTimer } from "./timer.js";
import { updateTimer } from "./timer.js";
// import { getTimeLeft } from "./timer.js";
import { getLastMouseCoords } from "./coordinates.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const defaultFillStyle = document.getElementById("color-input").value;

// Load canvas.json
let loadedColorGrid = [];

fetch("./canvas.json")
  .then((response) => response.json())
  .then((data) => {
    loadedColorGrid = data;
    paintCanvasFromArr(loadedColorGrid);
  })
  .catch((err) => {
    console.log("Error loading canvas.json: " + err);
  });

// Load default canvas
function paintCanvasFromArr(colorGrid) {
  for (let i = 0; i <= 159; i++) {
    for (let j = 0; j <= 159; j++) {
      ctx.fillStyle = colorGrid[i][j];
      ctx.fillRect(j, i, 1, 1);
    }
  }
  // Reset fillStyle to default
  // Fixes a bug where the first painted pixel is the same color as the last pixel of canvas.json
  ctx.fillStyle = defaultFillStyle;
}

// Get picked color
const colorInput = document.getElementById("color-input");
let pickedColor = colorInput.value;

colorInput.addEventListener("change", (e) => {
  pickedColor = e.target.value;
  ctx.fillStyle = pickedColor;
});

// Paint a pixel on click
/*canvas.addEventListener("click", (e) => {
  const [posX, posY] = getLastMouseCoords();

  if (!isCooldownActive()) {
    resetTimer();
    // Paint pixel
    updatePixelOnServer(posX, posY, pickedColor);
    ctx.fillStyle = pickedColor;
    ctx.fillRect(posX, posY, 1, 1);
    console.log("x: " + posX + " y: " + posY + " color: " + pickedColor);
  } else {
    alert("Wait for cooldown");
  }
}); */

let startX, startY, moved;

canvas.addEventListener("pointerdown", (e) => {
  startX = e.clientX;
  startY = e.clientY;
  moved = false;
});

canvas.addEventListener("pointermove", (e) => {
  if (startX == null) return;

  const dragThreshold = 5; // Minimum distance in pixels to consider as a drag

  if (
    Math.abs(e.clientX - startX) > dragThreshold ||
    Math.abs(e.clientY - startY) > dragThreshold
  ) {
    moved = true;
  }
});

canvas.addEventListener("pointerup", (e) => {
  if (!moved) {
    const [posX, posY] = getLastMouseCoords();

    if (!isCooldownActive()) {
      updateTimer(); // Update timer display immediately
      resetTimer();
      // Paint pixel
      updatePixelOnServer(posX, posY, pickedColor);
      ctx.fillStyle = pickedColor;
      ctx.fillRect(posX, posY, 1, 1);
      console.log("x: " + posX + " y: " + posY + " color: " + pickedColor);
    } else {
      alert("Esperá loquito, falta un cacho");
      // Was going to use getTimeLeft() to show time left in alert, but I want to keep resource usage as low as possible
    }
  }
});

// Paint pixel on server
function updatePixelOnServer(x, y, color) {
  fetch("/canvas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ x, y, color }),
  })
    .then((response) => response.json())
    .catch((err) => console.error("Error updating pixel on server:", err));
}

// Read canvas.json
function fetchCanvasFromServer() {
  fetch("/canvas")
    .then((response) => response.json())
    .then((data) => {
      paintCanvasFromArr(data.canvas);
    })
    .catch((err) => {
      console.error("Error fetching canvas from server: " + err);
    });
}

// Refresh canvas every 5 seconds to get updates from other users
const refreshCanvasInterval = setInterval(() => {
  fetchCanvasFromServer();
}, 5000);

//Pan and zoom
const panzoom = Panzoom(canvas, {
  maxScale: 16,
  minScale: 2,
  canvas: true,
  overflow: "auto",
});
canvas.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (e.deltaY < 0) {
    panzoom.zoomIn();
  } else {
    panzoom.zoomOut();
  }
});
panzoom.setOptions({ cursor: "default" });
