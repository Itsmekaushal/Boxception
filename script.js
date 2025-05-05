const container = document.getElementById("container");
const totalSquares = 4;
const baseSize = 300;
const paddingStep = 30;
const colors = ["#ffcccc", "#ccffcc", "#ccccff", "#ffe0b3"];
let squares = [0, 1, 2, 3];
let draggedId = null;

function createSquare(id) {
  const square = document.createElement("div");
  square.classList.add("square");
  square.id = "square-" + id;
  square.setAttribute("draggable", true);
  square.style.backgroundColor = colors[id % colors.length];

  const label = document.createElement("div");
  label.classList.add("label");
  label.textContent = id + 1;
  square.appendChild(label);

  square.addEventListener("dragstart", (e) => {
    draggedId = id;
    square.style.opacity = 0.4;
    disableOtherSquares(id);
  });

  square.addEventListener("dragend", () => {
    draggedId = null;
    square.style.opacity = 1;
    enableAllSquares();
  });

  square.addEventListener("dragover", (e) => e.preventDefault());

  square.addEventListener("drop", (e) => {
    e.stopPropagation();
    if (draggedId !== null && draggedId !== id) {
      const targetIndex = squares.indexOf(id);
      const draggedIndex = squares.indexOf(draggedId);
      [squares[draggedIndex], squares[targetIndex]] = [squares[targetIndex], squares[draggedIndex]];
      renderSquares(squares);
    }
  });

  return square;
}

function disableOtherSquares(currentId) {
  squares.forEach((id) => {
    if (id !== currentId) {
      document.getElementById("square-" + id)?.setAttribute("draggable", false);
    }
  });
}

function enableAllSquares() {
  squares.forEach((id) => {
    document.getElementById("square-" + id)?.setAttribute("draggable", true);
  });
}

function renderSquares(order) {
  container.innerHTML = "";
  order.forEach((id, index) => {
    const padding = paddingStep * index;
    const size = baseSize - padding * 2;
    const square = createSquare(id);
    square.style.width = size + "px";
    square.style.height = size + "px";
    square.style.top = `calc(50% - ${size / 2}px)`;
    square.style.left = `calc(50% - ${size / 2}px)`;
    container.appendChild(square);
  });
}

container.addEventListener("dragover", (e) => e.preventDefault());

container.addEventListener("drop", () => {
  if (draggedId !== null) {
    const draggedIndex = squares.indexOf(draggedId);
    if (draggedIndex !== 0) {
      // Move it one level outward (swap with previous)
      [squares[draggedIndex - 1], squares[draggedIndex]] = [squares[draggedIndex], squares[draggedIndex - 1]];
      renderSquares(squares);
    }
  }
});

// Initial render
renderSquares(squares);
