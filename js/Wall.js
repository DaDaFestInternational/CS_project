class Wall {

    constructor() {

        this.radius = random(50, 200);
        this.x = random(-this.radius, width+this.radius);
        this.y = random(-this.radius, height+this.radius);

        while (this.collide(player)) {
            this.x = random(width);
            this.y = random(height);
        }

        this.dead = false;
    }

    update() {

    }

    collide(collider) {

        if (this.dead) return false;

        if (dist(collider.x, collider.y, this.x, this.y) < (this.radius+collider.radius)/2) {
            return true;
        }
    }

    display() {

        if (this.dead) return;

        fill(palette.black);
        ellipse(this.x, this.y, this.radius);
    }

    kill() {

        this.dead = true;
    }
}