class GameObject {
    constructor(tag, position, size, sprite, collider) {
        this.tag = tag;
        this.position = position;
        this.size = size;
        this.sprite = sprite;
        this.collider = collider;

        if (sprite == null) {
            this.image == null;
        } else {
            this.image = new Image();
            this.image.src = sprite.src;
        }
    }

    draw(context) {
        let image = this.image;
        let collider = this.collider;
        if (this.sprite != null) {
            let x = this.position.x;
            let y = this.position.y;
            let w = this.size.x;
            let h = this.size.y;
            let sprite = this.sprite;

            if (this.image.complete) {
                context.drawImage(
                    image,
                    sprite.pos.x,
                    sprite.pos.y,
                    sprite.size.x,
                    sprite.size.y,
                    x,
                    y,
                    w,
                    h
                );
            } else {
                image.onload = function() {
                    context.drawImage(
                        image,
                        sprite.pos.x,
                        sprite.pos.y,
                        sprite.size.x,
                        sprite.size.y,
                        x,
                        y,
                        w,
                        h
                    );
                    console.log("image", image);
                };
            }
        }

        //draw collider
        if (collider != null) {
            if (collider.type === "circle") {
                context.beginPath();
                context.strokeStyle = "green";
                context.arc(
                    collider.position.x,
                    collider.position.y,
                    collider.radius,
                    0,
                    2 * Math.PI
                );
                context.stroke();
            } else if (collider.type === "box") {
                context.beginPath();
                context.strokeStyle = "red";
                let origin = new Vector2(collider.position.x, collider.position.y);
                origin.x -= collider.size.x / 2;
                origin.y -= collider.size.y / 2;

                context.rect(origin.x, origin.y, collider.size.x, collider.size.y);
                context.stroke();
            }
        }
    }

    translate(destination) {
        this.position.x = destination.x;
        this.position.y = destination.y;

        if (this.collider != null) {
            let center = this.getCenter();
            this.collider.position.x = center.x + this.collider.offset.x;
            this.collider.position.y = center.y + this.collider.offset.y;
        }
    }

    getCenter() {
        let center = new Vector2(this.position.x, this.position.y);
        center.x += this.size.x / 2;
        center.y += this.size.y / 2;

        return center;
    }
}

class Player extends GameObject {
    constructor(position, size, sprite, collider, yTopLimit, yBotLimit) {
        super("player", position, size, sprite, collider);
        this.yTopLimit = yTopLimit;
        this.yBotLimit = yBotLimit;

        //TODO: maybe put these in the constructor params???
        this.acceleration = 0.2;
        this.maxSpeed = 4;
        this.currentSpeed = 0;
        this.goUp = false;
    }

    update() {
        if (this.goUp) {
            this.currentSpeed -= this.acceleration;
        } else {
            this.currentSpeed += this.acceleration;
        }

        // clamp the speed between -maxSpeed and maxSpeed
        if (Math.abs(this.currentSpeed) > this.maxSpeed) {
            this.currentSpeed = Math.sign(this.currentSpeed) * this.maxSpeed;
        }

        let newPosition = new Vector2(this.position.x, this.position.y);
        newPosition.y += this.currentSpeed;

        if (newPosition.y < this.yTopLimit) {
            newPosition.y = this.yTopLimit;
        }

        if (newPosition.y > this.yBotLimit) {
            newPosition.y = this.yBotLimit;
        }

        this.translate(newPosition);
    }
}

class Enemy extends GameObject {
    constructor(position, size, sprite, collider, speed) {
        super("enemy", position, size, sprite, collider);
        this.speed = speed;
    }

    update() {
        let newPosition = new Vector2(this.position.x, this.position.y);
        newPosition.x -= this.speed;
        this.translate(newPosition);
    }
}

class EnemySpawner extends GameObject {
    constructor(xPos, yTop, yBot, minTime, maxTime, speed) {
        super("spawner", null, null, null, null);

        this.xPos = xPos;
        this.yTop = yTop;
        this.yBot = yBot;
        this.minTime = minTime * 1000;
        this.maxTime = maxTime * 1000;
        this.speed = speed;

        this.timeUntilSpawn = Math.floor(Math.random() * this.maxTime) + this.minTime;
    }

    update(deltaTime, gameObjects) {
        this.timeUntilSpawn -= deltaTime;
        if (this.timeUntilSpawn <= 0) {
            let newEnemy = this.createEnemy();
            console.log("spawned new enemy", newEnemy);
            gameObjects.push(newEnemy);

            this.timeUntilSpawn = Math.floor(Math.random() * this.maxTime) + this.minTime;
        }
    }

    createEnemy() {
        let yPos = Math.floor(Math.random() * this.yBot) + this.yTop;
        let enemyPos = new Vector2(this.xPos, yPos);
        let enemySize = new Vector2(128, 128);
        let enemyCenter = new Vector2(enemyPos.x + enemySize.x / 2, enemyPos.y + enemySize.y / 2);
        let enemySprite = new Sprite(
            "/assets/sprites/spritesheet.png",
            null,
            new Vector2(128, 128)
        );
        let enemyCollider = null;
        let enemyType = Math.floor(Math.random() * 3);

        switch (enemyType) {
            case 0:
                enemySprite.pos = new Vector2(128, 0);
                enemyCollider = new BoxCollider(
                    enemyCenter,
                    new Vector2(0, 0),
                    new Vector2(80, 115)
                );
                break;
            case 1:
                enemySprite.pos = new Vector2(256, 0);
                enemyCollider = new BoxCollider(
                    enemyCenter,
                    new Vector2(0, 5),
                    new Vector2(80, 115)
                );
                break;
            case 2:
                enemySprite.pos = new Vector2(384, 0);
                enemyCollider = new BoxCollider(
                    enemyCenter,
                    new Vector2(3, 5),
                    new Vector2(65, 115)
                );
                break;
        }

        return new Enemy(enemyPos, enemySize, enemySprite, enemyCollider, this.speed);
    }
}
