/*
                          -> Board
Game -> BoardController -|
                          -> BoardDisplay
*/

// Player Factory
const Player = (mark) => {
  
  return { mark }
};

// Game Module 
const Game = (() => {
  let player1 = Player("X");
  let player2 = Player("O");
  let _currentPlayer = player1;

  const getCurrentPlayer = () => {
    return _currentPlayer;
  }

  const nextTurn = () => {
    switchPlayer();
  }

  const switchPlayer = () => {
    if (_currentPlayer == player1) {
      _currentPlayer = player2
    } else {
      _currentPlayer = player1
    }
  }

  const play = () => {
    BoardController.setup();
  }

  return { play, getCurrentPlayer, nextTurn };
})();

// BoardController Module
const BoardController = (() => {
  const setup = () => {
    Board.clear();
    BoardDisplay.setup();
  }

  const processInput = (event) => {
    const position = toPosition(event);
    if (Board.validate(position)) {
      Board.update(position);
      BoardDisplay.update(event);
      Game.nextTurn();
    }
  }

  const toPosition = (event) => {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    let position;
    switch (row) {
      case 1:
        position = row + col - 2;
        break;
      case 2:
        position = row + col;
        break;
      case 3:
        position = row + col + 2;
    };

    console.log(position);
    return position;
  }

  return { setup, processInput }
})();

// Board Module
const Board = (() => {
  let array;

  const clear = () => {
    array = Array(9).fill("");
  }

  const validate = (position) => {
    return !Boolean( array[position] )
  }
  
  const update = (position) => {
    array[position] = Game.getCurrentPlayer().mark
  }

  return { clear, validate, update }
})();


// BoardDisplay Module
const BoardDisplay = (() => {
  const setup = () => {
    cells = document.querySelectorAll(".board-container div");
    cells.forEach( cell => { cell.textContent = "" });

    setListeners();
  }
  
  const setListeners = () => {
    for (let x = 1; x < 4; x++) {
      for (let y = 1; y < 4; y++) {
        const node = document.querySelector(`.row${x}.col${y}`);
        node.addEventListener("click", BoardController.processInput);
      }
    }
  }

  const update = (event) => {
    const playerMark = Game.getCurrentPlayer().mark;
    event.target.textContent = playerMark;
  }

  return { setup, update }
})();

Game.play();
