const container = document.getElementById('container');
const totalSquares = 4;
const baseSize = 300;
const paddingStep = 30;
const colors = ['#ffcccc', '#ccffcc', '#ccccff', '#ffe0b3'];
let squares = [];

function createSquare(id) {
  const square = document.createElement('div');
  square.classList.add('square');
  square.id = 'square-' + id;
  square.style.backgroundColor = colors[id % colors.length];

  const label = document.createElement('div');
  label.classList.add('label');
  label.textContent = id + 1;
  square.appendChild(label);

  // Dragging logic
  let offsetX, offsetY, isDragging = false;

  square.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - square.getBoundingClientRect().left;
    offsetY = e.clientY - square.getBoundingClientRect().top;
    square.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    square.style.left = `${e.clientX - offsetX}px`;
    square.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      square.style.transition = 'all 0.3s ease';
    }
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
