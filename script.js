const container = document.getElementById('container');
const totalSquares = 4;
const baseSize = 300;
const paddingStep = 30; // Increased spacing
const colors = ['#ffcccc', '#ccffcc', '#ccccff', '#ffe0b3'];
let squares = [];
let draggedId = null;

function createSquare(id) {
  const square = document.createElement('div');
  square.classList.add('square');
  square.id = 'square-' + id;
  square.setAttribute('draggable', true);
  square.style.backgroundColor = colors[id % colors.length];

  const label = document.createElement('div');
  label.classList.add('label');
  label.textContent = id + 1;
  square.appendChild(label);

  square.addEventListener('dragstart', () => {
    draggedId = id;
    setTimeout(() => (square.style.opacity = 0.4), 0);
  });

  square.addEventListener('dragend', () => {
    square.style.opacity = 1;
    draggedId = null;
  });

  return square;
}

function renderSquares(order) {
  container.innerHTML = '';
  order.forEach((id, index) => {
    const padding = paddingStep * index;
    const size = baseSize - padding * 2;
    const square = createSquare(id);
    square.style.width = size + 'px';
    square.style.height = size + 'px';
    square.style.top = `calc(50% - ${size / 2}px)`;
    square.style.left = `calc(50% - ${size / 2}px)`;
    container.appendChild(square);
  });
}

// Initial order
squares = [0, 1, 2, 3];
renderSquares(squares);

container.addEventListener('dragover', (e) => e.preventDefault());

container.addEventListener('drop', () => {
  if (draggedId !== null) {
    squares = [draggedId, ...squares.filter((id) => id !== draggedId)];
    renderSquares(squares);
  }
});
