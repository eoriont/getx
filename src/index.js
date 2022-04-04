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

  if (state.lost) return;

  if (e.code == "ArrowLeft") {
    if (testActions(state, 0)) {
      moveLeft(state);
    } else {
      return;
    }
    // move(state, 0);
  } else if (e.code == "ArrowRight") {
    if (testActions(state, 2)) {
      move(state, 2);
    } else {
      return;
    }
  } else if (e.code == "ArrowUp") {
    if (testActions(state, 1)) {
      move(state, 1);
    } else {
      return;
    }
  } else if (e.code == "ArrowDown") {
    if (testActions(state, 3)) {
      move(state, 3);
    } else {
      return;
    }
  } else {
    return;
  }
  // console.clear();
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

  // printBoard(state);
  // console.log(state.actions);
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
  if (state.lost) return;

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff < 0) {
      if (testActions(state, 2)) {
        move(state, 2);
      }
    } else {
      if (testActions(state, 0)) {
        moveLeft(state);
      }
    }
  } else {
    if (yDiff < 0) {
      if (testActions(state, 3)) {
        move(state, 3);
      }
    } else {
      if (testActions(state, 1)) {
        move(state, 1);
      }
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
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
