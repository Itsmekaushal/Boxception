const container = document.getElementById("container");
const totalSquares = 4;
const baseSize = 300;
const paddingStep = 30; // Increased spacing
const colors = ["#ffcccc", "#ccffcc", "#ccccff", "#ffe0b3"];
let squares = [0, 1, 2, 3]; // The order of squares
let draggedId = null;
let draggedSquare = null;
let draggingInside = false;

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
      if (!draggingInside) {
        swapSquares(draggedId, id);
      }
      renderSquares(squares);
    }
  });

  square.addEventListener("drag", (e) => {
    if (draggedSquare) {
      const rect = container.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - draggedSquare.clientWidth / 2;
      const offsetY = e.clientY - rect.top - draggedSquare.clientHeight / 2;

      // Prevent the square from moving outside the container
      const maxX = rect.width - draggedSquare.clientWidth;
      const maxY = rect.height - draggedSquare.clientHeight;

      draggedSquare.style.left = Math.min(Math.max(0, offsetX), maxX) + "px";
      draggedSquare.style.top = Math.min(Math.max(0, offsetY), maxY) + "px";
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
    // Swap positions in the array
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
