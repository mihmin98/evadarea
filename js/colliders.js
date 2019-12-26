class Collider {
    constructor(type, origin, offset) {
        this.type = type;
        this.origin = origin;
        this.offset = offset;

        this.position = new Vector2();
        this.position.x = origin.x + offset.x;
        this.position.y = origin.y + offset.y;
    }

    static checkCollision(collider1, collider2) {
        // circle - cirlce
        if (collider1.type === "circle" && collider2.type === "circle") {
            let x1 = collider1.position.x;
            let y1 = collider1.position.y;
            let r1 = collider1.radius;

            let x2 = collider2.position.x;
            let y2 = collider2.position.y;
            let r2 = collider2.radius;

            return Math.pow(x2 - x1, 2) + Math.pow(y1 - y2, 2) < Math.pow(r1 + r2, 2);
        }

        // TODO box - box

        // box - circle
        if (
            (collider1.type === "box" && collider2.type === "circle") ||
            (collider1.type === "circle" && collider2.type === "box")
        ) {
            let box = null;
            let circle = null;
            if (collider1 === "box") {
                box = collider1;
                circle = collider2;
            } else {
                box = collider2;
                circle = collider1;
            }

            let test = new Vector2(circle.position.x, circle.position.y);
            if (circle.position.x < box.position.x - box.size.x / 2) {
                test.x = box.position.x - box.size.x / 2;
            } else if (circle.position.x > box.position.x + box.size.x / 2) {
                test.x = box.position.x + box.size.x / 2;
            }

            if (circle.position.y < box.position.y - box.size.y / 2) {
                test.y = box.position.y - box.size.y / 2;
            } else if (circle.position.y > box.position.y + box.size.y / 2) {
                test.y = box.position.y + box.size.y / 2;
            }

            let dx = circle.position.x - test.x;
            let dy = circle.position.y - test.y;
            let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

            return d <= circle.radius;
        }
    }
}

class CircleCollider extends Collider {
    constructor(origin, offset, radius) {
        super("circle", origin, offset);
        this.radius = radius;
    }
}

class BoxCollider extends Collider {
    constructor(origin, offset, size) {
        super("box", origin, offset);
        this.size = size;
    }
}
