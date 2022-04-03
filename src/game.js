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
        newPos: { x: combine ? lastPos - 1 : lastPos, y },
        combine,
      };
    }
  }
}

function testActions(state, numRotations) {
  let s = copyState(state);
  rotateXTimes(s, numRotations);
  moveLeft(s);
  return Object.keys(s.actions).length > 0;
  // rotateXTimes(state, 4-numRotations);
}

// This is probably the dumbest code I've ever written
function copyState(state) {
  return JSON.parse(
    JSON.stringify({ board: state.board, actions: state.actions })
  );
}

function move(state, numRotations) {
  rotateXTimes(state, numRotations);
  moveLeft(state);
  rotateXTimes(state, 4 - numRotations);
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

function didLose(state) {
  if (!state.board.some((x) => x.includes(0))) {
    let actions1 = testActions(state, 0);
    let actions2 = testActions(state, 1);
    if (!actions1 && !actions2) {
      return true;
    }
  }
  return false;
}

function didWin(state) {
  return state.board.some((x) => x.includes(11));
}
