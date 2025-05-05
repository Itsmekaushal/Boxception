const container = document.getElementById('container');
const baseSize = 300;
const paddingStep = 30;
const colors = ['#ffcccc', '#ccffcc', '#ccccff', '#ffe0b3'];

let squares = [0, 1, 2, 3]; // nesting order: index 0 = outermost

function createSquare(id) {
  const square = document.createElement('div');
  square.classList.add('square');
  square.dataset.squareId = id;
  square.style.backgroundColor = colors[id % colors.length];

  const label = document.createElement('div');
  label.classList.add('label');
  label.textContent = id + 1;
  square.appendChild(label);

  let offsetX = 0, offsetY = 0, isDragging = false;

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
    if (!isDragging) return;
    isDragging = false;
    square.style.zIndex = 1;
    square.style.transition = 'all 0.3s ease';

    const draggedId = parseInt(square.dataset.squareId);
    const draggedRect = square.getBoundingClientRect();
    let targetId = null;

    for (const other of container.children) {
      const otherId = parseInt(other.dataset.squareId);
      if (otherId === draggedId) continue;
      const otherRect = other.getBoundingClientRect();

      if (isOverlapping(draggedRect, otherRect)) {
        targetId = otherId;
        break;
      }
    }

    if (targetId !== null) {
      const idx1 = squares.indexOf(draggedId);
      const idx2 = squares.indexOf(targetId);
      [squares[idx1], squares[idx2]] = [squares[idx2], squares[idx1]];
    } else {
      // if dragged outside the outer boundary (i.e., dragged out of current nesting)
      const idx = squares.indexOf(draggedId);
      if (idx > 0) {
        [squares[idx], squares[idx - 1]] = [squares[idx - 1], squares[idx]];
      }
    }

    renderSquares(squares);
  });

  return square;
}

function isOverlapping(r1, r2) {
  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
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
