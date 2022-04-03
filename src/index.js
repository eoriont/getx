// (() => {
const state = {
  board: createBoard(),
  tiles: {},
  tileAnims: [],
  actions: {},
};

spawnRandom(state);
spawnRandom(state);
// printBoard(state);

document.addEventListener("keydown", (e) => keyPress(state, e));
// })();

function keyPress(state, e) {
  state.actions = {};
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
  // printBoard(state);
  // console.log(state.actions);
}
