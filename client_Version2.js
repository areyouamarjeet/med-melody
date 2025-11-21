let currentSongIndex = 1;
const totalSongs = 10;
let timeLeft = 60;
let timerInterval;
let teamName = "";
let hasSubmitted = false; // Tracks if the user has submitted for the current song

// Switch between views (Login -> Quiz -> End)
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

function startQuiz() {
    const input = document.getElementById('team-name');
    if (!input.value.trim()) {
        alert("Please enter a team name!");
        return;
    }
    teamName = input.value.trim();
    switchView('quiz-view');
    loadQuestion();
}

function loadQuestion() {
    // Reset UI for new question
    document.getElementById('question-title').innerText = `Song ${currentSongIndex} Syndrome`;
    document.getElementById('answer-box').value = "";
    document.getElementById('answer-box').disabled = false; // Enable typing
    document.getElementById('submit-btn').disabled = false; // Enable button
    document.getElementById('status-msg').innerText = "";
    document.getElementById('status-msg').className = ""; 
    
    hasSubmitted = false;
    timeLeft = 60;
    document.getElementById('timer').innerText = timeLeft;

    // Start Countdown
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;

        if (timeLeft <= 0) {
            handleTimeUp();
        }
    }, 1000);
}

// Called when user clicks the Submit button
function manualSubmit() {
    if (hasSubmitted) return;

    const answer = document.getElementById('answer-box').value;
    
    // Send data immediately
    sendData(answer, false);

    // Lock UI but DO NOT move to next question yet
    hasSubmitted = true;
    document.getElementById('answer-box').disabled = true;
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('status-msg').innerText = "Answer submitted! Waiting for timer to finish...";
    document.getElementById('status-msg').style.color = "green";
}

// Called automatically when timer hits 0
function handleTimeUp() {
    clearInterval(timerInterval);

    // If user hasn't submitted yet, submit whatever text is there automatically
    if (!hasSubmitted) {
        const answer = document.getElementById('answer-box').value;
        sendData(answer, true);
    }

    // Now we move to the next page
    nextQuestion();
}

async function sendData(answer, isAuto) {
    const timestamp = new Date().toISOString();
    try {
        await fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                team: teamName,
                question: `Song ${currentSongIndex}`,
                answer: answer,
                submittedAt: timestamp,
                autoSubmitted: isAuto
            })
        });
        console.log("Data sent successfully");
    } catch (err) {
        console.error("Submission failed", err);
    }
}

function nextQuestion() {
    currentSongIndex++;
    if (currentSongIndex <= totalSongs) {
        loadQuestion();
    } else {
        switchView('end-view');
    }
}