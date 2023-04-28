class PathMaker {

    constructor() {

        this.x = player.x;
        this.y = player.y;
        this.startX = this.x;
        this.startY = this.y;
        this.radius = player.radius * 2.5;

        this.velocityX = random(-this.radius, this.radius);
        this.velocityY = random(-this.radius, this.radius);

        for (let i = 0; i < walls.length; i++) {
            if (!walls[i].dead && this.collide(walls[i])) {
                walls[i].kill();
            }
        }

        for (let i = 0; i < 40; i++) {
            this.makePath();

            if (i == 10) {
                door = new Door(this.x, this.y);
            }
        }
        key = new Key(this.x, this.y);
    }

    makePath() {

        if (random() < 0.3) {
            this.velocityX = random(-this.radius, this.radius);
            this.velocityY = random(-this.radius, this.radius);
        }

        if ((this.x < this.radius*3 && this.velocityX < 0) || (this.x > width-this.radius*3 && this.velocityX > 0)) this.velocityX *= -1;
        if ((this.y < this.radius*3 && this.velocityY < 0) || (this.y > height-this.radius*3 && this.velocityY > 0)) this.velocityY *= -1;

        this.x += this.velocityX;
        this.y += this.velocityY;

        for (let i = 0; i < walls.length; i++) {
            if (!walls[i].dead && this.collide(walls[i])) {
                walls[i].kill();
            }
        }
    }

    collide(collider) {

        if (dist(collider.x, collider.y, this.x, this.y) < (this.radius+collider.radius)/2) {
            return true;
        }
    }
}