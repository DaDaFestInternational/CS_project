class RisingWater {

    constructor() {

        this.direction = random(["up", "down", "left", "right"]);

        this.x = width/2;
        this.y = height/2;

        if (this.direction == "up") {
            this.y+=height;
        } else if (this.direction == "down") {
            this.y-=height;
        } else if (this.direction == "left") {
            this.x-=width;
        } else if (this.direction == "right") {
            this.x+=width;
        }

        this.speed = 0.5;

        waterCanvas.clear();
    }

    update() {

        if (player.hasKey) {
            waterCanvas.clear();
            player.inWater = false;
            return;
        }

        // if (player.hasKey) {
        //     player.inWater = false;
        //     waterCanvas.clear();
        //     return;
        // }

        if (this.x == width/2 && this.y == height/2) return;

        if (this.direction == "up") {
            if (player.y > this.y-height/2+50) player.inWater = true;
            if (!player.hasKey) this.y -= 0.5;
        } else if (this.direction == "down") {
            if (player.y < this.y+height/2-50) player.inWater = true;
            if (!player.hasKey) this.y += 0.5;
        } else if (this.direction == "left") {
            if (player.x < this.x+width/2-50) player.inWater = true;
            if (!player.hasKey) this.x += 0.5;
        } else if (this.direction == "right") {
            if (player.x > this.x-width/2+50) player.inWater = true;
            if (!player.hasKey) this.x -= 0.5;
        }
    }

    display() {

        if (player.hasKey) return;

        waterCanvas.fill(169, 179, 105, 1);
        waterCanvas.rectMode(CENTER);
        waterCanvas.rect(this.x, this.y, width, height);
    }
}