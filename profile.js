// ===========================
// NEXUS GAMING - Profile JS
// ===========================

const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) window.location.href = 'login.html';

let currentField = '';

const fieldConfig = {
    name:     { label: 'Name',     placeholder: 'Enter your name' },
    age:      { label: 'Age',      placeholder: 'Enter your age', type: 'number' },
    school:   { label: 'School',   placeholder: 'Enter school name' },
    standard: { label: 'Class',    placeholder: 'e.g. LKG, 1st, 2nd …' }
};

function classLabel(std) {
    const map = { LKG:'LKG', UKG:'UKG', '1':'1st Standard','2':'2nd Standard','3':'3rd Standard','4':'4th Standard' };
    return map[std] || std;
}

function formatUserType(type) {
    const map = { student:'Student', parent:'Parent', teacher:'Teacher' };
    return map[type] || 'Player';
}

function loadProfile() {
    const progressKey  = `progress_${currentUser.email}`;
    const progressData = JSON.parse(localStorage.getItem(progressKey)) || { xp: 0, gamesPlayed: 0 };
    const level        = Math.floor(progressData.xp / 100) + 1;

    document.getElementById('profileAvatar').textContent   = currentUser.avatar   || '🎮';
    document.getElementById('profileUsername').textContent  = currentUser.username || 'Player';
    document.getElementById('profileId').textContent        = currentUser.email?.split('@')[0] || '—';
    document.getElementById('statLevel').textContent        = level;
    document.getElementById('statGames').textContent        = progressData.gamesPlayed || 0;

    document.getElementById('displayName').textContent      = currentUser.username || '—';
    document.getElementById('displayUserType').textContent  = formatUserType(currentUser.userType);
    document.getElementById('displayEmail').textContent     = currentUser.email    || '—';

    // Conditional fields
    const ageRow      = document.getElementById('rowAge');
    const standardRow = document.getElementById('rowStandard');
    const schoolRow   = document.getElementById('rowSchool');

    if (currentUser.userType === 'student') {
        ageRow.style.display      = 'grid';
        standardRow.style.display = 'grid';
        schoolRow.style.display   = 'grid';
        document.getElementById('displayAge').textContent      = currentUser.age      ? currentUser.age + ' yrs' : 'Not set';
        document.getElementById('displayStandard').textContent = currentUser.standard ? classLabel(currentUser.standard) : 'Not set';
        document.getElementById('displaySchool').textContent   = currentUser.school   || 'Not set';
    } else if (currentUser.userType === 'teacher') {
        ageRow.style.display      = 'none';
        standardRow.style.display = 'none';
        schoolRow.style.display   = 'grid';
        document.getElementById('displaySchool').textContent = currentUser.school || 'Not set';
        document.getElementById('schoolRowLabel').textContent = 'School';
    } else if (currentUser.userType === 'parent') {
        ageRow.style.display      = 'none';
        standardRow.style.display = 'none';
        schoolRow.style.display   = 'grid';
        document.getElementById('displaySchool').textContent = currentUser.school || 'Not set';
        document.getElementById('schoolRowLabel').textContent = "Child's School";
    } else {
        ageRow.style.display      = 'none';
        standardRow.style.display = 'none';
        schoolRow.style.display   = 'none';
    }
}

function showSection(sectionName, el) {
    document.querySelectorAll('.menu-item').forEach(item => item.classList.remove('active'));
    if (el) el.classList.add('active');
}

function openEditModal(field) {
    currentField = field;
    const cfg   = fieldConfig[field] || { label: field, placeholder: '' };
    document.getElementById('modalTitle').textContent = `Edit ${cfg.label}`;
    document.getElementById('modalLabel').textContent = cfg.label;
    const input = document.getElementById('modalInput');
    input.type  = cfg.type || 'text';
    input.placeholder = cfg.placeholder || '';

    // Pre-fill value
    const valueMap = { name: currentUser.username, age: currentUser.age, school: currentUser.school, standard: currentUser.standard };
    input.value = valueMap[field] || '';

    document.getElementById('editModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

function saveEdit() {
    const value = document.getElementById('modalInput').value.trim();
    if (!value) { alert('Please enter a value'); return; }

    if (currentField === 'name') {
        currentUser.username = value;
    } else {
        currentUser[currentField] = value;
    }

    // Persist to users array
    let users = JSON.parse(localStorage.getItem('gamingUsers')) || [];
    users = users.map(u => u.email === currentUser.email ? currentUser : u);
    localStorage.setItem('gamingUsers', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    loadProfile();
    closeEditModal();
}

// Boot
loadProfile();
