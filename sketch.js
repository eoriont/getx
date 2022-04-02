(() => {
    const state = {
        board: createBoard(),
        tiles: [],
        actions: {}
    }
    state.board[2][3] = 3
    // spawnRandom(state)
    printBoard(state)
    rotateBoard(state)
    printBoard(state)
    // printBoard(state)

    // document.addEventListener("keydown", e => keyPress(state, e))

    // anime({
    //     targets: '.css-selector-demo .el',
    //     translateX: 250
    // });
})()

function keyPress(state, e) {
    state.actions = {}
    if (e.code == "ArrowLeft") {
        moveLeft(state)
    } else if (e.code == "ArrowRight") {
        moveRight(state)
    } else if (e.code == "ArrowUp") {
        moveUp(state);
    } else if (e.code == "ArrowDown") {
        moveDown(state);
    }
    console.clear();
    spawnRandom(state)
    printBoard(state)
    console.log(state.actions)

}

function moveRight(state) {
    rotateXTimes(state, 2);
    moveLeft(state)
    rotateXTimes(state, 2);
}

function moveDown(state) {
    rotateXTimes(state, 3);
    moveLeft(state)
    rotateXTimes(state, 1);
}

function moveUp(state) {
    rotateXTimes(state, 1);
    moveLeft(state)
    rotateXTimes(state, 3);
}

function renderBoard(board) {
    var boardElm = document.getElementById("board");

    // anime({
    //     targets: '',
    //     translateX: 250
    //   });

}

function createBoard() {
    const board = []
    for (let i = 0; i < 4; i++) {
        let row = []
        for (let j = 0; j < 4; j++) {
            row.push(0)
            // row.push(i * 4 + j)
        }
        board.push(row)
    }
    return board;
}

function printBoard(state) {
    console.log("======")
    for (let row of state.board) {
        console.log(JSON.stringify(row))
    }
    console.log("======")
}

function spawnRandom(state) {
    let board = state.board
    let positions = getOpenPositions(board)
    // Assume there is an open position
    let pos = positions[Math.floor(Math.random() * positions.length)]

    // Choose either 2 or 4 
    let prob = 0.4
    let newTile = Math.random() > prob ? 1 : 2;
    board[pos.y][pos.x] = newTile;
}

function getOpenPositions(board) {
    let positions = []
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] == 0) {
                positions.push({ x: j, y: i });
            }
        }
    }
    return positions
}

// Rotate it 90 degrees CCW
function rotateBoard(state) {
    let newBoard = []
    let board = state.board
    for (let i = 0; i < board.length; i++) {
        let row = []
        for (let j = 0; j < board[i].length; j++) {
            let pos = rotatePosition(j, i, 4);
            // row.push(board[j][board[i].length - i - 1]);
            row.push(board[pos.y][pos.x])
        }
        newBoard.push(row)
    }
    state.board = newBoard;
    let newActions = {}
    for (let i in state.actions) {
        let action = state.actions[i]
        let prevPos = numToPos(i, 4);
        let rotPrev = rotatePosition(prevPos.x, prevPos.y, 4);
        let rotNew = rotatePosition(action[0], action[1], 4);
        newActions[rotPrev.y * 4 + rotPrev.x] = { newPos: [rotNew.x, rotNew.y], combine: action.combine }
    }
}

function posToNum(pos, boardSize) {
    return pos.y * boardSize + pos.x
}

function numToPos(num, boardSize) {
    return { x: num % boardSize, y: Math.floor(num / boardSize) }
}

// Rotate position 90 degrees CCW
function rotatePosition(x, y, boardSize) {
    return { x: y, y: boardSize - x - 1 }
}

function rotateXTimes(state, n) {
    for (let i = 0; i < n; i++) {
        rotateBoard(state)
    }
}

function moveLeft(state) {
    for (let i = 0; i < state.board.length; i++) {
        compressLeft(state, i)
    }
}

function compressLeft(state, i) {
    let row = state.board[i];
    let lastPos = 0
    for (let j = 0; j < row.length; j++) {
        if (lastPos == j) continue;
        if (row[j] != 0) {
            if (row[j] == row[lastPos]) {
                row[lastPos] += 1;
                row[j] = 0;
                lastPos++;
                state.actions[i * 4 + j] = { newPos: [i, lastPos], combine: true }
            } else {
                if (row[lastPos] == 0) {
                    row[lastPos] = row[j]
                    row[j] = 0;
                    state.actions[i * 4 + j] = { newPos: [i, lastPos], combine: false }
                } else {
                    lastPos++;
                    if (lastPos != j) {
                        row[lastPos] = row[j];
                        row[j] = 0;
                        state.actions[i * 4 + j] = { newPos: [i, lastPos], combine: true }
                    }
                }
            }
        }
    }
}

function replaceBoard(board, b) {
    for (let i = 0; i < board.length; i++) {
        board[i] = b[i]
    }
}