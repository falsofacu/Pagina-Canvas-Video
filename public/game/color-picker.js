const colorBtns = document.querySelectorAll(".color-btn");
const colorInput = document.getElementById("color-input");

colorBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const color = button.getAttribute("data-color");
    console.log("Color picked: " + color);
    colorInput.value = color;
    colorInput.dispatchEvent(new Event("change")); // Trigger change event
  });
});
