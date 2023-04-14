class Player {

    constructor() {
        this.x = width/2;
        this.y = height/2;
        this.velocityX = 0;
        this.velocityY = 0;
        this.radius = 50;
    }

    update() {
        this.velocityX += xAxisInput*2;
        this.velocityY += yAxisInput*2;

        if (this.x+this.velocityX > 0 && this.x+this.velocityX < width) this.x += this.velocityX;
        if (this.y+this.velocityY > 0 && this.y+this.velocityY < height) this.y += this.velocityY;

        this.velocityX *= 0.95;
        this.velocityY *= 0.95;
    }

    display() {

        fill(palette.dark);
        ellipse(this.x, this.y, this.radius);
    }
}