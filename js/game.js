var canvas = document.getElementById("gamecanvas");
var context = canvas.getContext("2d");

var gameObjects = [];

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

function update() {
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
    update();
    draw();

    requestAnimationFrame(gameloop);
}

canvas.onload = gameloop();
