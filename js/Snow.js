class Snow {

    constructor() {

        this.x = random(width);
        this.y = random(height);
        this.size = random(4, 10);
    }

    update() {

        this.y += random(0.5, 1.5);

        if (random() < 0.25) this.x += 0.8;
        else this.x -= 0.8;

        if (this.y > height) {
            this.x = random(width);
            this.y = 0;
            this.size = random(4, 10);
        }

        if (this.x > width) this.x = 0;
        else if (this.x < 0) this.x = width;
    }

    display() {

        push();
        translate(this.x, this.y);

        noStroke();
        fill(palette.white);
        ellipse(this.x, this.y, this.size);

        pop();
    }
}