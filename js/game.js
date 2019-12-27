var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");

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
            player.goUp = false;
        }
    },
    true
);

function init() {
    gameObjects = [];
    speed = 5; // horizontal movement speed, should increase once every x distance
    speedIncrement = 0.01; // the amount of speed that should be increased
    speedIncrementDistance = 10;

    distance = 0;
    distanceUntilSpeedIncrement = speedIncrementDistance;

    player = new Player(
        new Vector2(50, 100),
        new Vector2(128, 128),
        new Sprite("/assets/sprites/spritesheet.png", new Vector2(0, 0), new Vector2(128, 128)),
        null,
        20,
        canvas.clientHeight - 128 - 20
    );
    player.collider = new CircleCollider(player.getCenter(), new Vector2(0, -3), 55);

    gameObjects.push(player);

    enemySpawner = new EnemySpawner(
        canvas.clientWidth + 200,
        20,
        canvas.clientHeight - 128 - 20,
        1,
        3,
        speed
    );

    lastTick = performance.now();
    thisTick = performance.now();
    deltaTime = thisTick - lastTick;
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
                    alert("ai murit");
                }
            }
        }
    }
}

function update() {
    updateDistance();

    enemySpawner.update(deltaTime, gameObjects);
    gameObjects.forEach(obj => {
        obj.update();
    });

    checkCollisions();

    printDebugInfo();
}

function draw() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    gameObjects.forEach(obj => {
        obj.draw(context);
    });
}

function gameloop() {
    tick();
    update();
    draw();

    requestAnimationFrame(gameloop);
}

function start() {
    init();
    gameloop();
}

canvas.onload = start();
