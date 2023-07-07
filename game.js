const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let enemySpawnInterval;
let powerUpSpawnInterval;
let gameSpeed = 1;

const levelData = [
    {
        backgroundImage: "img/level1_bg.jpg",
        enemyImage: "img/enemy1.png",
        enemySpeed: 3,
        enemyHealth: 100,
        bossImage: "img/boss1.png",
        bossSpeed: 2,
        bossHealth: 500,
    },
    // Agrega más datos de nivel aquí
];

let currentLevel = 0;
let playerScore = 0;

let player = {
    x: 50,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 5,
    jumping: false,
    jumpHeight: 10,
    yVelocity: 0,
    gravity: 0.5,
    health: 100,
    killCount: 0,
    currentWeapon: "pistol", // Arma actual del jugador
    availableWeapons: ["pistol"], // Armas disponibles para el jugador
    ammo: {
        pistol: 50, // Munición actual del jugador para cada arma
    },
};

const bullets = [];
const enemies = [];
const powerUps = [];

const backgroundImage = new Image();
backgroundImage.src = "img/fondo1.jpg"; // Ruta de tu imagen de fondo

const playerImage = new Image();
playerImage.src = "img/milei.jpeg"; // Ruta de la imagen del protagonista

const enemyImage = new Image();
enemyImage.src = "img/cris.jpg"; // Ruta de la imagen de los enemigos

const bulletImage = new Image();
bulletImage.src = "img/bullet.png"; // Ruta de la imagen de los disparos

const powerUpImage = new Image();
powerUpImage.src = "img/powerup.png"; // Ruta de la imagen del power-up

function spawnEnemy() {
    const enemy = {
        x: canvas.width,
        y: player.y - 10, // Nivelar la altura de los enemigos con la del jugador
        width: 50,
        height: 50,
        speed: 3,
        health: 100,
        alive: true,
    };
    enemies.push(enemy);
}

function startEnemySpawning() {
    enemySpawnInterval = setInterval(spawnEnemy, 2000); // Genera un nuevo enemigo cada 2 segundos
}

function spawnPowerUp() {
    const powerUp = {
        x: Math.random() * (canvas.width - 50),
        y: canvas.height - 30, // Posición en el suelo
        width: 30,
        height: 30,
        type: "ammo",
    };
    powerUps.push(powerUp);
}

function startPowerUpSpawning() {
    powerUpSpawnInterval = setInterval(spawnPowerUp, 10000); // Genera un nuevo power-up cada 10 segundos
}

// Luego, llamamos a la función startPowerUpSpawning() después de la función startEnemySpawning() en el código principal:

startEnemySpawning();
startPowerUpSpawning();


function startPowerUpSpawning() {
    powerUpSpawnInterval = setInterval(spawnPowerUp, 10000); // Genera un nuevo power-up cada 10 segundos
}

startPowerUpSpawning();

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

    // Barra de vida del jugador
    ctx.fillStyle = "green";
    ctx.fillRect(player.x, player.y - 10, player.health * 0.5, 5);
}

function drawBullets() {
    bullets.forEach((bullet) => {
        if (bullet.active) {
            ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
        }
    });
}

function drawEnemies() {
    enemies.forEach((enemy) => {
        if (enemy.alive) {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
            // Barra de vida del enemigo
            ctx.fillStyle = "green";
            ctx.fillRect(enemy.x, enemy.y - 10, enemy.health * 0.5, 5);
        }
    });
}

function drawPowerUps() {
    powerUps.forEach(function (powerUp) {
        ctx.drawImage(powerUpImage, powerUp.x, powerUp.y, powerUp.width, powerUp.height);
    });
}


function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Score: " + playerScore, 10, 20);
}

// Continuar con la parte 4 después de la pausa

function drawLevel() {
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Level: " + (currentLevel + 1), 10, 40);
}

function drawPlayerStats() {
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Health: " + player.health, 10, 60);
    ctx.fillText("Kills: " + player.killCount, 10, 80);
    ctx.fillText("Weapon: " + player.currentWeapon, 10, 100);
    ctx.fillText("Ammo: " + player.ammo[player.currentWeapon], 10, 120);
}

function updatePlayer() {
    player.yVelocity += player.gravity;
    player.y += player.yVelocity;

    if (player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.yVelocity = 0;
        player.jumping = false;
    }
}



