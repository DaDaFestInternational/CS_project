class ToxicWater {

    constructor() {

        this.x = random(width);
        this.y = random(height);
        this.radius = random(100, 200);

        for (let i = 0; i < 100; i++) this.display(i);
    }

    update() {

        if (player.hasKey) return;

        if (dist(player.x, player.y, this.x, this.y) < this.radius/2 + player.radius/2) player.inWater = true;
    }

    display(i) {

        waterCanvas.fill(169, 179, 105, 1);
        waterCanvas.ellipse(this.x, this.y, this.radius+i);
    }
}