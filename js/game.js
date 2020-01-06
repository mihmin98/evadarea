var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");
var body = document.getElementsByTagName("body")[0];

window.addEventListener(
    "keydown",
    function(event) {
        if (event.keyCode == 32) {
            player.goUp = true;
        }
    },
    true
);

window.addEventListener(
    "keyup",
    function(event) {
        if (event.keyCode == 32) {
            // SPACE
            player.goUp = false;
        } else if (event.keyCode == 27) {
            // ESC
            if (gameState === GameStates.PLAYING) {
                pauseGame();
            } else if (gameState === GameStates.PAUSED) {
                resumeGame();
            }
        }
    },
    true
);

const GameStates = {
    MAIN_MENU: 0,
    PLAYING: 1,
    PAUSED: 2,
    GAME_OVER: 3
};

gameState = GameStates.PLAYING;

function pauseGame() {
    gameState = GameStates.PAUSED;
    audioManager.audioComponents[0].pause();
    body.appendChild(pause_ui);

    let pause_ui_resume_btn = document.getElementById("pause-ui-resume-button");
    pause_ui_resume_btn.addEventListener("click", resumeGame);

    let pauseUiExitBtn = document.getElementById("pause-ui-exit-button");
    pauseUiExitBtn.addEventListener("click", exitGame);
}

function resumeGame() {
    gameState = GameStates.PLAYING;
    audioManager.audioComponents[0].play();
    body.removeChild(document.getElementById("pause-ui-container"));
}

function gameOver() {
    gameState = GameStates.GAME_OVER;
    body.appendChild(gameover_ui);

    score = Math.floor(distance);
    let gameover_ui_score = document.getElementById("gameover-ui-score");
    gameover_ui_score.textContent += score;

    let gameover_ui_restart_btn = document.getElementById("gameover-ui-restart-button");
    gameover_ui_restart_btn.addEventListener("click", startGame);

    let gameOverUiExit = document.getElementById("gameover-ui-exit-button");
    gameOverUiExit.addEventListener("click", exitGame);

    // La GameOver sa se ia din localStorage scorul pt userul logat curent
    // Daca nu exista sau scoru curent e mai mare se baga in localStorage
    let logged_in = JSON.parse(window.localStorage.getItem("logged_in"));
    if (logged_in) {
        let highscores = JSON.parse(window.localStorage.getItem("highscores"));
        if (highscores == null) {
            highscores = [];
        }
        let username = window.localStorage.getItem("username");
        let i;
        let found = false;
        for (i = 0; i < highscores.length; i++) {
            if (highscores[i].user === username) {
                found = true;
                break;
            }
        }

        if (!found) {
            let newHighscore = {
                user: username,
                score: score
            };
            highscores.push(newHighscore);
        } else {
            highscores[i].score = score;
        }

        json = JSON.stringify(highscores);
        window.localStorage.setItem("highscores", json);
    }
}

function exitGame() {
    if (gameState == GameStates.GAME_OVER) {
        body.removeChild(document.getElementById("gameover-ui-container"));
    }

    if (gameState == GameStates.PAUSED) {
        body.removeChild(document.getElementById("pause-ui-container"));
    }

    gameObjects = [];
    audioManager.audioComponents[0].pause();

    mainMenu();
}

function mainMenu() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    gameState = GameStates.MAIN_MENU;

    body.appendChild(mainMenuUi);
    let mainMenuUiContainer = document.getElementById("mainmenu-ui-container");

    let loginState = JSON.parse(window.localStorage.getItem("logged_in"));
    if (loginState == true) {
        mainMenuUiContainer.removeChild(document.getElementById("mainmenu-ui-login-button"));
    } else {
        mainMenuUiContainer.removeChild(document.getElementById("mainmenu-ui-logout-button"));
    }

    let playBtn = document.getElementById("mainmenu-ui-play-button");
    playBtn.addEventListener("click", startGame);
}

