class Collectable {

    constructor() {

        this.radius = 20;
        this.x = random(100, width-100);
        this.y = random(100, height-100);

        while (dist(player.x, player.y, this.x, this.y) < 100 || dist(width/2, 100, this.x, this.y) < 50) {
            this.x = random(100, width-100);
            this.y = random(100, height-100);
        }
    }

    collide() {

        if (dist(player.x, player.y, this.x, this.y) < (this.radius+player.radius)/2) {
            return true;
        }
    }

    display() {

        strokeWeight(2);
        stroke(palette.dark);
        fill(palette.light);
        ellipse(this.x, this.y, this.radius);
        noStroke();
    }
}