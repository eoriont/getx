function renderBoard(state) {
  var b = document.getElementById("board");

  let newTiles = {};

  // Finish all previous animations
  state.tileAnims.map((x) => x.seek(x.duration));
  state.tileAnims = [];

  // Make new animations
  for (let i in state.tiles) {
    let tileElm = state.tiles[i];
    if (i in state.actions) {
      // If tile has to go somewhere
      let action = state.actions[i];
      let newPos = action.newPos;
      let newNum = posToNum(newPos, 4);
      let newTile = state.board[newPos.y][newPos.x];

      setBackground(tileElm, newTile);
      state.tileAnims.push(
        anime({
          targets: tileElm,
          top: `${newPos.y * 50 + b.offsetTop}px`,
          left: `${newPos.x * 50 + b.offsetLeft}px`,
          easing: "easeOutExpo",
          // backgroundColor: getTileColor(newTile),

          duration: 200,
          complete: () => {
            if (action.combine) {
              tileElm.remove();
            }
          },
        })
      );
      if (!action.combine) {
        newTiles[newNum] = tileElm;
      }
    } else {
      let newPos = numToPos(i, 4);
      // state.tiles[i].innerHTML = state.board[newPos.y][newPos.x];
      let mergingToObj = Object.values(state.actions).find((x) => {
        return x.combine && posToNum(x.newPos, 4) == i;
      });
      let newTile = state.board[newPos.y][newPos.x];
      setBackground(tileElm, newTile);
      if (mergingToObj) {
        //* If something merges onto here
        state.tileAnims.push(
          anime({
            targets: tileElm,
            keyframes: [{ scale: 1.5 }, { scale: 1 }],
            easing: "easeOutExpo",
            duration: 100,
            complete: () => {},
          })
        );
      }
      newTiles[i] = state.tiles[i];
    }
  }
  state.tiles = newTiles;
}

function getTileColor(num) {
  return hslToHex((num / 11) * 360, 100, 50);
}

function getBackground(num) {
  const images = [
    "",
    'url("images/btc.png")',
    'url("images/eth.png")',
    'url("images/ltc.png")',
    'url("images/tether.png")',
    'url("images/ada.png")',
    'url("images/algo.png")',
    'url("images/xrp.png")',
    'url("images/xmr.png")',
    'url("images/tezos.png")',
    'url("images/bat.png")',
    'url("images/sol.png")',
    'url("images/doge.png)',
  ];

  return images[num];
}

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function spawnTile(state, pos, val) {
  let div = document.createElement("div");
  let b = document.getElementById("board");
  div.classList.add("tile");
  div.style.top = `${pos.y * 50 + b.offsetTop}px`;
  div.style.left = `${pos.x * 50 + b.offsetLeft}px`;
  setBackground(div, val);
  b.appendChild(div);
  state.tiles[posToNum(pos, 4)] = div;
  state.tileAnims.push(
    anime({
      targets: div,
      keyframes: [{ scale: 1.5 }, { scale: 1 }],
      easing: "easeOutExpo",
      duration: 100,
    })
  );
}

function setBackground(tileElm, val) {
  let back = getBackground(val);
  if (back) {
    tileElm.style.backgroundImage = back;
  } else {
    tileElm.style.backgroundColor = getTileColor(val);
  }
}
