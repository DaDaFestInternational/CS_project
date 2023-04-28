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

        wallCanvas.strokeWeight(2);
        wallCanvas.stroke(palette.light);
        wallCanvas.fill(palette.light);
        wallCanvas.ellipse(this.x, this.y, this.radius + this.dilate);
        wallCanvas.noStroke();
    }
}