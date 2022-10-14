/*
                          -> Board
Game -> BoardController -|
                          -> BoardDisplay
*/

// Player Factory
const Player = () => {
  let name = "";
  let mark = "";

  return { name, mark }
};

// Game Module 
const Game = (() => {
  // Establish DOM elements
  const playerDisplay = document.querySelector(".player");
  const messageBox = document.querySelector(".message");
  const vs = document.querySelector(".vs");
  const input = document.querySelector("input");
  const markButtons = document.querySelectorAll(".mark-button");
  const randomButton = document.querySelector(".random-button");
  const playAgainButton = document.querySelector('.play-again-button');
  
  // setup
  let player1 = Player();
  let player2 = Player();
  let _currentPlayer = player1;

  const start = () => {
    playerDisplay.textContent = "Player #1";
    messageBox.textContent = ", type your name below and press Enter."
    input.addEventListener("keydown", _inputName);
    markButtons.forEach((markButton) => {
      markButton.addEventListener("click", _chooseMark);
    });
    randomButton.addEventListener("click", _randomMark);
  };

  const _inputName = (event) => {
    if (event.key == "Enter") {  
      // Update value
      _currentPlayer.name = input.value;

      // Hide input
      input.value = "";
      input.classList.add("hidden");

      if (player2.mark) {
        _finalizeSetup();
      } else {
        messageBox.textContent = ", choose your mark or select random."
        playerDisplay.textContent = _currentPlayer.name;
        
        markButtons.forEach( markButton => { 
          markButton.classList.remove("hidden") 
        });
        randomButton.classList.remove("hidden");
      }
    }
  };

  const _chooseMark = (event) => {
    // Update value
    player1.mark = event.target.textContent;
    player2.mark = (player1.mark == "X" ? "O" : "X");

    // Switch back to input
    markButtons.forEach((markButton) => {
      markButton.classList.add("hidden");
    });
    randomButton.classList.add("hidden");
    input.classList.remove("hidden");

    playerDisplay.textContent = "Player #2"
    _currentPlayer = player2;
  }

  const _randomMark = () => {
    result = Math.floor(Math.random() * 2);
    player1.mark = (result ? "X" : "O")
    player2.mark = (result ? "O" : "X") 

    // Switch back to input
    markButtons.forEach((markButton) => {
      markButton.classList.add("hidden");
    });
    randomButton.classList.add("hidden");
    input.classList.remove("hidden");

    playerDisplay.textContent = "Player #2"
    _currentPlayer = player2;
  };

  const _finalizeSetup = () => {
    BoardController.setup();
    _currentPlayer = (player1.mark == "X" ? player1 : player2)
    playerDisplay.textContent = _currentPlayer.name;

    vs.textContent = `${player1.name} (${player1.mark}) vs. ${player2.name} (${player2.mark})`;
    vs.classList.remove("hidden");

    messageBox.textContent = `, it is your turn. You are ${_currentPlayer.mark}'s.`
  };

  // Gameplay utilities
  const getCurrentPlayer = () => {
    return _currentPlayer;
  }

  const nextTurn = () => {
    if (Board.isWin()) {
      win();
    } else if (Board.isTie()) {
      tie();
    } else {
      _switchPlayer();
      playerDisplay.textContent = _currentPlayer.name;
      messageBox.textContent = `, it is your turn. You are ${_currentPlayer.mark}'s.`
    }
  }

  const _switchPlayer = () => {
    if (_currentPlayer == player1) {
      _currentPlayer = player2
    } else {
      _currentPlayer = player1
    };

  }

  const win = () => {
    messageBox.textContent = " won!";

    BoardDisplay.removeListeners();
    playAgainButton.classList.remove("hidden");
    playAgainButton.addEventListener("click", playAgain);
  }

  const tie = () => {
    playerDisplay.textContent = "";
    messageBox.textContent = "It's a tie.";

    BoardDisplay.removeListeners();
    playAgainButton.classList.remove("hidden");
    playAgainButton.addEventListener("click", playAgain);
  }

  const playAgain = () => {
    playAgainButton.classList.add("hidden");
    BoardController.cleanUp();
    input.classList.remove("hidden");
    vs.classList.add("hidden");


    player1 = Player();
    player2 = Player();
    _currentPlayer = player1;
    start();
  }

  (function () {
    const resetButton = document.querySelector(".reset-button");
    resetButton.addEventListener("click", tie);
  })();

  return { start, getCurrentPlayer, nextTurn };
})();

// BoardController Module
const BoardController = (() => {
  const setup = () => {
    BoardDisplay.setListeners();
  }

  const processInput = (event) => {
    const position = _toPosition(event);
    if (Board.validate(position)) {
      Board.update(position);
      BoardDisplay.update(event);
      Game.nextTurn();
    }
  }

  const _toPosition = (event) => {
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

    return position;
  }

  const cleanUp = () => {
    Board.clear();
    BoardDisplay.clear();
  }

  return { setup, processInput, cleanUp }
})();

// Board Module
const Board = (() => {
  let array = Array(9).fill("");

  const clear = () => {
    array = Array(9).fill("");
  };

  const validate = (position) => {
    return !array[position];
  };
  
  const update = (position) => {
    array[position] = Game.getCurrentPlayer().mark
  };

  const isWin = () => {
    const playerMark = Game.getCurrentPlayer().mark;

    return _isHorizontalWin(playerMark) || _isVerticalWin(playerMark) || 
      _isDiagonalWin(playerMark);
  }

  const _isHorizontalWin = (playerMark) => {
    return (array[0] == playerMark && array[1] == playerMark && array[2] == playerMark) ||
    (array[3] == playerMark && array[4] == playerMark && array[5] == playerMark) ||
    (array[6] == playerMark && array[7] == playerMark && array[8] == playerMark);
  } 

  const _isVerticalWin = (playerMark) => {
    return (array[0] == playerMark && array[3] == playerMark && array[6] == playerMark) ||
    (array[1] == playerMark && array[4] == playerMark && array[7] == playerMark) ||
    (array[2] == playerMark && array[5] == playerMark && array[8] == playerMark)
  }

  const _isDiagonalWin = (playerMark) => {
    return (array[0] == playerMark && array[4] == playerMark && array[8] == playerMark) ||
    (array[2] == playerMark && array[4] == playerMark && array[6] == playerMark)
  }

  const isTie = () => {
    return !array.includes("");
  }

  return { clear, validate, update, isWin, isTie }
})();


// BoardDisplay Module
const BoardDisplay = (() => {
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

  const removeListeners = () => {
    for (let x = 1; x < 4; x++) {
      for (let y = 1; y < 4; y++) {
        const node = document.querySelector(`.row${x}.col${y}`);
        node.removeEventListener("click", BoardController.processInput);
      }
    }
  }

  const clear = () => {
    cells = document.querySelectorAll(".board-container div")
    cells.forEach( cell => { cell.textContent = "" } );
  }

  return { update, setListeners, removeListeners, clear }
})();

Game.start();
