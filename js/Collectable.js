class Collectable {

    constructor() {

        this.radius = 20;
        // this.x = random(100, width-100);
        // this.y = random(100, height-100);

        // while (dist(player.x, player.y, this.x, this.y) < 100 || dist(width/2, 100, this.x, this.y) < 50 || this.collidesWithWalls()) {
        //     this.x = random(100, width-100);
        //     this.y = random(100, height-100);
        // }

        this.x = pathMaker.x;
        this.y = pathMaker.y;
    }

    collide(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < (this.radius+collider.radius)/2) {
            return true;
        }
    }

    collidesWithWalls() {

        for (let i = 0; i < walls.length; i++) {

            if (this.collide(walls[i])) return true;
        }

        return false;
    }

    display() {

        strokeWeight(2);
        stroke(palette.dark);
        fill(palette.light);
        ellipse(this.x, this.y, this.radius);
        noStroke();
    }
}