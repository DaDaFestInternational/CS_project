class Button {

    constructor(label, x, y) {

        this.label = label;
        this.x = x;
        this.y = y;
        this.w = 180;
        this.h = 50;

        this.hovered = false;
        this.lifeTime = 0;
        this.appearTime = 60*20;
        this.minBounces = 30;
        this.minLavaDeathsBounces = 15;
    }

    update() {

        this.lifeTime++;

        if (player.bounceCount < this.minBounces && player.lavaDeathCount < this.minLavaDeathsBounces && this.lifeTime < this.appearTime) return;

        this.hover();

        if (this.hovered && mouseIsPressed) {
            dayCount++;
            newMaze(false, door);
            let foundPath = pathInput();
            while(!foundPath) foundPath = pathInput();
        }
    }

    hover() {

        if (mouseX < this.x+this.w/2 && mouseX > this.x-this.w/2 && mouseY < this.y+this.h/2 && mouseY > this.y-this.h/2) {
            this.hovered = true;
        } else {
            this.hovered = false;
        }
    }

    display() {

        if (player.bounceCount < this.minBounces && player.lavaDeathCount < this.minLavaDeathsBounces && this.lifeTime < this.appearTime) return;

        push();
        strokeWeight(1);
        stroke(palette.mid);
        fill(palette.light);
        if (this.hovered) fill(palette.black);
        translate(this.x, this.y);
        rect(0, 0, this.w, this.h, 10);

        noStroke();
        fill(palette.black);
        if (this.hovered) fill(palette.white);
        textFont(brushFont);
        textAlign(CENTER, CENTER);
        textSize(30);
        text(this.label, 0, -6);

        pop();
    }
}