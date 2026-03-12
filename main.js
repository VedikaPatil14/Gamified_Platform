// ===========================
// NEXUS GAMING - Main JS
// ===========================

const subjects = [
    { name: "Maths",     icon: "🧮", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb" },
    { name: "Physics",   icon: "⚛️", image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69" },
    { name: "Chemistry", icon: "🧪", image: "https://images.unsplash.com/photo-1581092919535-7146c0c4d1c1" }
];

// ---------- Particles ----------
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 15 + 's';
        p.style.animationDuration = (Math.random() * 10 + 10) + 's';
        container.appendChild(p);
    }
}

// ---------- User Init ----------
function initializeUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) { window.location.href = 'login.html'; return false; }

    const progressKey  = `progress_${currentUser.email}`;
    const progressData = JSON.parse(localStorage.getItem(progressKey)) || {
        gamesPlayed: 0, streak: 0, longestStreak: 0,
        lastDate: null, activeDates: [], xp: 0,
        subjects: { Maths: 0, Physics: 0, Chemistry: 0 },
        history: []
    };

    const level = Math.floor(progressData.xp / 100) + 1;

    // Nav display
    setEl('userAvatar',       currentUser.avatar   || '🎮');
    setEl('userName',         currentUser.username || 'Player');
    setEl('welcomeMessage',   `Welcome Back, ${currentUser.username || 'Player'}!`);
    setEl('userLevel',        `Level ${level} • ${formatUserType(currentUser.userType)}`);
    setEl('dropdownAvatar',   currentUser.avatar   || '🎮');
    setEl('dropdownUsername', currentUser.username || 'Player');
    setEl('dropdownLevel',    `Level: ${level}${currentUser.standard ? ' • ' + classLabel(currentUser.standard) : ''}`);
    setEl('dropdownXP',       `${progressData.xp} XP`);

    updateStats(progressData, level);
    return true;
}

function setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function formatUserType(type) {
    const map = { student: 'Student', parent: 'Parent', teacher: 'Teacher' };
    return map[type] || 'Player';
}

function classLabel(std) {
    const map = { LKG: 'LKG', UKG: 'UKG', '1':'Class 1','2':'Class 2','3':'Class 3','4':'Class 4' };
    return map[std] || `Class ${std}`;
}

// ---------- Stats ----------
function updateStats(progressData, level) {
    const container = document.getElementById('statsOverview');
    if (!container) return;
    const stats = [
        { label: "Level",          value: level,                  icon: "⚡" },
        { label: "Total XP",       value: progressData.xp,        icon: "✨" },
        { label: "Games Played",   value: progressData.gamesPlayed, icon: "🎮" },
        { label: "Current Streak", value: progressData.streak,    icon: "🔥" }
    ];
    container.innerHTML = stats.map(s => `
        <div class="stat-card">
            <div class="stat-value">${s.icon} ${s.value}</div>
            <div class="stat-label">${s.label}</div>
        </div>
    `).join('');
}

// ---------- Subjects ----------
function renderSubjects() {
    const container = document.getElementById('gamesContainer');
    if (!container) return;
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'subject-grid';

    subjects.forEach(subject => {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.innerHTML = `
            <div class="subject-bg" style="background-image:url('${subject.image}')"></div>
            <div class="subject-overlay"></div>
            <div class="subject-content">
                <div class="subject-icon">${subject.icon}</div>
                <div class="subject-name">${subject.name}</div>
            </div>
        `;
        card.onclick = () => { window.location.href = `subject.html?subject=${subject.name}`; };
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

// ---------- Nav interactions ----------
function toggleProfileDropdown(event) {
    event.stopPropagation();
    document.getElementById('profileDropdown').classList.toggle('active');
}

function navigateTo(url) { window.location.href = url; }
function openProgress()  { window.location.href = 'progress.html'; }

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Close dropdown on outside click
document.addEventListener('click', function (e) {
    const dropdown = document.getElementById('profileDropdown');
    const avatar   = document.getElementById('userAvatar');
    if (dropdown && !dropdown.contains(e.target) && e.target !== avatar) {
        dropdown.classList.remove('active');
    }
});

// ---------- Boot ----------
window.addEventListener('DOMContentLoaded', function () {
    createParticles();
    if (initializeUser()) renderSubjects();
});
