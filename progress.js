// ===========================
// NEXUS GAMING - Progress JS
// ===========================

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) window.location.href = 'login.html';

const progressKey  = `progress_${currentUser.email}`;
const progressData = JSON.parse(localStorage.getItem(progressKey)) || {
    gamesPlayed: 0, streak: 0, longestStreak: 0,
    lastDate: null, activeDates: [], xp: 0,
    subjects: { Maths: 0, Physics: 0, Chemistry: 0 },
    history: []
};

// ---------- History ----------
function renderHistory() {
    const historyList = document.getElementById('historyList');
    const history     = progressData.history || [];

    if (history.length === 0) {
        historyList.innerHTML = `<div style="padding:40px;text-align:center;color:rgba(255,255,255,0.3);">
            No submissions yet. Start playing to see your history!
        </div>`;
        return;
    }

    historyList.innerHTML = history.slice().reverse().map(item => {
        const cls = item.difficulty === 'Easy'   ? 'difficulty-easy'
                  : item.difficulty === 'Medium' ? 'difficulty-medium'
                  :                                'difficulty-hard';
        return `
            <div class="history-row">
                <div class="date-text">${item.date}</div>
                <div>
                    <div class="problem-title">${item.problem}</div>
                    <div class="${cls}">${item.difficulty}</div>
                </div>
                <div class="status-accepted">Accepted</div>
                <div>1</div>
            </div>
        `;
    }).join('');
}

// ---------- Stats ----------
function calculateStats() {
    const history = progressData.history || [];
    const easy    = history.filter(h => h.difficulty === 'Easy').length;
    const medium  = history.filter(h => h.difficulty === 'Medium').length;
    const hard    = history.filter(h => h.difficulty === 'Hard').length;
    const total   = history.length;

    document.getElementById('totalSolved').textContent      = total;
    document.getElementById('easySolved').textContent       = easy;
    document.getElementById('mediumSolved').textContent     = medium;
    document.getElementById('hardSolved').textContent       = hard;
    document.getElementById('totalSubmissions').textContent = progressData.gamesPlayed || 0;
    document.getElementById('acceptanceRate').textContent   = total > 0 ? '100%' : '0%';
    document.getElementById('submissionCount').textContent  = progressData.gamesPlayed || 0;
    document.getElementById('currentStreak').textContent    = progressData.streak || 0;
    document.getElementById('maxStreak').textContent        = progressData.longestStreak || 0;
    document.getElementById('badgeCount').textContent       = total >= 10 ? '1' : '0';
}

// ---------- Calendar ----------
function renderCalendar() {
    const calendarGrid  = document.getElementById('calendarGrid');
    const monthsContainer = document.getElementById('calendarMonths');

    const today      = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Month labels
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const months = [];
    for (let i = 0; i < 12; i++) {
        months.push(monthNames[(today.getMonth() + i + 1) % 12]);
    }
    monthsContainer.innerHTML = months.map(m => `<div class="month-label">${m}</div>`).join('');

    // Active dates map
    const activeDatesMap = {};
    (progressData.activeDates || []).forEach(dateStr => {
        const key = new Date(dateStr).toISOString().split('T')[0];
        activeDatesMap[key] = (activeDatesMap[key] || 0) + 1;
    });

    // Grid
    let current = new Date(oneYearAgo);
    current.setDate(current.getDate() - current.getDay()); // start Sunday

    for (let week = 0; week < 53; week++) {
        const weekDiv = document.createElement('div');
        weekDiv.className = 'week-col';

        for (let day = 0; day < 7; day++) {
            const box     = document.createElement('div');
            box.className = 'day-box';
            const dateKey = current.toISOString().split('T')[0];
            const count   = activeDatesMap[dateKey] || 0;

            if (count > 0) box.classList.add(`active-${Math.min(4, Math.ceil(count / 2))}`);

            const tooltip = document.createElement('div');
            tooltip.className = 'day-tooltip';
            tooltip.textContent = `${current.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}: ${count} submissions`;
            box.appendChild(tooltip);

            weekDiv.appendChild(box);
            current.setDate(current.getDate() + 1);
        }

        calendarGrid.appendChild(weekDiv);
    }
}

// Boot
renderHistory();
calculateStats();
renderCalendar();
