// ----- Cell and Gameboard logic -----
function Cell() {
  let value = 0;
  return {
    addToken: (player) => { value = player; },
    getValue: () => value
  };
}

function Gameboard() {
  const rows = 6;
  const columns = 7;
  const board = [];
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (column, player) => {
    const availableCells = board
      .filter(row => row[column].getValue() === 0)
      .map(row => row[column]);
    if (!availableCells.length) return false;

    const lowestRow = availableCells.length - 1;
    board[lowestRow][column].addToken(player);
    return lowestRow; // return the row where token landed
  };

  return { getBoard, dropToken };
}

// ----- Winner check functions -----
function checkHorizontal(boardValues, playerToken) {
  for (let row = 0; row < boardValues.length; row++) {
    for (let col = 0; col < boardValues[row].length - 3; col++) {
      if (boardValues[row][col] === playerToken &&
          boardValues[row][col + 1] === playerToken &&
          boardValues[row][col + 2] === playerToken &&
          boardValues[row][col + 3] === playerToken) return true;
    }
  }
  return false;
}

function checkVertical(boardValues, playerToken) {
  for (let col = 0; col < boardValues[0].length; col++) {
    for (let row = 0; row < boardValues.length - 3; row++) {
      if (boardValues[row][col] === playerToken &&
          boardValues[row + 1][col] === playerToken &&
          boardValues[row + 2][col] === playerToken &&
          boardValues[row + 3][col] === playerToken) return true;
    }
  }
  return false;
}

function checkDiagonalDR(boardValues, playerToken) {
  for (let row = 0; row < boardValues.length - 3; row++) {
    for (let col = 0; col < boardValues[row].length - 3; col++) {
      if (boardValues[row][col] === playerToken &&
          boardValues[row + 1][col + 1] === playerToken &&
          boardValues[row + 2][col + 2] === playerToken &&
          boardValues[row + 3][col + 3] === playerToken) return true;
    }
  }
  return false;
}

function checkDiagonalDL(boardValues, playerToken) {
  for (let row = 0; row < boardValues.length - 3; row++) {
    for (let col = 3; col < boardValues[row].length; col++) {
      if (boardValues[row][col] === playerToken &&
          boardValues[row + 1][col - 1] === playerToken &&
          boardValues[row + 2][col - 2] === playerToken &&
          boardValues[row + 3][col - 3] === playerToken) return true;
    }
  }
  return false;
}

function checkWinner(boardValues, playerToken) {
  return checkHorizontal(boardValues, playerToken) ||
         checkVertical(boardValues, playerToken) ||
         checkDiagonalDR(boardValues, playerToken) ||
         checkDiagonalDL(boardValues, playerToken);
}

// ----- GameController -----
function GameController(playerOneName, playerTwoName) {
  const board = Gameboard();
  const players = [
    { name: playerOneName, token: 1 },
    { name: playerTwoName, token: 2 }
  ];
  let activePlayer = players[0];
  let gameOver = false;

  const gameBoardDiv = document.getElementById('game-board');
  const statusDiv = document.getElementById('status');

  // Create the HTML grid
  const renderBoard = () => {
    gameBoardDiv.innerHTML = '';
    const boardValues = board.getBoard().map(row => row.map(cell => cell.getValue()));

    for (let r = 0; r < boardValues.length; r++) {
      for (let c = 0; c < boardValues[r].length; c++) {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        if (boardValues[r][c] === 1) cellDiv.classList.add('player1');
        if (boardValues[r][c] === 2) cellDiv.classList.add('player2');
        cellDiv.dataset.col = c;
        gameBoardDiv.appendChild(cellDiv);
      }
    }
  };

  const handleClick = (e) => {
    if (gameOver) return;
    const column = parseInt(e.target.dataset.col);
    if (isNaN(column)) return;

    const rowDropped = board.dropToken(column, activePlayer.token);
    if (rowDropped === false) return; // column full

    renderBoard();

    const boardValues = board.getBoard().map(row => row.map(cell => cell.getValue()));
    if (checkWinner(boardValues, activePlayer.token)) {
      statusDiv.textContent = `${activePlayer.name} wins! 🎉`;
      gameOver = true;
      return;
    }

    // Switch player
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
    statusDiv.textContent = `${activePlayer.name}'s turn`;
  };

  gameBoardDiv.addEventListener('click', handleClick);
  renderBoard();
  statusDiv.textContent = `${activePlayer.name}'s turn`;
}

// ----- Start game after player names -----
document.getElementById('start-btn').addEventListener('click', () => {
  const p1 = document.getElementById('player1').value || 'Player One';
  const p2 = document.getElementById('player2').value || 'Player Two';
  GameController(p1, p2);

  // hide inputs
  document.querySelector('.player-inputs').style.display = 'none';
});
