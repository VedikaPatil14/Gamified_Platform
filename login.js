// ===========================
// NEXUS GAMING - Login JS
// ===========================

document.addEventListener('DOMContentLoaded', function () {
    createParticles();

    // Redirect if already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'main.html';
    }
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

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    errorElement.textContent = message;
    errorElement.classList.add('show');
    setTimeout(() => errorElement.classList.remove('show'), 3000);
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('gamingUsers')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showError("Invalid email or password! Please register if you haven't already.");
        return false;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'main.html';
    return false;
}
