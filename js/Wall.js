class Wall {

    constructor(x, y, size) {

        this.startRadius = random(size-25, size+25);
        this.startRadius = int(this.startRadius/10)*10 + 3;
        this.radius = this.startRadius;
        this.x = x;
        this.y = y;

        // this.x = random(-this.radius, width+this.radius);
        // this.y = random(-this.radius, height+this.radius);

        while (this.collide(player)) {
            this.x = random(width);
            this.y = random(height);
        }

        this.strokeWeight = random(1, 3);

        this.dead = false;
        this.lava = false;

        let score = lavaCount > 30 ? 30 : lavaCount;

        if (act == 1 || act == 3) {
            if (size < 500 && random() < 0.02 * score) {
                this.lava = true;
            }
        }

        this.frameCountOffset = int(random(100));
        this.amplitude = random(5, 10);
        this.direction = random([-1, 1]);
        this.speed = random(0.3, 0.8);
    }

    update() {

        // this.radius = this.startRadius + sin(this.frameCountOffset + frameCount*this.speed)*this.amplitude*this.direction;
    }

    collide(collider) {

        if (this.dead) return false;

        if (dist(collider.x, collider.y, this.x, this.y) < (this.radius+collider.radius)/2) {
            return true;
        }
    }

    display(turn) {

        if (this.dead) return;

        if (turn == 0 && !this.lava) return;
        if (turn == 1 && this.lava) return;

        wallCanvas.fill(palette.white);

        if (this.lava) {
            wallCanvas.strokeWeight(10);

            if (player.hasKey) {
                wallCanvas.stroke(palette.black);
            } else {
                wallCanvas.stroke(palette.lava);
            }
        } else {
            wallCanvas.strokeWeight(1);

            if (this.y < height/2 + 25 && this.y > height/2 - 25) {
                wallCanvas.stroke(palette.dark);
            } else if (this.y > height/2) {
                wallCanvas.stroke(palette.light);
            } else {
                wallCanvas.stroke(palette.mid);
            }
        }

        let lavaLeeway = -5;

        let firstIteration = true;

        for (let i = this.radius + lavaLeeway; i > 0; i-=10) {

            wallCanvas.ellipse(this.x, this.y, i);

            if (firstIteration) {
                firstIteration = false;
                wallCanvas.strokeWeight(1);
            }
        }
    }

    kill() {

        this.dead = true;
    }
}