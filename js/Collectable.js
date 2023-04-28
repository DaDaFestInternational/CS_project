class Collectable {

    constructor() {

        this.radius = 15;
        // this.x = random(100, width-100);
        // this.y = random(100, height-100);

        // while (dist(player.x, player.y, this.x, this.y) < 100 || dist(width/2, 100, this.x, this.y) < 50 || this.collidesWithWalls()) {
        //     this.x = random(100, width-100);
        //     this.y = random(100, height-100);
        // }

        this.x = pathMaker.x;
        this.y = pathMaker.y;

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

        let radius = 20;

        if (frameCount % 100 == 1) {
            this.targetX = this.x + random(-radius, radius);
            this.targetY = this.y + random(-radius, radius);
        }

        this.currentX = lerp(this.currentX, this.targetX, 0.01);
        this.currentY = lerp(this.currentY, this.targetY, 0.01);
    }

    display() {

        ballCanvas.strokeWeight(2);
        ballCanvas.stroke(palette.dark);
        ballCanvas.fill(palette.light);
        ballCanvas.ellipse(this.currentX, this.currentY, this.radius);
        ballCanvas.noStroke();
    }
}