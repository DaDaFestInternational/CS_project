class Door {

    constructor(x, y) {

        this.radius = 0;
        this.targetRadius = player.radius*2;
        this.dilate = 0;
        this.dilateFrame = 0;

        this.x = x;
        this.y = y;
    }

    collide(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < (this.radius+this.dilate+collider.radius)/2) {
            return true;
        }
    }

    enter(player) {

        if (dist(player.x, player.y, this.x, this.y) < 1) {
            return true;
        }
    }

    inside(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < (this.radius+this.dilate-collider.radius)/2) {
            return true;
        }
    }

    collidesWithWalls() {

        for (let i = 0; i < walls.length; i++) {

            if (this.collide(walls[i])) return true;
        }

        return false;
    }

    update() {

        if (!player.hasKey) return;

        if (this.radius < this.targetRadius) {
            this.radius++;
        } else {
            if (this.dilateFrame == 0) this.dilateFrame = frameCount;
            this.dilate = sin(frameCount - this.dilateFrame) * 10;
        }
    }

    display() {

        if (!player.hasKey) return;

        ballCanvas.strokeWeight(4);
        ballCanvas.stroke(palette.black);
        ballCanvas.fill(palette.gold);
        ballCanvas.ellipse(this.x, this.y, this.radius + this.dilate);
        ballCanvas.noStroke();

        objectCanvas.strokeWeight(4);
        objectCanvas.stroke(palette.black);
        objectCanvas.fill(palette.gold);
        objectCanvas.ellipse(this.x, this.y, this.radius + this.dilate);
        objectCanvas.noStroke();
    }
}