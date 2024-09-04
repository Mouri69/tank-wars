const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Tank properties
const tankWidth = 50;
const tankHeight = 30;
const projectileWidth = 10;
const projectileHeight = 5;
const terrainColor = '#228B22'; // Green color

// Tank objects
const tanks = [
    { x: 100, y: canvas.height - 100, color: 'red', angle: 0 },
    { x: canvas.width - 150, y: canvas.height - 100, color: 'blue', angle: 0 }
];

const projectiles = [];
let currentPlayer = 0; // 0 for red tank, 1 for blue tank

// Handle keyboard inputs
const keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

function update() {
    const tank = tanks[currentPlayer];

    // Movement controls
    if (keys['w']) tank.y -= 5; // Move up
    if (keys['s']) tank.y += 5; // Move down
    if (keys['a']) tank.x -= 5; // Move left
    if (keys['d']) tank.x += 5; // Move right
    if (keys[' ']) shootProjectile(); // Space bar to shoot

    // Projectile movement
    projectiles.forEach(projectile => {
        projectile.x += projectile.speed;
        if (projectile.x > canvas.width || projectile.x < 0) {
            const index = projectiles.indexOf(projectile);
            projectiles.splice(index, 1);
        }
    });

    // Check collisions
    checkCollisions();

    // Switch player
    if (keys['Enter']) {
        currentPlayer = (currentPlayer + 1) % 2;
        keys['Enter'] = false;
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw terrain
    ctx.fillStyle = terrainColor;
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50); // Simple terrain at bottom

    // Draw tanks
    tanks.forEach(tank => {
        ctx.fillStyle = tank.color;
        ctx.fillRect(tank.x, tank.y, tankWidth, tankHeight);
    });

    // Draw projectiles
    projectiles.forEach(projectile => {
        ctx.fillStyle = 'black';
        ctx.fillRect(projectile.x, projectile.y, projectileWidth, projectileHeight);
    });

    // Draw aiming guidance
    drawAimingGuidance(tanks[currentPlayer]);
}

function shootProjectile() {
    const tank = tanks[currentPlayer];
    projectiles.push({
        x: tank.x + tankWidth,
        y: tank.y + tankHeight / 2 - projectileHeight / 2,
        width: projectileWidth,
        height: projectileHeight,
        speed: 10,
        angle: tank.angle
    });
}

function drawAimingGuidance(tank) {
    ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
    ctx.beginPath();
    ctx.moveTo(tank.x + tankWidth / 2, tank.y + tankHeight / 2);
    ctx.lineTo(tank.x + tankWidth / 2 + 100 * Math.cos(tank.angle), tank.y + tankHeight / 2 - 100 * Math.sin(tank.angle));
    ctx.stroke();
}

function checkCollisions() {
    // Simple collision detection for demo purposes
    projectiles.forEach(projectile => {
        tanks.forEach(tank => {
            if (projectile.x < tank.x + tankWidth &&
                projectile.x + projectileWidth > tank.x &&
                projectile.y < tank.y + tankHeight &&
                projectile.y + projectileHeight > tank.y) {
                // Hit detected
                const index = projectiles.indexOf(projectile);
                projectiles.splice(index, 1);
            }
        });
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
