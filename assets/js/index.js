'use strict';

const startButton = document.querySelector('.start-button');
const timeCounter = document.querySelector('.time-counter p');
const randomWordDisplay = document.querySelector('.random-word p');
const hitCounter = document.querySelector('.hit-counter p');
const inputArea = document.querySelector('.input-area input');

const gameplaySound = new Audio('./assets/audio/sound2.mp3'); 
const gameOverSound = new Audio('./assets/audio/sound3.mp3');

gameplaySound.loop = true;
gameOverSound.loop = true;

let wordBank = [
    'dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population',
    'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute',
    'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle',
    'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy',
    'database', 'periodic', 'capitalism', 'abominable', 'phone', 'component',
    'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'velvet',
    'potion', 'treasure', 'beacon', 'labyrinth', 'whisper', 'breeze', 'coffee',
    'beauty', 'agency', 'chocolate', 'eleven', 'technology', 'alphabet', 'knowledge',
    'magician', 'professor', 'triangle', 'earthquake', 'baseball', 'beyond',
    'evolution', 'banana', 'perfume', 'computer', 'butterfly', 'discovery',
    'ambition', 'music', 'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery',
    'enemy', 'button', 'door', 'bird', 'superman', 'library', 'unboxing',
    'bookstore', 'language', 'homework', 'beach', 'economy', 'interview', 'awesome',
    'challenge', 'science', 'mystery', 'famous', 'league', 'memory', 'leather',
    'planet', 'software', 'update', 'yellow', 'keyboard', 'window', 'beans',
    'truck', 'sheep', 'blossom', 'secret', 'wonder', 'enchantment', 'destiny',
    'quest', 'sanctuary', 'download', 'blue', 'actor', 'desk', 'watch', 'giraffe',
    'brazil', 'audio', 'school', 'detective', 'hero', 'progress', 'winter', 'passion',
    'rebel', 'amber', 'jacket', 'article', 'paradox', 'social', 'resort', 'mask',
    'escape', 'promise', 'band', 'level', 'hope', 'moonlight', 'media', 'orchestra',
    'volcano', 'guitar', 'raindrop', 'inspiration', 'diamond', 'illusion', 'firefly',
    'ocean', 'cascade', 'journey', 'laughter', 'horizon', 'exploration', 'serendipity',
    'infinity', 'silhouette', 'wanderlust', 'marvel', 'nostalgia', 'serenity',
    'reflection', 'twilight', 'harmony', 'symphony', 'solitude', 'essence',
    'melancholy', 'melody', 'vision', 'silence', 'whimsical', 'eternity',
    'cathedral', 'embrace', 'poet', 'ricochet', 'mountain', 'dance', 'sunrise',
    'dragon', 'adventure', 'galaxy', 'echo', 'fantasy', 'radiant', 'serene',
    'legend', 'starlight', 'light', 'pressure', 'bread', 'cake', 'caramel',
    'juice', 'mouse', 'charger', 'pillow', 'candle', 'film', 'jupiter'
];

class Score {
    #date;
    #hits;
    #percentage;

    constructor(hits, totalWords) {
        this.#date = new Date();
        this.#hits = hits;
        this.#percentage = ((hits / totalWords) * 100).toFixed(2);
    }

    get date() {
        return this.#date.toLocaleString();
    }

    get hits() {
        return this.#hits;
    }

    get percentage() {
        return this.#percentage;
    }
}

const scores = [];

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

    const score = new Score(hits, hits + wordBank.length);
    scores.push(score);
    console.log('Score saved:', score);
}

let gameInterval, timerInterval;
let timeRemaining = 99; 
let hits = 0;
let gameStarted = false;

function startGame() {
    if (gameStarted) {
        resetGame();
    }

    startButton.textContent = 'RESTART';
    gameStarted = true;
    timeRemaining = 99;
    hits = 0; 
    hitCounter.textContent = "0 HITS";
    timeCounter.textContent = `${timeRemaining}`; 
    inputArea.placeholder = ''; 
    shuffleWords();
    displayNewWord();
    clearInterval(timerInterval); 
    startTimer(); 
    gameOverSound.pause();
    gameOverSound.currentTime = 0;
    gameplaySound.play();
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
    wordBank = wordBank.sort(() => Math.random() - 0.5);
}

function displayNewWord() {
    if (wordBank.length === 0) {
        endGame();
    } else {
        randomWordDisplay.textContent = wordBank.pop();
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
