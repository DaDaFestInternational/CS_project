class Wall {

    constructor() {

        this.radius = random(50, 100);
        this.x = random(-this.radius, width+this.radius);
        this.y = random(-this.radius, height+this.radius);

        while (this.collide(player)) {
            this.x = random(width);
            this.y = random(height);
        }

        this.dead = false;

        this.frameCountOffset = int(random(100));
        this.amplitude = random(5, 10);
        this.direction = random([-1, 1]);
        this.speed = random(0.3, 0.8);
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
        ellipse(this.x, this.y, this.radius + sin(this.frameCountOffset + frameCount*this.speed)*this.amplitude*this.direction);
    }

    kill() {

        this.dead = true;
    }
}