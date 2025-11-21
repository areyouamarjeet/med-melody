import { db } from "./firebase-config.js";
import { collection, onSnapshot, query, orderBy } 
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const tableBody = document.getElementById('submissions-table');

// Listen for updates in real-time
const q = query(collection(db, "submissions"), orderBy("timestamp", "desc"));

onSnapshot(q, (snapshot) => {
    tableBody.innerHTML = ""; // Clear table to re-render
    snapshot.forEach((doc) => {
        const data = doc.data();
        const row = `
            <tr>
                <td>${data.question}</td>
                <td>${data.team}</td>
                <td>${data.answer}</td>
                <td>${data.timestamp ? data.timestamp.toDate().toLocaleTimeString() : 'Pending...'}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
});

// Simple CSV export for the host
window.downloadCSV = function() {
    let csv = "Song,Team,Answer,Time\n";
    const rows = document.querySelectorAll("table tr");
    rows.forEach(row => {
        const cols = row.querySelectorAll("td, th");
        const data = [];
        cols.forEach(col => data.push(col.innerText));
        if(data.length > 0) csv += data.join(",") + "\n";
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quiz_results.csv';
    a.click();
};
