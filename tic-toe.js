document.addEventListener("DOMContentLoaded", () => {

  const cells = document.querySelectorAll(".cell");
  const statusText = document.getElementById("status");
  const restartBtn = document.getElementById("restart");
  const clickSound = document.getElementById("clickSound");

  const pvpBtn = document.getElementById("pvp");
  const pvaBtn = document.getElementById("pva");

  const xScoreEl = document.getElementById("xScore");
  const oScoreEl = document.getElementById("oScore");
  const drawScoreEl = document.getElementById("drawScore");

  let currentPlayer = "X";
  let gameActive = true;
  let gameState = ["","","","","","","","",""];
  let vsAI = false;

  let scores = { X: 0, O: 0, draw: 0 };

  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  /* =====================
     MODE SELECTION
  ===================== */
  pvpBtn.onclick = () => setMode(false);
  pvaBtn.onclick = () => setMode(true);

  function setMode(ai) {
    vsAI = ai;
    pvpBtn.classList.toggle("active", !ai);
    pvaBtn.classList.toggle("active", ai);
    resetGame();
  }

  /* =====================
     CELL CLICK
  ===================== */
  cells.forEach(cell => cell.addEventListener("click", handleClick));

  function handleClick() {
    const index = this.dataset.index;
    if (!gameActive || gameState[index] !== "") return;

    makeMove(index, currentPlayer);

    if (vsAI && gameActive && currentPlayer === "O") {
      setTimeout(aiMove, 500);
    }
  }

  function makeMove(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add("pop");
    clickSound.play();

    checkResult();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }

  /* =====================
     CHECK RESULT
  ===================== */
  function checkResult() {
    for (let pattern of winPatterns) {
      const [a,b,c] = pattern;
      if (gameState[a] &&
          gameState[a] === gameState[b] &&
          gameState[a] === gameState[c]) {

        pattern.forEach(i => cells[i].classList.add("win"));
        endGame(`${gameState[a]} Wins`, gameState[a]);
        return;
      }
    }

    if (!gameState.includes("")) {
      endGame("Draw", "draw");
    }
  }

  function endGame(message, winner) {
    gameActive = false;
    statusText.textContent = message;

    if (winner === "X") scores.X++;
    else if (winner === "O") scores.O++;
    else scores.draw++;

    updateScores();
  }

  /* =====================
     AI LOGIC (WIN > BLOCK > RANDOM)
  ===================== */
  function aiMove() {
    let move = findBestMove("O") || findBestMove("X") || randomMove();
    makeMove(move, "O");
  }

  function findBestMove(player) {
    for (let pattern of winPatterns) {
      const [a,b,c] = pattern;
      const values = [gameState[a], gameState[b], gameState[c]];

      if (values.filter(v => v === player).length === 2 &&
          values.includes("")) {
        return pattern[values.indexOf("")];
      }
    }
    return null;
  }

  function randomMove() {
    const empty = gameState
      .map((v,i) => v === "" ? i : null)
      .filter(v => v !== null);
    return empty[Math.floor(Math.random() * empty.length)];
  }

  /* =====================
     RESET
  ===================== */
  restartBtn.onclick = resetGame;

  function resetGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState.fill("");
    statusText.textContent = "Player X's Turn";
    cells.forEach(c => {
      c.textContent = "";
      c.className = "cell";
    });
  }

  function updateScores() {
    xScoreEl.textContent = scores.X;
    oScoreEl.textContent = scores.O;
    drawScoreEl.textContent = scores.draw;
  }

});
