
const container = document.getElementById('container');
const totalSquares = 4;
const baseSize = 300;
const paddingStep = 30;
const colors = ['#ffcccc', '#ccffcc', '#ccccff', '#ffe0b3'];
let squares = [0, 1, 2, 3];

let squareElements = {};
let dragInfo = { id: null, offsetX: 0, offsetY: 0 };

function createSquare(id) {
  const div = document.createElement('div');
  div.className = 'square';
  div.id = `square-${id}`;
  div.style.backgroundColor = colors[id % colors.length];
  div.setAttribute('data-id', id);

  const label = document.createElement('div');
  label.className = 'label';
  label.innerText = id + 1;
  div.appendChild(label);

  container.appendChild(div);
  squareElements[id] = div;

  div.addEventListener('mousedown', (e) => {
    dragInfo.id = id;
    dragInfo.offsetX = e.offsetX;
    dragInfo.offsetY = e.offsetY;
    div.style.zIndex = 1000;
  });
}

function renderSquares() {
  container.innerHTML = '';
  squareElements = {};
  squares.forEach((id, i) => {
    createSquare(id);
    const square = squareElements[id];
    const padding = paddingStep * i;
    const size = baseSize - padding * 2;
    square.style.width = size + 'px';
    square.style.height = size + 'px';
    square.style.left = `calc(50% - ${size / 2}px)`;
    square.style.top = `calc(50% - ${size / 2}px)`;
  });
}

function getBounding(id) {
  return squareElements[id].getBoundingClientRect();
}

function isInside(inner, outer) {
  const a = getBounding(inner);
  const b = getBounding(outer);
  return (
    a.left >= b.left &&
    a.top >= b.top &&
    a.right <= b.right &&
    a.bottom <= b.bottom
  );
}

document.addEventListener('mousemove', (e) => {
  if (dragInfo.id !== null) {
    const el = squareElements[dragInfo.id];
    el.style.left = e.pageX - dragInfo.offsetX + 'px';
    el.style.top = e.pageY - dragInfo.offsetY + 'px';
  }
});

document.addEventListener('mouseup', () => {
  if (dragInfo.id !== null) {
    let targetId = null;
    const draggedId = dragInfo.id;
    const draggedEl = squareElements[draggedId];

    for (let id of squares) {
      if (id !== draggedId && isInside(draggedId, id)) {
        targetId = id;
        break;
      }
    }

    if (targetId !== null) {
      const i1 = squares.indexOf(draggedId);
      const i2 = squares.indexOf(targetId);
      [squares[i1], squares[i2]] = [squares[i2], squares[i1]];
    } else {
      const currentIdx = squares.indexOf(draggedId);
      if (currentIdx > 0) {
        [squares[currentIdx], squares[currentIdx - 1]] = [squares[currentIdx - 1], squares[currentIdx]];
      }
    }

    dragInfo.id = null;
    renderSquares();
  }
});

renderSquares();