// Agrega esta variable para almacenar la munición inicial del arma actual
const initialAmmo = {
    pistol: player.ammo.pistol
  };
  
  function updateBullets() {
    bullets.forEach((bullet, bulletIndex) => {
      if (bullet.active) {
        bullet.x += bullet.speed * (bullet.isEnemyBullet ? -1 : 1);
  
        if (bullet.x > canvas.width || bullet.x < 0) {
          bullet.active = false;
        }
  
        if (!bullet.isEnemyBullet) {
          enemies.forEach((enemy, enemyIndex) => {
            if (
              bullet.x < enemy.x + enemy.width &&
              bullet.x + bullet.width > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + bullet.height > enemy.y
            ) {
              bullet.active = false;
              enemy.health -= 10;
              if (enemy.health <= 0) {
                enemy.alive = false;
                player.killCount++;
              }
            }
          });
        } else {
          if (
            bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y
          ) {
            bullet.active = false;
            player.health -= 10;
            if (player.health <= 0) {
              gameOver();
            }
          }
        }
      }
    });
  
    bullets.forEach((bullet, index) => {
      if (!bullet.active) {
        bullets.splice(index, 1);
      }
    });
  
    enemies.forEach((enemy, index) => {
      if (!enemy.alive) {
        enemies.splice(index, 1);
      }
    });
     // Restar la munición utilizada del puntaje del jugador
     const ammoUsed = initialAmmo[player.currentWeapon] - player.ammo[player.currentWeapon];
     playerScore -= ammoUsed;
  
   
  }


function updateEnemies() {
    enemies.forEach((enemy) => {
        if (enemy.alive) {
            enemy.x -= enemy.speed * gameSpeed;

            if (
                player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y
            ) {
                player.health -= 10;
                if (player.health <= 0) {
                    gameOver();
                }
            }

            if (enemy.x + enemy.width < 0) {
                enemy.alive = false;
            }
        }
    });

    playerScore = player.killCount * 10;
}



function updatePowerUps() {
    powerUps.forEach(function (powerUp, index) {
        if (
            player.x < powerUp.x + powerUp.width &&
            player.x + player.width > powerUp.x &&
            player.y < powerUp.y + powerUp.height &&
            player.y + player.height > powerUp.y
        ) {
            if (powerUp.type === "ammo") {
                const randomWeaponIndex = Math.floor(Math.random() * player.availableWeapons.length);
                const randomWeapon = player.availableWeapons[randomWeaponIndex];
                player.ammo[randomWeapon] += 50;
                powerUps.splice(index, 1);
            }
            // Agrega más tipos de power-ups y sus efectos aquí
        }
    });
}



function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawPowerUps();
    drawScore();
    drawLevel();
    drawPlayerStats();

    updatePlayer();
    updateBullets();
    updateEnemies();
    updatePowerUps();

    requestAnimationFrame(gameLoop);
}

function gameOver() {
    alert("Game Over. ¿Quieres reiniciar el juego?");
    resetGame();
}

function resetGame() {
    gameSpeed = 1;
    clearInterval(enemySpawnInterval);
    clearInterval(powerUpSpawnInterval);

    player.x = 50;
    player.y = canvas.height - 100;
    player.health = 100;
    player.killCount = 0;
    bullets.length = 0;
    enemies.length = 0;
    powerUps.length = 0;

    gameSpeed = 1;
    startEnemySpawning();
    startPowerUpSpawning();

    enemySpawnInterval = setInterval(spawnEnemy, 2000);
    powerUpSpawnInterval = setInterval(spawnPowerUp, 10000);

    gameLoop();
}

Promise.all([
    backgroundImage.onload,
    playerImage.onload,
    enemyImage.onload,
    bulletImage.onload,
    powerUpImage.onload,
]).then(() => {
    console.log("Todas las imágenes se han cargado correctamente.");
    gameLoop();
});


const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
    resetGame();
});

const stopButton = document.getElementById("stopButton");
stopButton.addEventListener("click", () => {
    alert("El juego se ha detenido.");
});

const pauseButton = document.getElementById("pauseButton");
pauseButton.addEventListener("click", () => {
    alert("El juego se ha pausado.");
});

// Continuar con la parte 8 después de la pausa


