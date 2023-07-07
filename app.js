
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const backgroundImage = new Image();
backgroundImage.src = "img/"; // Ruta de tu imagen de fondo

const playerImage = new Image();
playerImage.src = "player.png"; // Ruta de la imagen del protagonista

const enemyImage = new Image();
enemyImage.src = "enemy.png"; // Ruta de la imagen de los enemigos

const player = {
    x: 50,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 5
};

const enemies = [
    { x: 200, y: canvas.height - 100, width: 50, height: 50, speed: 3 },
    { x: 400, y: canvas.height - 100, width: 50, height: 50, speed: 3 },
    { x: 600, y: canvas.height - 100, width: 50, height: 50, speed: 3 }
];

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
        player.x -= player.speed;
    } else if (event.key === "ArrowRight") {
        player.x += player.speed;
    }
});

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach(function(enemy) {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawPlayer();
    drawEnemies();

    requestAnimationFrame(gameLoop);
}

// Esperamos a que las imágenes se carguen antes de iniciar el juego
Promise.all([backgroundImage.onload, playerImage.onload, enemyImage.onload]).then(function() {
    gameLoop();
});