(() => {
  const state = {
    board: createBoard(),
    tiles: {},
    actions: {},
  };

  // state.board = [
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  //   [3, 2, 0, 1],
  // ];
  // spawnTile(state, { x: 0, y: 3 }, 3);
  // spawnTile(state, { x: 1, y: 3 }, 2);
  // spawnTile(state, { x: 3, y: 3 }, 1);
  // spawnTile(state, { x: 2, y: 3 }, 1);
  //   state.board[2][3] = 3;
  // state.board[0][0] = 1;
  // state.board[0][1] = 1;
  // state.board[0][2] = 1;
  // state.board[0][3] = 1;
  spawnRandom(state);
  printBoard(state);
  // renderBoard(state);
  // moveLeft(state);
  // printBoard(state);
  //   rotateBoard(state);
  //   printBoard(state);
  // printBoard(state)

  document.addEventListener("keydown", (e) => keyPress(state, e));
})();

function keyPress(state, e) {
  state.actions = {};
  if (e.code == "ArrowLeft") {
    moveLeft(state);
  } else if (e.code == "ArrowRight") {
    moveRight(state);
  } else if (e.code == "ArrowUp") {
    moveUp(state);
  } else if (e.code == "ArrowDown") {
    moveDown(state);
  }
  console.clear();
  renderBoard(state);
  spawnRandom(state);
  printBoard(state);
  console.log(state.actions);
}

function moveRight(state) {
  rotateXTimes(state, 2);
  moveLeft(state);
  rotateXTimes(state, 2);
}

function moveDown(state) {
  rotateXTimes(state, 3);
  moveLeft(state);
  rotateXTimes(state, 1);
}

function moveUp(state) {
  rotateXTimes(state, 1);
  moveLeft(state);
  rotateXTimes(state, 3);
}

function renderBoard(state) {
  var b = document.getElementById("board");

  let newTiles = {};
  for (let i in state.tiles) {
    if (i in state.actions) {
      // debugger;
      let tile = state.tiles[i];
      let action = state.actions[i];
      let newPos = action.newPos;
      tile.innerHTML = state.board[newPos.y][newPos.x];
      console.log(newPos);
      anime({
        targets: tile,
        top: `${newPos.y * 50 + b.offsetTop}px`,
        left: `${newPos.x * 50 + b.offsetLeft}px`,
        complete: () => {
          if (action.combine) {
            console.log("combine!");
            tile.remove();
          }
        },
      });
      newTiles[posToNum(newPos, 4)] = tile;
    } else {
      let newPos = numToPos(i, 4);
      state.tiles[i].innerHTML = state.board[newPos.y][newPos.x];
      newTiles[i] = state.tiles[i];
    }
  }
  console.log(state.tiles, newTiles);
  state.tiles = newTiles;
}

function createBoard() {
  const board = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(0);
      //   row.push(i * 4 + j);
    }
    board.push(row);
  }
  return board;
}

function printBoard(state) {
  console.log("======");
  for (let row of state.board) {
    console.log(JSON.stringify(row));
  }
  console.log("======");
}

function spawnRandom(state) {
  let board = state.board;
  let positions = getOpenPositions(board);
  // Assume there is an open position
  let pos = positions[Math.floor(Math.random() * positions.length)];

  // Choose either 2 or 4
  let prob = 0.4;
  let newTile = Math.random() > prob ? 1 : 2;
  board[pos.y][pos.x] = newTile;

  spawnTile(state, pos, newTile);
}

function spawnTile(state, pos, val) {
  let div = document.createElement("div");
  let b = document.getElementById("board");
  div.classList.add("tile");
  div.style.top = `${pos.y * 50 + b.offsetTop}px`;
  div.style.left = `${pos.x * 50 + b.offsetLeft}px`;
  div.innerHTML = val;
  b.appendChild(div);
  state.tiles[posToNum(pos, 4)] = div;
}

function getOpenPositions(board) {
  let positions = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] == 0) {
        positions.push({ x: j, y: i });
      }
    }
  }
  return positions;
}

// Rotate it 90 degrees CCW
function rotateBoard(state) {
  let newBoard = [];
  let board = state.board;
  for (let y = 0; y < board.length; y++) {
    let row = [];
    for (let x = 0; x < board[y].length; x++) {
      let pos = rotatePositionLeft({ x, y }, 4);
      row.push(board[pos.y][pos.x]);
    }
    newBoard.push(row);
  }
  state.board = newBoard;
  let newActions = {};
  for (let i in state.actions) {
    let action = state.actions[i];
    let prevPos = numToPos(i, 4);
    let rotPrev = rotatePositionRight(prevPos, 4);
    newActions[posToNum(rotPrev, 4)] = {
      newPos: rotatePositionRight(action.newPos, 4),
      combine: action.combine,
    };
  }
  state.actions = newActions;
}

function posToNum(pos, boardSize) {
  return pos.y * boardSize + pos.x;
}

function numToPos(num, boardSize) {
  return { x: num % boardSize, y: Math.floor(num / boardSize) };
}

// Rotate position 90 degrees CCW
function rotatePositionLeft(pos, boardSize) {
  return { x: boardSize - pos.y - 1, y: pos.x };
}

// Rotate position 90 degrees CCW
function rotatePositionRight(pos, boardSize) {
  return { x: pos.y, y: boardSize - pos.x - 1 };
}

function rotateXTimes(state, n) {
  for (let i = 0; i < n; i++) {
    rotateBoard(state);
  }
}

function moveLeft(state) {
  for (let i = 0; i < state.board.length; i++) {
    compressLeft(state, i);
  }
}

function compressLeft(state, y) {
  let row = state.board[y];
  let lastPos = 0;
  for (let x = 0; x < row.length; x++) {
    if (y == 3) {
      // debugger;
    }
    if (lastPos == x) continue;
    let combine = false;
    //* item not 0
    if (row[x] != 0) {
      //* item mergable
      if (row[x] == row[lastPos]) {
        row[lastPos] += 1;
        row[x] = 0;
        combine = true;
        lastPos++;
      } else {
        // *item not mergable
        //* item moveable to last pos
        if (row[lastPos] == 0) {
          row[lastPos] = row[x];
          row[x] = 0;
        } else {
          //* item not moveable to last pos
          lastPos++;
          x--;
          continue;
        }
      }
      state.actions[posToNum({ x, y }, 4)] = {
        newPos: { x: lastPos, y },
        combine,
      };
    }
  }
}
