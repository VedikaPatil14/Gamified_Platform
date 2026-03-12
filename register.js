// ===========================
// NEXUS GAMING - Register JS
// ===========================

document.addEventListener('DOMContentLoaded', function () {
    createParticles();
});

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// User type selection — controls which extra fields are shown
function selectUserType(element, type) {
    document.querySelectorAll('.user-type-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    document.getElementById('selectedUserType').value = type;

    // Hide all conditional fields first
    const ageGroup   = document.getElementById('ageGroup');   // form-row (flex)
    const schoolGroup = document.getElementById('schoolGroup');

    ageGroup.style.display   = 'none';
    schoolGroup.style.display = 'none';

    document.getElementById('regAge').required      = false;
    document.getElementById('regStandard').required = false;
    document.getElementById('regSchool').required   = false;

    if (type === 'student') {
        // ageGroup is a CSS grid row — must use 'grid' not 'block'
        ageGroup.style.display    = 'grid';
        schoolGroup.style.display = 'block';
        document.getElementById('regAge').required      = true;
        document.getElementById('regStandard').required = true;
        document.getElementById('regSchool').required   = true;
    } else if (type === 'parent') {
        schoolGroup.style.display = 'block';  // child's school (optional)
        document.getElementById('regSchool').required = false;
        // Update label for parent context
        document.getElementById('schoolLabel').textContent = "Child's School Name (optional)";
    } else if (type === 'teacher') {
        schoolGroup.style.display = 'block';
        document.getElementById('regSchool').required = true;
        document.getElementById('schoolLabel').textContent = 'School Name';
    }
}

function selectAvatar(element, avatar) {
    document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    document.getElementById('selectedAvatar').value = avatar;
}

function showError(message) {
    const el = document.getElementById('errorMessage');
    el.textContent = message;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3000);
}

function handleRegister(event) {
    event.preventDefault();

    const userType   = document.getElementById('selectedUserType').value;
    const username   = document.getElementById('regUsername').value.trim();
    const email      = document.getElementById('regEmail').value.trim();
    const password   = document.getElementById('regPassword').value;
    const avatar     = document.getElementById('selectedAvatar').value;
    const age        = document.getElementById('regAge').value;
    const standard   = document.getElementById('regStandard').value;
    const school     = document.getElementById('regSchool').value.trim();

    // Validations
    if (!userType) { showError('Please select your role!'); return false; }
    if (!avatar)   { showError('Please choose an avatar!'); return false; }

    let users = JSON.parse(localStorage.getItem('gamingUsers')) || [];

    if (users.some(u => u.username === username)) { showError('Username already taken!'); return false; }
    if (users.some(u => u.email === email))        { showError('Email already registered!'); return false; }

    // Build user object
    const newUser = {
        username,
        email,
        password,
        avatar,
        userType,
        createdAt: new Date().toISOString()
    };

    if (userType === 'student') {
        newUser.age      = age      ? parseInt(age)  : null;
        newUser.standard = standard || null;
        newUser.school   = school   || null;
    }

    if (userType === 'parent') {
        newUser.school = school || null;    // child's school (optional)
    }

    if (userType === 'teacher') {
        newUser.school = school || null;
    }

    users.push(newUser);
    localStorage.setItem('gamingUsers', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    window.location.href = 'main.html';
    return false;
}
