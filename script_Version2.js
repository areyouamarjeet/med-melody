import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } 
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentSongIndex = 1;
const totalSongs = 10;
let timeLeft = 60;
let timerInterval;
let teamName = "";
let hasSubmitted = false;

const loginView = document.getElementById('login-view');
const quizView = document.getElementById('quiz-view');
const endView = document.getElementById('end-view');

document.getElementById('start-btn').addEventListener('click', () => {
    const input = document.getElementById('team-name');
    if (!input.value.trim()) return alert("Enter a team name!");
    teamName = input.value.trim();
    
    loginView.classList.remove('active');
    quizView.classList.add('active');
    loadQuestion();
});

function loadQuestion() {
    document.getElementById('question-title').innerText = `Song ${currentSongIndex} Syndrome`;
    const answerBox = document.getElementById('answer-box');
    const submitBtn = document.getElementById('submit-btn');
    const statusMsg = document.getElementById('status-msg');
    
    answerBox.value = "";
    answerBox.disabled = false;
    submitBtn.disabled = false;
    statusMsg.innerText = "";
    
    hasSubmitted = false;
    timeLeft = 60;
    document.getElementById('timer').innerText = timeLeft;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) handleTimeUp();
    }, 1000);
}

document.getElementById('submit-btn').addEventListener('click', () => {
    if (hasSubmitted) return;
    const answer = document.getElementById('answer-box').value;
    sendData(answer, false); // Manual submit
    
    hasSubmitted = true;
    document.getElementById('answer-box').disabled = true;
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('status-msg').innerText = "Locked. Waiting for next song...";
});

function handleTimeUp() {
    clearInterval(timerInterval);
    if (!hasSubmitted) {
        const answer = document.getElementById('answer-box').value;
        sendData(answer, true); // Auto submit
    }
    nextQuestion();
}

async function sendData(answerText, isAuto) {
    try {
        await addDoc(collection(db, "submissions"), {
            team: teamName,
            question: currentSongIndex,
            answer: answerText,
            timestamp: serverTimestamp(),
            auto: isAuto
        });
        console.log("Saved to Firebase");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

function nextQuestion() {
    currentSongIndex++;
    if (currentSongIndex <= totalSongs) {
        loadQuestion();
    } else {
        quizView.classList.remove('active');
        endView.classList.add('active');
    }
}