class Collectable {

    constructor() {

        this.radius = 20;
        this.x = random(this.radius, width-this.radius);
        this.y = random(this.radius, height-this.radius);

        while (dist(player.x, player.y, this.x, this.y) < 100 || dist(width/2, 80, this.x, this.y) < 50) {
            this.x = random(this.radius, width-this.radius);
            this.y = random(this.radius, height-this.radius);
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