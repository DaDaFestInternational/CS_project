class Wall {

    constructor(size) {

        this.startRadius = random(size-25, size+25);
        this.radius = this.startRadius;
        this.x = random(-this.radius, width+this.radius);
        this.y = random(-this.radius, height+this.radius);

        while (this.collide(player)) {
            this.x = random(width);
            this.y = random(height);
        }

        this.dead = false;
        this.bad = false;

        let score = scoreCount-9 > 30 ? 30 : scoreCount-9;

        if (size < 500 && random() < 0.02 * score) {
            this.bad = true;
        }

        this.frameCountOffset = int(random(100));
        this.amplitude = random(5, 10);
        this.direction = random([-1, 1]);
        this.speed = random(0.3, 0.8);
    }

    update() {

        this.radius = this.startRadius + sin(this.frameCountOffset + frameCount*this.speed)*this.amplitude*this.direction;
    }

    collide(collider) {

        if (this.dead) return false;

        if (dist(collider.x, collider.y, this.x, this.y) < (this.radius+collider.radius)/2) {
            return true;
        }
    }

    display(turn) {

        if (this.dead) return;

        if (turn == 0 && !this.bad) return;
        if (turn == 1 && this.bad) return;

        if (this.bad) {

            if (player.hasKey) {
                wallCanvas.stroke(palette.dark);
            } else {
                wallCanvas.stroke(palette.bad);
            }
            wallCanvas.strokeWeight(5);
        } else {
            wallCanvas.noStroke();
        }

        let badLeeway = this.bad ? 2 : 0;

        wallCanvas.fill(palette.black);
        wallCanvas.ellipse(this.x, this.y, this.radius + badLeeway);
    }

    kill() {

        this.dead = true;
    }
}