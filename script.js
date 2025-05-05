const container = document.getElementById("container");
const totalSquares = 4;
const baseSize = 300;
const paddingStep = 30;
const colors = ["#ffcccc", "#ccffcc", "#ccccff", "#ffe0b3"];
let squares = [0, 1, 2, 3];
let draggedId = null;
let draggedSquare = null;

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
    draggedSquare = square;
    square.style.opacity = 0.4;
    disableOtherSquares(id);
  });

  square.addEventListener("dragend", () => {
    draggedId = null;
    draggedSquare.style.opacity = 1;
    draggedSquare = null;
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

function swapSquares(draggedId, targetId) {
  const draggedIndex = squares.indexOf(draggedId);
  const targetIndex = squares.indexOf(targetId);
  if (draggedIndex !== -1 && targetIndex !== -1) {
    [squares[draggedIndex], squares[targetIndex]] = [squares[targetIndex], squares[draggedIndex]];
  }
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

container.addEventListener("drop", (e) => {
  e.preventDefault();
  if (draggedId !== null) {
    // If the dragged square is outside the nested structure
    const draggedIndex = squares.indexOf(draggedId);
    if (draggedIndex !== -1) {
      // Remove the dragged square from its current position
      squares.splice(draggedIndex, 1);
      // Add it as the outermost square
      squares.push(draggedId);
      renderSquares(squares);
    }
  }
});

// Initial render
renderSquares(squares);
