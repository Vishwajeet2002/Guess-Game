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
const guessHistoryDiv = document.getElementById("guessHistoryDiv");
