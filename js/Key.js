class Key {

    constructor(x, y) {

        this.radius = 15;

        this.x = x;
        this.y = y;

        this.currentX = this.x;
        this.currentY = this.y;

        this.targetX = this.x + random(-20, 20);
        this.targetY = this.y + random(-20, 20);
    }

    collide(collider) {

        if (dist(collider.x, collider.y, this.currentX, this.currentY) < (this.radius+collider.radius)/2) {
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

        if (player.hasKey) return;

        let radius = 20;

        if (frameCount % 100 == 1) {
            this.targetX = this.x + random(-radius, radius);
            this.targetY = this.y + random(-radius, radius);
        }

        this.currentX = lerp(this.currentX, this.targetX, 0.01);
        this.currentY = lerp(this.currentY, this.targetY, 0.01);
    }

    display() {

        if (player.hasKey) return;

        ballCanvas.strokeWeight(2);
        ballCanvas.stroke(palette.black);
        ballCanvas.fill(palette.white);
        ballCanvas.ellipse(this.currentX, this.currentY, this.radius);
        ballCanvas.noStroke();

        objectCanvas.strokeWeight(2);
        objectCanvas.stroke(palette.black);
        objectCanvas.fill(palette.white);
        objectCanvas.ellipse(this.currentX, this.currentY, this.radius);
        objectCanvas.noStroke();
    }
}