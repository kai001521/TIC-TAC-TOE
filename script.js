const gameBoard = document.getElementById("game-board");
const statusText = document.getElementById("status");
const backButton = document.getElementById("back-button");
const resetScoresButton = document.getElementById("reset-scores");
const scoreX = document.getElementById("score-x");
const scoreO = document.getElementById("score-o");
const scoreboard = document.getElementById("scoreboard");
const themeToggle = document.getElementById("theme-toggle");

let board = [];
let currentPlayer = "X";
let isGameActive = false;
let scores = { X: 0, O: 0 };
let size = 3;
let winLength = 3;

function startGame(selectedSize) {
  size = selectedSize;
  winLength = size === 3 ? 3 : 4;

  document.getElementById("menu").style.display = "none";
  backButton.style.display = "inline-block";
  resetScoresButton.style.display = "inline-block";
  scoreboard.style.display = "flex";

  resetGame();
}

function initializeBoard() {
  board = Array(size * size).fill("");
  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${size}, 60px)`;

  for (let i = 0; i < board.length; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    cell.addEventListener("click", handleCellClick);
    gameBoard.appendChild(cell);
  }

  isGameActive = true;
  currentPlayer = "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function handleCellClick(e) {
  const index = e.target.getAttribute("data-index");
  if (board[index] !== "" || !isGameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin()) {
    statusText.textContent = `${currentPlayer} wins!`;
    isGameActive = false;
    updateScore(currentPlayer);
    setTimeout(resetGame, 2000);
  } else if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    isGameActive = false;
    setTimeout(resetGame, 2000);
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWin() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const index = r * size + c;
      const symbol = board[index];
      if (!symbol) continue;

      // Horizontal
      if (c <= size - winLength) {
        let win = true;
        for (let i = 1; i < winLength; i++) {
          if (board[index + i] !== symbol) win = false;
        }
        if (win) return true;
      }

      // Vertical
      if (r <= size - winLength) {
        let win = true;
        for (let i = 1; i < winLength; i++) {
          if (board[index + i * size] !== symbol) win = false;
        }
        if (win) return true;
      }

      // Diagonal ↘
      if (r <= size - winLength && c <= size - winLength) {
        let win = true;
        for (let i = 1; i < winLength; i++) {
          if (board[index + i * (size + 1)] !== symbol) win = false;
        }
        if (win) return true;
      }

      // Diagonal ↙
      if (r <= size - winLength && c >= winLength - 1) {
        let win = true;
        for (let i = 1; i < winLength; i++) {
          if (board[index + i * (size - 1)] !== symbol) win = false;
        }
        if (win) return true;
      }
    }
  }
  return false;
}

function updateScore(player) {
  scores[player]++;
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
}

function resetGame() {
  initializeBoard();
}

function resetScores() {
  scores = { X: 0, O: 0 };
  scoreX.textContent = "0";
  scoreO.textContent = "0";
  resetGame();
}

function backToMenu() {
  isGameActive = false;
  board = [];
  gameBoard.innerHTML = "";
  document.getElementById("menu").style.display = "block";
  gameBoard.style.gridTemplateColumns = "none";
  scoreboard.style.display = "none";
  statusText.textContent = "";
  backButton.style.display = "none";
  resetScoresButton.style.display = "none";
}

// Event Listeners
backButton.addEventListener("click", backToMenu);
resetScoresButton.addEventListener("click", resetScores);

// 🌗 Theme Toggle
function applyTheme(theme) {
  document.body.classList.remove("light", "dark");
  document.body.classList.add(theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
});

// Set default theme
applyTheme("light");
