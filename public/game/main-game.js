import { isCooldownActive } from "./timer.js";
import { resetTimer } from "./timer.js";
import { getLastMouseCoords } from "./coordinates.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Load canvas.json
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

//Load default canvas
function paintCanvasFromArr(colorGrid) {
  for (let i = 0; i <= 159; i++) {
    for (let j = 0; j <= 159; j++) {
      ctx.fillStyle = colorGrid[i][j];
      ctx.fillRect(j, i, 1, 1);
    }
  }
}

//Get picked color
const colorInput = document.getElementById("color-input");
let pickedColor = colorInput.value;

colorInput.addEventListener("change", (e) => {
  pickedColor = e.target.value;
  ctx.fillStyle = pickedColor;
});

//TODO: Change canvas.json on paint
//Paint a pixel on click
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  // const posX = 0;
  // const posY = 0;
  const [posX, posY] = getLastMouseCoords();

  // Check if cooldown is active before painting
  if (!isCooldownActive()) {
    resetTimer();
    ctx.fillRect(posX, posY, 1, 1);
    console.log("x: " + posX + "y: " + posY);
    console.log("painted");
  } else {
    console.log("Wait for cooldown");
  }
});
