// ===== GAME STATE VARIABLES =====
let secretNumber = 0;
let attempts = 0;
let gameActive = true;
let difficulty = "medium";
let difficultyRanges = {
  easy: { min: 1, max: 50 },
  medium: { min: 1, max: 100 },
  hard: { min: 1, max: 500 },
};
let guessHistory = [];
let gameStartTime = 0;
let timerInterval = null;
let soundEnabled = true;
let hintsUsed = 0;
let limitedAttemptsMode = false;
let maxAttempts = 10;
let remainingAttempts = maxAttempts;

// ===== DOM ELEMENTS =====
const guessInput = document.getElementById("guess-input");
const feedback = document.getElementById("feedback");
const attemptsDisplay = document.getElementById("attempts");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const bestScoreDisplay = document.getElementById("best-score");
const historyContainer = document.getElementById("history-container");
const guessHistoryDiv = document.getElementById("guess-history");
const hintText = document.getElementById("hint-text");
const hintSection = document.getElementById("hint-section");
const limitedAttemptsDisplay = document.getElementById(
  "limited-attempts-display"
);

const remainingAttemptsSpan = document.getElementById("remaining-attempts");
const themeIcon = document.getElementById("theme-icon");
const soundIcon = document.getElementById("sound-icon");
const limitedText = document.getElementById("limited-text");
const limitedIcon = document.getElementById("limited-icon");
const bgMusic = document.getElementById("bg-music");

// ===== GAME FUNCTIONS =====
function startGame() {
  const range = difficultyRanges[difficulty];
  secretNumber =
    Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  attempts = 0;
  hintsUsed = 0;
  guessHistory = [];
  gameActive = true;
  gameStartTime = Date.now();
  updateTimer();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
  updateUI();
  feedback.textContent = "Think of a number and make your first guess!";
  hintSection.style.display = "none";
  guessInput.value = "";
  remainingAttempts = maxAttempts;
  if (limitedAttemptsMode) {
    limitedAttemptsDisplay.style.display = "block";
    remainingAttemptsSpan.textContent = remainingAttempts;
  } else {
    limitedAttemptsDisplay.style.display = "none";
  }
  if (soundEnabled) bgMusic.play();
  else bgMusic.pause();
}

function makeGuess() {
  if (!gameActive) return;

  const guess = Number(guessInput.value);
  if (
    !guess ||
    guess < difficultyRanges[difficulty].min ||
    guess > difficultyRanges[difficulty].max
  ) {
    feedback.textContent = `Please enter a number between ${difficultyRanges[difficulty].min} and ${difficultyRanges[difficulty].max}`;
    return;
  }

  attempts++;
  guessHistory.push(guess);
  guessInput.value = "";

  if (limitedAttemptsMode) {
    remainingAttempts--;
    remainingAttemptsSpan.textContent = remainingAttempts;
  }

  if (guess === secretNumber) {
    gameActive = false;
    clearInterval(timerInterval);
    const score = calculateScore();
    feedback.textContent = `🎉 Correct! You guessed it in ${attempts} attempts.`;
    scoreDisplay.textContent = score;
    updateBestScore(score);
    updateHistory();
  } else {
    if (limitedAttemptsMode && remainingAttempts <= 0) {
      gameActive = false;
      clearInterval(timerInterval);
      feedback.textContent = `❌ Game Over! The correct number was ${secretNumber}.`;
    } else {
      feedback.textContent =
        guess > secretNumber
          ? "📉 Try a lower number!"
          : "📈 Try a higher number!";
    }
  }

  updateUI();
  updateHistory();
}

function calculateScore() {
  const timeTaken = Math.floor((Date.now() - gameStartTime) / 1000);
  return Math.max(1000 - (attempts * 10 + timeTaken * 2 + hintsUsed * 20), 0);
}

function updateUI() {
  attemptsDisplay.textContent = attempts;
}

function updateTimer() {
  const now = Date.now();
  const elapsed = Math.floor((now - gameStartTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function updateHistory() {
  if (guessHistory.length > 0) {
    historyContainer.style.display = "block";
    guessHistoryDiv.innerHTML = guessHistory
      .map((guess, index) => `<div>Guess ${index + 1}: ${guess}</div>`)
      .join("");
  }
}

function getHint() {
  if (!gameActive) return;
  const hintRange = 10;
  const hintMin = Math.max(
    secretNumber - hintRange,
    difficultyRanges[difficulty].min
  );
  const hintMax = Math.min(
    secretNumber + hintRange,
    difficultyRanges[difficulty].max
  );
  hintText.textContent = `Hint: The number is between ${hintMin} and ${hintMax}`;
  hintSection.style.display = "block";
  hintsUsed++;
}

function setDifficulty(level) {
  difficulty = level;
  document.querySelectorAll(".difficulty-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.difficulty === level) btn.classList.add("active");
  });
  startGame();
}

function updateBestScore(currentScore) {
  const best = Number(localStorage.getItem("bestScore") || 0);
  if (currentScore > best) {
    localStorage.setItem("bestScore", currentScore);
    bestScoreDisplay.textContent = currentScore;
  } else {
    bestScoreDisplay.textContent = best;
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;

  soundIcon.classList.toggle("fa-volume-up", soundEnabled);
  soundIcon.classList.toggle("fa-volume-mute", !soundEnabled);

  if (soundEnabled) {
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  themeIcon.classList.toggle("fa-sun");
  themeIcon.classList.toggle("fa-moon");
}

function newGame() {
  startGame();
}

function toggleLimitedAttempts() {
  limitedAttemptsMode = !limitedAttemptsMode;
  limitedText.textContent = limitedAttemptsMode
    ? "Unlimited Mode"
    : "Limited Mode";
  limitedIcon.classList.toggle("fa-hourglass-end", limitedAttemptsMode);
  limitedIcon.classList.toggle("fa-hourglass-half", !limitedAttemptsMode);
  newGame();
}

function handleEnterKey(event) {
  if (event.key === "Enter") {
    makeGuess();
  }
}

// ===== INITIALIZATION =====
window.onload = () => {
  const best = localStorage.getItem("bestScore");
  if (best) bestScoreDisplay.textContent = best;
  startGame();
};