function randomShoot(enemy) {
    bullets.push({
        x: enemy.x,
        y: enemy.y + enemy.height / 2,
        width: 10,
        height: 5,
        speed: 5,
        active: true,
        isEnemyBullet: true,
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "a") {
        player.x -= player.speed;
    } else if (event.key === "d") {
        player.x += player.speed;
    } else if (event.key === "f") {
        if (player.ammo[player.currentWeapon] > 0) { // Verificar si hay munición disponible
            bullets.push({
                x: player.x + player.width,
                y: player.y + player.height / 2,
                width: 10,
                height: 5,
                speed: 7,
                active: true,
                isEnemyBullet: false,
            });
            player.ammo[player.currentWeapon]--; // Descontar la munición utilizada
        }
    } else if (event.key === "w" && !player.jumping) {
        player.jumping = true;
        player.yVelocity = -player.jumpHeight;
    }
});


function drawPlayerStats() {
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("Health: " + player.health, 10, 60);
    ctx.fillText("Kills: " + player.killCount, 10, 80);
    ctx.fillText("Weapon: " + player.currentWeapon, 10, 100);
    ctx.fillText("Ammo: " + player.ammo[player.currentWeapon], 10, 120);
}

function updatePlayer() {
    player.yVelocity += player.gravity;
    player.y += player.yVelocity;

    if (player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.yVelocity = 0;
        player.jumping = false;
    }
}

function updateBullets() {
    bullets.forEach((bullet, bulletIndex) => {
        if (bullet.active) {
            bullet.x += bullet.speed * (bullet.isEnemyBullet ? -1 : 1);

            if (bullet.x > canvas.width || bullet.x < 0) {
                bullet.active = false;
            }

            if (!bullet.isEnemyBullet) {
                enemies.forEach((enemy, enemyIndex) => {
                    if (
                        bullet.x < enemy.x + enemy.width &&
                        bullet.x + bullet.width > enemy.x &&
                        bullet.y < enemy.y + enemy.height &&
                        bullet.y + bullet.height > enemy.y
                    ) {
                        bullet.active = false;
                        enemy.health -= 10;
                        if (enemy.health <= 0) {
                            enemy.alive = false;
                            player.killCount++;
                        }
                    }
                });
            } else {
                if (
                    bullet.x < player.x + player.width &&
                    bullet.x + bullet.width > player.x &&
                    bullet.y < player.y + player.height &&
                    bullet.y + bullet.height > player.y
                ) {
                    bullet.active = false;
                    player.health -= 10;
                    if (player.health <= 0) {
                        gameOver();
                    }
                }
            }
        }
    });

    bullets.forEach((bullet, index) => {
        if (!bullet.active) {
            bullets.splice(index, 1);
        }
    });

    enemies.forEach((enemy, index) => {
        if (!enemy.alive) {
            enemies.splice(index, 1);
        }
    });
}


function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawPowerUps();
    drawScore();
    drawLevel();
    drawPlayerStats();

    updatePlayer();
    updateBullets();
    updateEnemies();
    updatePowerUps();

    requestAnimationFrame(gameLoop);
}

function gameOver() {
    alert("Game Over. ¿Quieres reiniciar el juego?");
    resetGame();
}

function resetGame() {
    gameSpeed = 1;
    clearInterval(enemySpawnInterval);
    clearInterval(powerUpSpawnInterval);

    player.x = 50;
    player.y = canvas.height - 100;
    player.health = 100;
    player.killCount = 0;
    bullets.length = 0;
    enemies.length = 0;
    powerUps.length = 0;

    gameSpeed = 1;
    startEnemySpawning();
    startPowerUpSpawning();

    enemySpawnInterval = setInterval(spawnEnemy, 2000);
    powerUpSpawnInterval = setInterval(spawnPowerUp, 10000);

    gameLoop();
}

Promise.all([
    backgroundImage.onload,
    playerImage.onload,
    enemyImage.onload,
    bulletImage.onload,
    powerUpImage.onload,
]).then(() => {
    console.log("Todas las imágenes se han cargado correctamente.");
    gameLoop();
});

startButton.addEventListener("click", () => {
    resetGame();
});

stopButton.addEventListener("click", () => {
    alert("El juego se ha detenido.");
});

pauseButton.addEventListener("click", () => {
    alert("El juego se ha pausado.");
});



// Lógica adicional del juego, como eventos, funciones auxiliares, etc.

gameLoop();
console.log(playerScore);