
const container = document.getElementById('container');
const baseSize = 300;
const paddingStep = 30;
const colors = ['#ffcccc', '#ccffcc', '#ccccff', '#ffe0b3'];
let squares = [0, 1, 2, 3]; // initial order
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

  square.addEventListener('dragover', (e) => e.preventDefault());

  square.addEventListener('drop', (e) => {
    e.stopPropagation();
    if (draggedId !== null && draggedId !== id) {
      const fromIndex = squares.indexOf(draggedId);
      const toIndex = squares.indexOf(id);
      [squares[fromIndex], squares[toIndex]] = [squares[toIndex], squares[fromIndex]];
      renderSquares(squares);
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

container.addEventListener('dragover', (e) => e.preventDefault());

container.addEventListener('drop', (e) => {
  if (draggedId !== null) {
    const squareElems = [...document.querySelectorAll('.square')];
    const rects = squareElems.map(el => el.getBoundingClientRect());
    const dropX = e.clientX;
    const dropY = e.clientY;

    let targetIndex = -1;
    rects.forEach((rect, i) => {
      if (dropX >= rect.left && dropX <= rect.right && dropY >= rect.top && dropY <= rect.bottom) {
        const id = parseInt(squareElems[i].id.split('-')[1]);
        if (id !== draggedId) {
          targetIndex = squares.indexOf(id);
        }
      }
    });

    const fromIndex = squares.indexOf(draggedId);
    if (targetIndex !== -1) {
      [squares[fromIndex], squares[targetIndex]] = [squares[targetIndex], squares[fromIndex]];
    } else {
      squares.splice(fromIndex, 1);
      squares.unshift(draggedId);
    }
    renderSquares(squares);
  }
});

renderSquares(squares);
