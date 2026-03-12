// ===========================
// NEXUS GAMING - Subject JS
// ===========================

const games = {
    'Maths': [
        { name: 'Math Quiz',      icon: '➕', difficulty: 'Easy',   description: 'Test your arithmetic skills',  file: 'math-quiz.html' },
        { name: 'Sudoku',         icon: '🔢', difficulty: 'Medium', description: 'Classic number puzzle',        file: 'sudoku.html' },
        { name: 'Number Puzzle',  icon: '🧮', difficulty: 'Easy',   description: 'Solve number patterns',        file: 'number-puzzle.html' }
    ],
    'Physics': [
        { name: 'Physics Quiz',        icon: '⚛️', difficulty: 'Medium', description: 'Test your physics knowledge', file: 'physics-quiz.html' },
        { name: 'Projectile Motion',   icon: '🎯', difficulty: 'Hard',   description: 'Calculate trajectories',      file: 'projectile.html' }
    ],
    'Chemistry': [
        { name: 'Periodic Table Game', icon: '⚗️', difficulty: 'Medium', description: 'Learn the periodic table',    file: 'periodic-table.html' },
        { name: 'Chemistry Quiz',      icon: '🧪', difficulty: 'Easy',   description: 'Test chemistry concepts',     file: 'chemistry-quiz.html' }
    ]
};

document.addEventListener('DOMContentLoaded', function () {
    const params  = new URLSearchParams(window.location.search);
    const subject = params.get('subject') || 'Maths';

    document.getElementById('subjectTitle').textContent = subject + ' Games';

    const grid        = document.getElementById('gamesGrid');
    const subjectGames = games[subject] || [];

    if (subjectGames.length === 0) {
        grid.innerHTML = `<div style="padding:40px;text-align:center;color:rgba(255,255,255,0.4);">
            No games available for this subject yet.
        </div>`;
        return;
    }

    subjectGames.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';

        const diffClass = game.difficulty === 'Easy'   ? 'difficulty-easy'
                        : game.difficulty === 'Medium' ? 'difficulty-medium'
                        :                                'difficulty-hard';

        card.innerHTML = `
            <div class="game-icon">${game.icon}</div>
            <div class="game-title">${game.name}</div>
            <div class="game-description">${game.description}</div>
            <div class="difficulty ${diffClass}">${game.difficulty}</div>
        `;

        card.onclick = () => { window.location.href = game.file; };
        grid.appendChild(card);
    });
});
