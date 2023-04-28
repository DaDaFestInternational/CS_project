class Player {

    constructor() {

        this.x = width/2;
        this.y = height/2;
        this.velocityX = 0;
        this.velocityY = 0;
        this.radius = 30;

        this.collisionDuration = 0;
        this.safeX = this.x;
        this.safeY = this.y;
    }

    update() {

        let moveX = true;
        let moveY = true;

        this.velocityX += xAxisInput*1.5;
        this.velocityY += yAxisInput*1.5;

        if (this.x+this.velocityX < this.radius/2 || this.x+this.velocityX > width-this.radius/2) moveX = false;
        if (this.y+this.velocityY < this.radius/2 || this.y+this.velocityY > height-this.radius/2) moveY = false;

        let potentialPlayer = {
            x: this.x + this.velocityX,
            y: this.y + this.velocityY,
            radius: this.radius
        };

        let collided = false;

        for (let i = 0; i < walls.length; i++) {
            if (walls[i].collide(potentialPlayer)) {

                let incidenceAngle = createVector(this.velocityX, this.velocityY).heading();
                let surfaceAngle = createVector(potentialPlayer.x - walls[i].x, potentialPlayer.y - walls[i].y).heading() + 90;
                let newAngle = angleReflect(incidenceAngle, surfaceAngle);

                let v = createVector(this.velocityX, this.velocityY);
                v.setHeading(newAngle);

                this.velocityX = v.x;
                this.velocityY = v.y;

                collided = true;

                break;
            }
        }

        if (collided) {
            this.collisionDuration++;

            if (this.collisionDuration > 10) {
                this.x = this.safeX;
                this.y = this.safeY;
            }
        } else {
            this.collisionDuration = 0;
            this.safeX = this.x;
            this.safeY = this.y;
        }


        if (moveX) {
            this.x += this.velocityX;
        }

        if (moveY) {
            this.y += this.velocityY;
        }

        this.velocityX *= 0.95;
        this.velocityY *= 0.95;
    }

    reset() {

        this.velocityX = 0;
        this.velocityY = 0;
        this.x = pathMaker.startX;
        this.y = pathMaker.startY;
    }

    display() {

        ballCanvas.fill(palette.dark);
        ballCanvas.ellipse(this.x, this.y, this.radius);
    }
}

function angleReflect(incidenceAngle, surfaceAngle) {
    var a = surfaceAngle * 2 - incidenceAngle;
    return a >= 360 ? a - 360 : a < 0 ? a + 360 : a;
}