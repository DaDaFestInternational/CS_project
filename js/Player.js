class Player {

    constructor() {

        this.x = width/2;
        this.y = height/2;
        this.velocityX = 0;
        this.velocityY = 0;
        this.radius = 30;
        this.visualRadius = this.radius;

        this.doorRadius = 0;
        this.doorDilateFrame = 0;
        this.doorDilate = -1000;
        this.stopDoorDilate = false;
        this.doorHasBeenBig = false;
        this.doorTime = 0;

        this.collisionDuration = 0;
        this.safeX = this.x;
        this.safeY = this.y;

        this.hasKey = false;

        this.inWater = false;

        this.bounceCount = 0;
        this.lavaDeathCount = 0;
    }

    update() {

        if (this.hasKey && door.collide(this)) {
            this.x = lerp(this.x, door.x, 0.2);
            this.y = lerp(this.y, door.y, 0.2);
            this.visualRadius -= 2;
            return;
        }

        let doorDilate = sin(frameCount - this.doorDilateFrame) * 10;
        this.doorDilate = doorDilate;

        // if (doorDilate > 0) this.stopDoorDilate = true;
        this.stopDoorDilate = true;
        if (this.stopDoorDilate && doorDilate < 0) this.doorDilate = 0;

        if (this.doorRadius > 0 && this.doorDilate == 0) this.doorRadius -= 2;

        this.doorTime++;

        if (this.visualRadius < this.radius) this.visualRadius += 2;

        let moveX = true;
        let moveY = true;

        if (this.inWater) {
            this.velocityX += xAxisInput*0.1;
            this.velocityY += yAxisInput*0.1;
        } else {
            this.velocityX += xAxisInput*1.5;
            this.velocityY += yAxisInput*1.5;
        }

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

                if (walls[i].lava && !this.hasKey) {
                    player.reset();
                    this.lavaDeathCount++;
                    return;
                }

                let incidenceAngle = createVector(this.velocityX, this.velocityY).heading();
                let surfaceAngle = createVector(potentialPlayer.x - walls[i].x, potentialPlayer.y - walls[i].y).heading() + 90;
                let newAngle = angleReflect(incidenceAngle, surfaceAngle);

                let v = createVector(this.velocityX, this.velocityY);
                v.setHeading(newAngle);

                this.velocityX = v.x;
                this.velocityY = v.y;

                collided = true;

                this.velocityX *= 0.95;
                this.velocityY *= 0.95;

                break;
            }
        }

        if (collided) {
            this.collisionDuration++;
            this.bounceCount++;

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

        if (this.doorRadius > 1) {

            objectCanvas.strokeWeight(4);
            objectCanvas.stroke(palette.black);
            objectCanvas.fill(lerpColor(color(palette.gold), color(20, 114, 176, 0), this.doorTime/100));
            objectCanvas.ellipse(pathMaker.startX, pathMaker.startY, this.doorRadius + this.doorDilate);
            objectCanvas.noStroke();
        }

        if (this.visualRadius < 1) return;

        ballCanvas.fill(palette.black);
        ballCanvas.ellipse(this.x, this.y, this.visualRadius);

        objectCanvas.fill(palette.black);
        objectCanvas.ellipse(this.x, this.y, this.visualRadius);
    }
}

function angleReflect(incidenceAngle, surfaceAngle) {
    var a = surfaceAngle * 2 - incidenceAngle;
    return a >= 360 ? a - 360 : a < 0 ? a + 360 : a;
}