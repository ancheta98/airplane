//TODO: style the game to look a lot nicer
// maybe go for a 2000s aesthetic (old newgrounds)
// metal pattern background
//cheat code input (layers = shrek player, wow = doge, godmode = decrease settimeout time for faster gameplay)
//when planes hit the bottom of game div, end the game ("base infiltrated")
//when an enemy is defeated spawn in another
// optimize obstacles

var player = {
  left: 450,
  top: 380
};
//obstacles spawn randomly
var obstacles = [
  { left: Math.random() * 700, top: Math.random() * 300 },
  { left: Math.random() * 850, top: 100 },
  { left: Math.random() * 800, top: Math.random() * 100 },
  { left: Math.random() * 850, top: 100 },
  { left: Math.random() * 850, top: 0 },
  { left: Math.random() * 850, top: Math.random() * 100 },
  { left: Math.random() * 850, top: 0 }
];
var enemies = [
  { left: 700, top: 0 },
  { left: 200, top: 100 },
  { left: 400, top: 0 },
  { left: 500, top: 100 }
];

var missiles = [];

var score = 0;

function drawPlayer() {
  content =
    "<div class ='player' style='left:" +
    player.left +
    "px; top:" +
    player.top +
    "px'></div>";

  document.getElementById("players").innerHTML = content;
}

function drawEnemies() {
  content = "";
  for (var idx = 0; idx < enemies.length; idx++) {
    content +=
      "<div class='enemy' style='left:" +
      enemies[idx].left +
      "px; top:" +
      enemies[idx].top +
      "px'></div>";
  }
  document.getElementById("enemies").innerHTML = content;
}

function createEnemy() {
  content = "";
  if (enemies.length < 4) {
    enemies.push({ left: Math.random() * 700, top: 0 });
  }
}
function drawObstacles() {
  content = "";
  for (var idx = 0; idx < obstacles.length; idx++) {
    content +=
      "<div class='obstacle' style='left:" +
      obstacles[idx].left +
      "px; top:" +
      obstacles[idx].top +
      "px'></div>";
  }
  document.getElementById("obstacles").innerHTML = content;
}

function drawMissiles() {
  content = "";
  for (var idx = 0; idx < missiles.length; idx++) {
    content +=
      "<div class='missile' style='left:" +
      missiles[idx].left +
      "px; top:" +
      missiles[idx].top +
      "px'></div>";
  }
  document.getElementById("missile").innerHTML = content;
}

function moveEnemies() {
  for (var idx = 0; idx < enemies.length; idx++) {
    if (enemies[idx].top < 400) {
      enemies[idx].top = enemies[idx].top + 1;
    } else {
      stopGame();
    }
  }
}
function moveObstacles() {
  for (var idx = 0; idx < obstacles.length; idx++) {
    if (obstacles[idx].top > 430) {
      obstacles[idx].top = 0;
      obstacles[idx].left = Math.random() * 700;
    } else {
      obstacles[idx].top = obstacles[idx].top + 2;
    }
  }
}
function moveMissiles() {
  for (var idx = 0; idx < missiles.length; idx++) {
    missiles[idx].top = missiles[idx].top - 25;
    if (missiles[idx].top < 5) {
      missiles[idx] = missiles[missiles.length - 1];
      missiles.pop();
    }
  }
}

document.onkeydown = function(e) {
  if (e.keyCode === 37 && player.left > 0) {
    //left
    player.left = player.left - 15;
  }
  if (e.keyCode === 39 && player.left < 825) {
    //right
    player.left = player.left + 15;
  }
  if (e.keyCode === 38 && player.top > 250) {
    //up
    player.top = player.top - 15;
  }
  if ((e.keyCode === 40) & (player.top < 380)) {
    //down
    player.top = player.top + 15;
  }
  if (e.keyCode == 32) {
    //fire (spacebar)
    missiles.push({ left: player.left + 30, top: player.top - 8 });
    drawMissiles();
  }
  drawPlayer();
};
//if enemy is hit with missile
function detectCollisionEnemies() {
  for (var i = 0; i < missiles.length; i++) {
    for (var x = 0; x < enemies.length; x++) {
      if (
        Math.abs(missiles[i].left - enemies[x].left) < 50 &&
        Math.abs(missiles[i].top - enemies[x].top) < 40
      ) {
        console.log(enemies[x], x);
        enemies.splice(x, 1);
        createEnemy();
        console.log(enemies);
        score += 500;
      }
    }
  }
}
//if player is hit by enemy
function collisionPlayerEnemy() {
  for (var x = 0; x < enemies.length; x++) {
    if (
      Math.abs(player.left - enemies[x].left) < 50 &&
      Math.abs(player.top - enemies[x].top) < 40
    ) {
      console.log("player hit");
      score -= 50;
    }
  }
}
//if player is hit with obstacle
function collisionPlayerObstacle() {
  for (var x = 0; x < obstacles.length; x++) {
    if (
      Math.abs(player.left - obstacles[x].left) < 50 &&
      Math.abs(player.top - obstacles[x].top) < 40
    ) {
      console.log("player hit by obs");

      score -= 25;
      obstacles.splice(x, 1);
      createObstacle();
    }
  }
}
//creates new obstacle when obstacle is hit up to 7
function createObstacle() {
  if (obstacles.length < 7) {
    obstacles.push({ left: Math.random() * 700, top: 0 });
  } else {
    console.log("max obstacles");
  }
}
//if missile hits obstacle
function detectCollisionObstacles() {
  for (var i = 0; i < missiles.length; i++) {
    for (var b = 0; b < obstacles.length; b++) {
      if (
        Math.abs(missiles[i].left - obstacles[b].left) < 40 &&
        Math.abs(missiles[i].top - obstacles[b].top) < 40
      ) {
        obstacles.splice(b, 1);
        console.log(obstacles);
        console.log(b, "obstacle");
        createObstacle();
        console.log("obstacle hit");
      }
    }
  }
}
function displayScore() {
  document.getElementById("score").innerHTML = score;
}

// runs a game function which causes all object movement and game logic
function gameLoop() {
  drawPlayer();

  drawObstacles();
  moveObstacles();

  drawEnemies();
  moveEnemies();

  detectCollisionEnemies();
  detectCollisionObstacles();

  collisionPlayerEnemy();
  collisionPlayerObstacle();

  moveObstacles();
  drawObstacles();
  moveMissiles();
  drawMissiles();
  displayScore();

  setTimeout(gameLoop, 50);
}
function stopGame(){
    console.log("base infiltrated")
}
gameLoop();
