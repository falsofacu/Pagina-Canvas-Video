import { isCooldownActive } from "./timer.js";
import { resetTimer } from "./timer.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Make canvas white
ctx.fillStyle = "#FFFFFF";
ctx.fillRect(0, 0, 160, 160);

//Get picked color
const colorInput = document.getElementById("color-input");
let pickedColor = colorInput.value;

colorInput.addEventListener("change", (e) => {
  pickedColor = e.target.value;
  ctx.fillStyle = pickedColor;
});

//Paint
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const posX = Math.floor((e.clientX - rect.left) * scaleX);
  const posY = Math.floor((e.clientY - rect.top) * scaleY);

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
