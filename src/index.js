// (() => {
let state = newState();

spawnRandom(state);
spawnRandom(state);
// printBoard(state);

document.addEventListener("keydown", (e) => keyPress(state, e));
document.getElementById("restart").addEventListener("mousedown", (e) => {
  hideGameResult(state);
  renderScore(state.score, -state.score);
  purgeBoard(state);
  state = newState();
  spawnRandom(state);
  spawnRandom(state);
  renderBoard(state);
});
document.addEventListener("touchstart", handleTouchStart, false);
document.addEventListener("touchmove", (e) => handleTouchMove(e, state), false);

// })();

function keyPress(state, e) {
  if (e.code == "KeyE") {
    showLost(state);
  } else if (e.code == "KeyR") {
    showWin(state);
  } else if (e.code == "KeyY") {
    anime({
      targets: "#board div",
      keyframes: [{ scale: 1.4 }, { scale: 1 }],
      delay: anime.stagger(100, { grid: [4, 4], from: "center" }),
      duration: 500,
    });
    // anime({
    //   targets: "#board",
    //   keyframes: [{ translateX: 250 }, { translateX: 0 }],
    // });
  }
  if (e.code == "ArrowLeft" || e.code == "KeyA") {
    moveDir(state, "left");
  } else if (e.code == "ArrowRight" || e.code == "KeyD") {
    moveDir(state, "right");
  } else if (e.code == "ArrowUp" || e.code == "KeyW") {
    moveDir(state, "up");
  } else if (e.code == "ArrowDown" || e.code == "KeyS") {
    moveDir(state, "down");
  } else {
    return;
  }
}

function showLost(state) {
  let lostdiv = document.getElementById("losttext");
  anime({
    targets: lostdiv,
    opacity: 1,
    rotate: "1turn",
  });
}

function showWin(state) {
  let windiv = document.getElementById("windiv");
  anime({
    targets: windiv,
    opacity: 1,
    rotate: "1turn",
  });
}

function hideGameResult(state) {
  let windiv = document.getElementById("windiv");
  anime({
    targets: windiv,
    opacity: 0,
    rotate: "0turn",
  });

  let lostdiv = document.getElementById("losttext");
  anime({
    targets: lostdiv,
    opacity: 0,
    rotate: "0turn",
  });
}

function getTouches(evt) {
  return evt.touches;
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

// Necessary globals
var xDown = null;
var yDown = null;
function handleTouchMove(evt, state) {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff < 0) {
      moveDir(state, "right");
    } else {
      moveDir(state, "left");
    }
  } else {
    if (yDiff < 0) {
      moveDir(state, "down");
    } else {
      moveDir(state, "up");
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}

function moveDir(state, dir) {
  if (state.lost) return;

  let moved = false;
  if (dir == "left") {
    if (testActions(state, 0)) {
      moveLeft(state);
      moved = true;
    }
  } else if (dir == "right") {
    if (testActions(state, 2)) {
      move(state, 2);
      moved = true;
    }
  } else if (dir == "up") {
    if (testActions(state, 1)) {
      move(state, 1);
      moved = true;
    }
  } else if (dir == "down") {
    if (testActions(state, 3)) {
      move(state, 3);
      moved = true;
    }
  }

  if (!moved) return;

  renderBoard(state);
  spawnRandom(state);
  state.actions = {};

  if (didWin(state)) {
    state.won = true;
    showWin(state);
  } else if (didLose(state)) {
    state.lost = true;
    showLost(state);
  }
}
