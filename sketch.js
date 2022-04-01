


(() => {
    const board = createBoard();

    spawnRandom(board)
    printBoard(board)

    document.addEventListener("keydown", e => keyPress(board, e))
})()

function keyPress(board, e) {

    if (e.code == "ArrowLeft") {
        moveLeft(board)
    } else if (e.code == "ArrowRight") {
        let b = rotateXTimes(board, 2);
        moveLeft(b)
        b = rotateXTimes(b, 2);
        replaceBoard(board, b);
    } else if (e.code == "ArrowUp") {
        let b = rotateXTimes(board, 1);
        moveLeft(b)
        b = rotateXTimes(b, 3);
        replaceBoard(board, b);
    } else if (e.code == "ArrowDown") {
        let b = rotateXTimes(board, 3);
        moveLeft(b)
        b = rotateXTimes(b, 1);
        replaceBoard(board, b);
    }
    console.clear();
    spawnRandom(board)
    printBoard(board)

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

function printBoard(board) {
    console.log("======")
    for (let row of board) {
        console.log(JSON.stringify(row))
    }
    console.log("======")
}

function spawnRandom(board) {
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
function rotateBoard(board) {
    let newBoard = []
    for (let i = 0; i < board.length; i++) {
        let row = []
        for (let j = 0; j < board[i].length; j++) {
            row.push(board[j][board[i].length - i - 1]);
        }
        newBoard.push(row)
    }
    return newBoard;
}

function rotateXTimes(board, n) {
    let b = board;
    for (let i = 0; i < n; i++) {
        b = rotateBoard(b);
    }
    return b;
}

function moveLeft(board) {
    for (let i = 0; i < board.length; i++) {
        compressLeft(board[i])
    }
}

function compressLeft(row) {
    let lastPos = 0
    for (let j = 0; j < row.length; j++) {
        if (lastPos == j) continue;
        if (row[j] != 0) {
            if (row[j] == row[lastPos]) {
                row[lastPos] += 1;
                row[j] = 0;
                lastPos++;
            } else {
                if (row[lastPos] == 0) {
                    row[lastPos] = row[j]
                    row[j] = 0;
                } else {
                    lastPos++;
                    if (lastPos != j) {
                        row[lastPos] = row[j];
                        row[j] = 0;
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