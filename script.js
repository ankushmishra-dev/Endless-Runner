const game = document.getElementById("game");
const player = document.getElementById("player");
const coinSound = document.getElementById("coinSound");
const hitSound = document.getElementById("hitSound");
const bgMusic = document.getElementById("bgMusic");
const popup = document.getElementById("gameOverPopup");
const finalScoreText = document.getElementById("finalScore");
const scorePanel = document.getElementById("scorePanel");
const powerupTimer = document.getElementById("powerupTimer");

let score = 0, coins = 0, playerPos = 175, gameRunning = true;
let speed = 5;
let invincible = false;

function createItem() {
  const rand = Math.random();
  let item = document.createElement("img");

  if (rand < 0.01) {
    item.src = "images/note.png";
    item.className = "note";
  } else if (rand < 0.02) {
    item.src = "images/powerup.png";
    item.className = "powerup";
  } else if (rand < 0.3) {
    item.src = "images/coin.png";
    item.className = "coin";
  } else {
    item.src = "images/ball.png";
    item.className = "obstacle";
  }

  item.style.left = Math.floor(Math.random() * 360) + "px";
  item.style.top = "-40px";
  game.appendChild(item);
}

function moveItems() {
  const items = document.querySelectorAll(".coin, .obstacle, .note, .powerup");
  items.forEach((item) => {
    item.style.top = parseInt(item.style.top) + speed + "px";

    if (parseInt(item.style.top) > 600) item.remove();

    const itemLeft = parseInt(item.style.left);
    const itemTop = parseInt(item.style.top);
    const playerLeft = parseInt(player.style.left);

    if (itemTop > 500 && itemTop < 560 && itemLeft > playerLeft - 30 && itemLeft < playerLeft + 50) {
      if (item.className === "coin") {
        score++; coins++;
        coinSound.play(); item.remove();
      } else if (item.className === "note") {
        score += 10; coins++;
        coinSound.play(); item.remove();
      } else if (item.className === "powerup") {
        invincible = true;
        let timeLeft = 5;
        powerupTimer.innerText = timeLeft;
        powerupTimer.style.display = "block";

        const timerInterval = setInterval(() => {
          timeLeft--;
          powerupTimer.innerText = timeLeft;
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            powerupTimer.style.display = "none";
            invincible = false;
          }
        }, 1000);

        item.remove();
      } else if (item.className === "obstacle" && !invincible) {
        endGame();
      }
    }
  });

  scorePanel.innerText = "Score: " + score + " | Coins: " + coins;
}

function gameLoop() {
  if (!gameRunning) return;
  moveItems();
  if (Math.random() < 0.08) createItem();
  speed += 0.001; 
}

setInterval(gameLoop, 50);

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowLeft" && playerPos > 0) playerPos -= 30;
  if (e.key === "ArrowRight" && playerPos < 350) playerPos += 30;
  player.style.left = playerPos + "px";
});

function endGame() {
  gameRunning = false;
  hitSound.play();
  finalScoreText.textContent = `Your Score: ${score} | Coins: ${coins}`;
  popup.style.display = "block";
}

function restartGame() {
  location.reload();
}

let startX = null;
game.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

game.addEventListener("touchend", (e) => {
  if (!startX) return;
  const endX = e.changedTouches[0].clientX;
  if (endX < startX && playerPos > 0) playerPos -= 30;
  if (endX > startX && playerPos < 350) playerPos += 30;
  player.style.left = playerPos + "px";
  startX = null;
});
