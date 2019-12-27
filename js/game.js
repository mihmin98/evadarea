var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");

var gameObjects = [];
var speed = 5; // horizontal movement speed, should increase once every x distance

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

var enemySpawner = new EnemySpawner(
    canvas.clientWidth + 200,
    20,
    canvas.clientHeight - 128 - 20,
    2,
    5,
    speed
);

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

var lastTick = performance.now();
var thisTick = performance.now();

function update() {
    enemySpawner.update(thisTick - lastTick, gameObjects);
    gameObjects.forEach(obj => {
        obj.update();
    });

    // TODO: Check collisions
}

function draw() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    gameObjects.forEach(obj => {
        obj.draw(context);
    });
}

function gameloop() {
    // frame time stuff
    lastTick = thisTick;
    thisTick = performance.now();

    update();
    draw();

    requestAnimationFrame(gameloop);
}

canvas.onload = gameloop();
