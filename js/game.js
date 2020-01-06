var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");
var body = document.getElementsByTagName("body")[0];

window.addEventListener(
    "keydown",
    function(event) {
        if (event.keyCode == 32) {
            // On press SPACE make the player go up
            player.goUp = true;
        }
    },
    true
);

window.addEventListener(
    "keyup",
    function(event) {
        if (event.keyCode == 32) {
            // On release SPACE make the player go down
            player.goUp = false;
        } else if (event.keyCode == 27) {
            // On release ESC toggle pause state
            if (gameState === GameStates.PLAYING) {
                pauseGame();
            } else if (gameState === GameStates.PAUSED) {
                resumeGame();
            }
        }
    },
    true
);

// Enum to keep track of the current gameState
const GameStates = {
    MAIN_MENU: 0,
    PLAYING: 1,
    PAUSED: 2,
    GAME_OVER: 3
};

function pauseGame() {
    gameState = GameStates.PAUSED;
    // Pause the background music
    audioManager.audioComponents[0].pause();
    body.appendChild(pause_ui);

    // Add onclick to the buttons
    let pause_ui_resume_btn = document.getElementById("pause-ui-resume-button");
    pause_ui_resume_btn.addEventListener("click", resumeGame);

    let pauseUiExitBtn = document.getElementById("pause-ui-exit-button");
    pauseUiExitBtn.addEventListener("click", exitGame);
}

function resumeGame() {
    gameState = GameStates.PLAYING;

    // Resume the background music
    audioManager.audioComponents[0].play();
    body.removeChild(document.getElementById("pause-ui-container"));
}

function gameOver() {
    gameState = GameStates.GAME_OVER;
    body.appendChild(gameover_ui);

    score = Math.floor(distance);
    let gameover_ui_score = document.getElementById("gameover-ui-score");
    gameover_ui_score.textContent += score;

    // Add onclick to the buttons
    let gameover_ui_restart_btn = document.getElementById("gameover-ui-restart-button");
    gameover_ui_restart_btn.addEventListener("click", startGame);

    let gameOverUiExit = document.getElementById("gameover-ui-exit-button");
    gameOverUiExit.addEventListener("click", exitGame);

    // On GameOver get the score from localStorage for the logged user
    // If it does not exist or the current score is higher, change the localStorage
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
        } else if (score > highscores[i].score) {
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

    // On exit delete all gameobjects
    cleanup()

    // Pause the audio
    audioManager.audioComponents[0].pause();

    mainMenu();
}

function mainMenu() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    gameState = GameStates.MAIN_MENU;

    body.appendChild(mainMenuUi);
    let mainMenuUiContainer = document.getElementById("mainmenu-ui-container");

    // Show the Login or Logout button depending on the logged_in state
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
        new Vector2(50, 100), // Position
        new Vector2(128, 128), // Size
        new Sprite("/assets/sprites/spritesheet.png", new Vector2(0, 0), new Vector2(128, 128)), // Sprite
        null, // Collider
        20 + 40, // yTopLimit
        canvas.clientHeight - 128 - 20 // yBotLimit
    );
    player.collider = new CircleCollider(player.getCenter(), new Vector2(0, -3), 55);

    gameObjects.push(player);

    enemySpawner = new EnemySpawner(
        canvas.clientWidth + 200, // xPos
        20 + 40, // yTop
        canvas.clientHeight - 128 - 20, // yBot
        1, // minTime
        2.5, // maxTime
        speed // speed
    );

    lastTick = performance.now();
    thisTick = performance.now();
    deltaTime = thisTick - lastTick;

    // (Re)Start background music
    audioManager.audioComponents[0].currentTime = 0;
    audioManager.audioComponents[0].play();
}

function cleanup() {
    // Delete all gameobjects
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

// Paragraph to display debug info
var debugParagraph = document.getElementById("p-debug");

function printDebugInfo() {
    debugParagraph.innerHTML = "Distance: " + Math.floor(distance) + "<br>Speed: " + speed;
}

// Create audio manager
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
        let toDestroyIndex = [];
        gameObjects.forEach(obj => {
            obj.update();
            // When an object has passed the player, remove it from the list and delete it
            if (player.position.x - obj.position.x > 200) {
                toDestroyIndex.push(gameObjects.indexOf(obj));
            }
        });

        let i;
        for (i = 0; i < toDestroyIndex.length; i++) {
            let obj = gameObjects[toDestroyIndex[i]];
            gameObjects.splice(toDestroyIndex[i], 1);
            delete obj;
        }

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
