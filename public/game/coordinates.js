const coordsElem = document.getElementById("coordinates");
const xCoordElem = document.getElementById("x-coordinate");
const yCoordElem = document.getElementById("y-coordinate");

// Get mouse coords over canvas
let posX = 0;
let posY = 0;

// Fixes issue where coordinates are not instantiated on mobile
canvas.addEventListener("pointerup", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  posX = Math.floor((e.clientX - rect.left) * scaleX);
  posY = Math.floor((e.clientY - rect.top) * scaleY);

  // Update HTML
  xCoordElem.innerHTML = posX;
  yCoordElem.innerHTML = posY;
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  posX = Math.floor((e.clientX - rect.left) * scaleX);
  posY = Math.floor((e.clientY - rect.top) * scaleY);

  // Update HTML
  xCoordElem.innerHTML = posX;
  yCoordElem.innerHTML = posY;
});

// Get last mouse coordinates on canvas
export function getLastMouseCoords() {
  return [posX, posY];
}
