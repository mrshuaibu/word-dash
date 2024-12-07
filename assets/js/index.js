'use strict';

import { wordBank } from './words.js';

const startButton = document.querySelector('.start-button');
const timeCounter = document.querySelector('.time-counter p');
const randomWordDisplay = document.querySelector('.random-word p');
const hitCounter = document.querySelector('.hit-counter p');
const inputArea = document.querySelector('.input-area input');
const scoreboard = document.querySelector('.scoreboard'); 
const scoreboardArea = document.querySelector('.scoreboard-area'); 
const clearButton = document.querySelector('.clear-scoreboard');

const gameplaySound = new Audio('./assets/audio/bgsound.mp3');
const gameOverSound = new Audio('./assets/audio/gamover.wav');

gameplaySound.loop = true;
gameOverSound.loop = false;

function saveScore(hits, totalWords) {
    if (hits > 0) {
        const score = {
            hits: hits,
            percentage: ((hits / totalWords) * 100).toFixed(2),  
            date: new Date().toLocaleDateString()
        };

        const storedScores = JSON.parse(localStorage.getItem('scores')) || [];

        const isDuplicate = storedScores.some(existingScore => 
            existingScore.hits === score.hits &&
            existingScore.percentage === score.percentage &&
            existingScore.date === score.date
        );

        if (!isDuplicate) {
            storedScores.push(score); 
        }

        storedScores.sort((a, b) => b.hits - a.hits).splice(10);

        localStorage.setItem('scores', JSON.stringify(storedScores));
        displayScores();  
    }
}

function displayScores() {
    const storedScores = JSON.parse(localStorage.getItem('scores')) || [];
    scoreboard.innerHTML = '';  

    if (storedScores.length === 0) {
        scoreboard.innerHTML = '<p>No games have been played yet.</p>';
        clearButton.classList.add('hidden');
        clearButton.style.display = 'none';  
    } else {
        const highScoresHeader = document.createElement('h3');
        highScoresHeader.textContent = 'High Scores';
        scoreboard.appendChild(highScoresHeader);

        storedScores.forEach((score) => {
            const scoreItem = document.createElement('div');

            const hitsSpan = document.createElement('span');
            hitsSpan.textContent = `Hits: ${score.hits}`;
            scoreItem.appendChild(hitsSpan);

            const percentageSpan = document.createElement('span');
            percentageSpan.textContent = `${score.percentage}%`;
            scoreItem.appendChild(percentageSpan);

            const dateSpan = document.createElement('span');
            dateSpan.textContent = score.date;
            scoreItem.appendChild(dateSpan);

            scoreboard.appendChild(scoreItem);
        });
    }
}

function clearScoreboard() {
    localStorage.removeItem('scores');
    displayScores();
}

let gameInterval, timerInterval;
let timeRemaining = 20;
let hits = 0;
let gameStarted = false;

function endGame() {
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    gameStarted = false;
    randomWordDisplay.textContent = 'Game Over';
    startButton.textContent = 'START';
    gameplaySound.pause();
    gameplaySound.currentTime = 0;
    gameOverSound.currentTime = 0;
    gameOverSound.play();

    saveScore(hits, wordBank.length); 

    scoreboardArea.classList.add('visible');
}

function startGame() {
    if (gameStarted) {
        resetGame();
    }

    startButton.textContent = 'RESTART';
    gameStarted = true;
    timeRemaining = 20;
    hits = 0;
    hitCounter.textContent = "0 HITS";
    timeCounter.textContent = `${timeRemaining}`;
    inputArea.placeholder = '';
    shuffleWords();
    displayNewWord();
    clearInterval(timerInterval);
    startTimer();
    gameplaySound.pause();
    gameplaySound.currentTime = 0;
    gameplaySound.play();
    gameOverSound.pause();
    gameOverSound.currentTime = 0;

    scoreboard.classList.remove('visible');
}

function resetGame() {
    clearInterval(timerInterval);
    gameStarted = false;
    timeRemaining = 99;
    hits = 0;
    inputArea.value = '';
    inputArea.placeholder = '';
    timeCounter.textContent = "---";
    hitCounter.textContent = "0 HITS";
    randomWordDisplay.textContent = '';
    startButton.textContent = 'START';
    gameplaySound.pause();
    gameplaySound.currentTime = 0;
    gameOverSound.pause();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeRemaining--;
        timeCounter.textContent = `${timeRemaining}`;
        if (timeRemaining <= 0) {
            endGame();
        }
    }, 1000);
}

function shuffleWords() {
    const shuffledWords = [...wordBank].sort(() => Math.random() - 0.5);
    return shuffledWords;
}

function displayNewWord() {
    const shuffledWords = shuffleWords();
    if (shuffledWords.length === 0) {
        endGame();
    } else {
        randomWordDisplay.textContent = shuffledWords.pop();
        inputArea.value = '';
        inputArea.focus();
    }
}

inputArea.addEventListener('input', () => {
    if (gameStarted) {
        const userInput = inputArea.value.toLowerCase();
        const displayedWord = randomWordDisplay.textContent.toLowerCase();
        if (userInput === displayedWord) {
            hits++;
            hitCounter.textContent = `${hits} HITS`;
            displayNewWord();
        }
    }
});

startButton.addEventListener('click', startGame);

clearButton.addEventListener('click', clearScoreboard);

window.onload = function() {
    displayScores();
};