function startGame() {
    // Remove other ui
    if (gameState == GameStates.GAME_OVER) {
        body.removeChild(document.getElementById("gameover-ui-container"));
    }

    if (gameState == GameStates.MAIN_MENU) {
        body.removeChild(document.getElementById("mainmenu-ui-container"));
    }

    gameState = GameStates.PLAYING;
    start();
}

function init() {
    gameObjects = [];

    distance = 0;

    speed = 5; // horizontal movement speed, should increase once every x distance
    speedIncrement = 0.03; // the amount of speed that should be increased
    speedIncrementDistance = 10; // how often should the speed increase

    distanceUntilSpeedIncrement = speedIncrementDistance;

    player = new Player(
        new Vector2(50, 100),
        new Vector2(128, 128),
        new Sprite("/assets/sprites/spritesheet.png", new Vector2(0, 0), new Vector2(128, 128)),
        null,
        20 + 40,
        canvas.clientHeight - 128 - 20
    );
    player.collider = new CircleCollider(player.getCenter(), new Vector2(0, -3), 55);

    gameObjects.push(player);

    enemySpawner = new EnemySpawner(
        canvas.clientWidth + 200,
        20 + 40,
        canvas.clientHeight - 128 - 20,
        1,
        2.5,
        speed
    );

    lastTick = performance.now();
    thisTick = performance.now();
    deltaTime = thisTick - lastTick;

    audioManager.audioComponents[0].currentTime = 0;
    audioManager.audioComponents[0].play();
}

function reinit() {
    delete player;
    delete enemySpawner;
    gameObjects.forEach(obj => {
        delete obj;
    });
}

function tick() {
    lastTick = thisTick;
    thisTick = performance.now();
    deltaTime = thisTick - lastTick;
}

function updateDistance() {
    let d = (speed * deltaTime) / 1000;
    distance += d;
    distanceUntilSpeedIncrement -= d;

    if (distanceUntilSpeedIncrement <= 0) {
        distanceUntilSpeedIncrement = speedIncrementDistance;
        speed += speedIncrement;

        enemySpawner.speed = speed;
    }
}

var debugParagraph = document.getElementById("p-debug");

function printDebugInfo() {
    debugParagraph.innerHTML = "Distance: " + Math.floor(distance) + "<br>Speed: " + speed;
}

audioManager = new AudioManager(null);
audioManager.audioSources.push("/assets/audio/dani_mocanu_evadarea.ogg");
audioManager.create(0, true); //background music

function checkCollisions() {
    let n = gameObjects.length;
    for (i = 0; i < n - 1; i++) {
        for (j = i + 1; j < n; j++) {
            // player - enemy
            if (
                (gameObjects[i].tag === "player" && gameObjects[j].tag === "enemy") ||
                (gameObjects[i].tag === "enemy" && gameObjects[j].tag === "player")
            ) {
                if (Collider.checkCollision(gameObjects[i].collider, gameObjects[j].collider)) {
                    gameOver();
                }
            }
        }
    }
}

function update() {
    if (gameState == GameStates.PLAYING) {
        updateDistance();

        enemySpawner.update(deltaTime, gameObjects);
        gameObjects.forEach(obj => {
            obj.update();
            // TODO: cand un dujman a trecut departe de player sa il scot din lista si sa il distrug
        });

        checkCollisions();
    }

    printDebugInfo();
}

function draw() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    gameObjects.forEach(obj => {
        obj.draw(context);
    });

    context.font = "30px Arial";
    context.fillText("Distance: " + Math.floor(distance), 10, 40);
}

function gameloop() {
    if (gameState != GameStates.PLAYING && gameState != GameStates.PAUSED) {
        return;
    }

    tick();
    update();
    draw();

    requestAnimationFrame(gameloop);
}

function start() {
    init();
    gameloop();
}

canvas.onload = mainMenu();
