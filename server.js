const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Store answers in memory (or connect a database here)
const allSubmissions = [];

app.post('/submit', (req, res) => {
    const data = req.body;
    console.log(`[RECEIVED] Team: ${data.team} | Q: ${data.question} | Ans: ${data.answer} | Time: ${data.submittedAt}`);
    
    allSubmissions.push(data);
    res.sendStatus(200);
});

// Endpoint for Host to view all answers
app.get('/host-view', (req, res) => {
    res.json(allSubmissions);
});

app.listen(3000, () => {
    console.log('Med Melody Server running on http://localhost:3000');
});
