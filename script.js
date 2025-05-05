const container = document.getElementById('container');
const totalSquares = 4;
const baseSize = 300;
const paddingStep = 30;
const colors = ['#ffcccc', '#ccffcc', '#ccccff', '#ffe0b3'];
let squares = [0, 1, 2, 3];

function createSquare(id) {
  const square = document.createElement('div');
  square.classList.add('square');
  square.id = 'square-' + id;
  square.dataset.squareId = id;
  square.style.backgroundColor = colors[id % colors.length];

  const label = document.createElement('div');
  label.classList.add('label');
  label.textContent = id + 1;
  square.appendChild(label);

  let offsetX = 0, offsetY = 0;
  let isDragging = false;

  square.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - square.getBoundingClientRect().left;
    offsetY = e.clientY - square.getBoundingClientRect().top;
    square.style.zIndex = 1000;
    square.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      square.style.left = `${e.clientX - offsetX}px`;
      square.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', (e) => {
    if (isDragging) {
      isDragging = false;
      square.style.transition = 'all 0.3s ease';
      square.style.zIndex = 1;

      const targetRect = square.getBoundingClientRect();

      // Check for overlap with other squares
      for (const otherSquare of container.children) {
        if (otherSquare === square) continue;
        const otherRect = otherSquare.getBoundingClientRect();

        if (isOverlapping(targetRect, otherRect)) {
          const id1 = parseInt(square.dataset.squareId);
          const id2 = parseInt(otherSquare.dataset.squareId);

          // Swap positions in order array
          const idx1 = squares.indexOf(id1);
          const idx2 = squares.indexOf(id2);
          [squares[idx1], squares[idx2]] = [squares[idx2], squares[idx1]];

          renderSquares(squares);
          return;
        }
      }

      // If not dropped on another square, re-render to reset position
      renderSquares(squares);
    }
  });

  return square;
}

function isOverlapping(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
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

renderSquares(squares);
