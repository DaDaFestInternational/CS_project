// https://coolors.co/eee5e9-6BCEDB-20b650-0d3ab4-2b303a-ff7954

let palette = {
    white: "#FEDCC0",
    light: "#B2CDC6",
    mid: "#FD9A7E",
    dark: "#4379AE",
    black: "#173045",
    lava: "#F34B1B"
  }

let keeb = [
    [81, 87, 69, 82, 84, 89, 85],
    [65, 83, 68, 70, 71, 72, 74],
    [90, 88, 67, 86, 66, 78, 77]
];

let xAxisInput = 0;
let yAxisInput = 0;

let player;
let collectables = [];
let walls = [];
let pathMaker;
let door;
let key;

let minKeycode = 65;
let maxKeycode = 90;

let upCoord = [0, 1];
let downCoord = [1, 1];
let leftCoord = [1, 0];
let rightCoord = [1, 2];

let up = 87;
let down = 83;
let left = 65;
let right = 68;

let newKey = 0;

let scoreCount = 0;

let wallCanvas;
let ballCanvas;
let objectCanvas;

let culminations = 7;
let cumulative1 = 0;
let cumulative2 = culminations;

function setup() {

    let maxWidth = windowWidth > 1280 ? 1280 : windowWidth;
    let maxHeight = windowHeight > 703 ? 703 : windowHeight;

    createCanvas(maxWidth, maxHeight);
    noStroke();
    angleMode(DEGREES);

    wallCanvas = createGraphics(maxWidth, maxHeight);
    wallCanvas.noStroke();

    ballCanvas = createGraphics(maxWidth, maxHeight);
    ballCanvas.noStroke();

    objectCanvas = createGraphics(maxWidth, maxHeight);
    objectCanvas.noStroke();

    player = new Player();

    newMaze(true);
}

function draw() {

    objectCanvas.clear();
    ballCanvas.background(color(68, 140, 187, 10)); // dark

    buttonsPressed();

    door.update();
    door.display();

    key.update();
    key.display();

    player.update();
    player.display();

    if (!player.hasKey && key.collide(player)) {
        player.hasKey = true;
        updateWalls();
    }

    if (player.hasKey && door.enter(player)) {
        newMaze(false, door);
        if(scoreCount % 3 == 2) {
            let foundPath = pathInput();
            while(!foundPath) foundPath = pathInput();
        }
        scoreCount++;

        if (cumulative1 < cumulative2) {
            cumulative1+=3;
        } else {
            cumulative1 = 3;
            cumulative2--;

            if (cumulative2 < 0) cumulative2 = culminations;
        }
    }

    image(ballCanvas, 0, 0);

    strokeWeight(1);
    stroke(palette.black);
    noFill();
    rectMode(CENTER);

    let spacing = player.radius*1.5;
    let m = tan((culminations-cumulative2)*12)*20+2;

    for (let i = spacing/2-10+spacing*1.25; i < width+height; i += spacing) {

        let x = pathMaker.startX;
        let y = pathMaker.startY;

        push();
        translate(x, y);
        rotate((frameCount/50+i)*m);
        rect(sin(frameCount)*m, sin(frameCount)*m, i+sin(frameCount)*2-6, i+sin(frameCount)*2-6, spacing-3);
        rect(sin(frameCount)*m, sin(frameCount)*m, i+sin(frameCount)*2, i+sin(frameCount)*2, spacing);
        pop();
        spacing*=1.25;
    }


    image(objectCanvas, 0, 0);
    image(wallCanvas, 0, 0);

    displayUI();
}

function buttonsPressed() {

    let strength = 0.27;

    if (keyIsDown(left) && keyIsDown(right)) {
        xAxisInput = 0;
    } else if (keyIsDown(left)) {
        if (newKey == left) newKey = 0;
        xAxisInput = -strength;
    } else if (keyIsDown(right)) {
        if (newKey == right) newKey = 0;
        xAxisInput = strength;
    } else {
        xAxisInput = 0;
    }

    if (keyIsDown(up) && keyIsDown(down)) {
        yAxisInput = 0;
    } else if (keyIsDown(up)) {
        if (newKey == up) newKey = 0;
        yAxisInput = -strength;
    } else if (keyIsDown(down)) {
        if (newKey == down) newKey = 0;
        yAxisInput = strength;
    } else {
        yAxisInput = 0;
    }
}

function displayUI() {

    push();
    translate(width/2, 0);

    fill(palette.black)
    textAlign(CENTER, CENTER);
    noStroke();

    textSize(20);
    text("score = " + scoreCount, 0, 40);

    translate(0, 120);

    drawKey(up, 0, -30);
    drawKey(down, 0, 30);
    drawKey(left, -30, 0);
    drawKey(right, 30, 0);

    angleMode(DEGREES);
    rotate(45);
    fill(palette.black);
    rectMode(CENTER);
    rect(0, 0, 15);

    pop();
}

function pathInput() {

    let direction = int(random(4));
    let move = int(random(4));
    let newCoord;

    if (move == 0) {
        newCoord = [-1, 0];
    } else if (move == 1) {
        newCoord = [1, 0];
    } else if (move == 2) {
        newCoord = [0, -1];
    } else if (move == 3) {
        newCoord = [0, 1];
    }

    if (direction == 0) {
        newCoord = [newCoord[0]+leftCoord[0], newCoord[1]+leftCoord[1]];
    } else if (direction == 1) {
        newCoord = [newCoord[0]+rightCoord[0], newCoord[1]+rightCoord[1]];
    } else if (direction == 1) {
        newCoord = [newCoord[0]+upCoord[0], newCoord[1]+upCoord[1]];
    } else if (direction == 1) {
        newCoord = [newCoord[3]+downCoord[0], newCoord[1]+downCoord[1]];
    }

    if (newCoord[0] < 0 || newCoord[0] > 2) return false;
    if (newCoord[1] < 0 || newCoord[1] > 6) return false;

    let newKeycode = keeb[newCoord[0]][newCoord[1]];

    if (newKeycode == up || newKeycode == down || newKeycode == left || newKeycode == right) {
        return false;
    }

    if (direction == 0) {
        leftCoord = newCoord;
        left = newKeycode;
        newKey = left;
    } else if (direction == 1) {
        rightCoord = newCoord;
        right = newKeycode;
        newKey = right;
    } else if (direction == 2) {
        upCoord = newCoord;
        up = newKeycode;
        newKey = up;
    } else if (direction == 3) {
        downCoord = newCoord;
        down = newKeycode;
        newKey = down;
    }

    return true;
}

function newMaze(fresh, myDoor) {

    if (!fresh) {
        player.x = myDoor.x;
        player.y = myDoor.y;
    }

    walls = [];
    collectables = [];

    let offset = 27;

    for (let j = 0; j <= height+offset*2; j += offset) {
        for (let i = 0; i <= width; i += offset) {

            let x = i + random(-offset, offset);
            let y = j + random(-offset, offset);

            walls.push(new Wall(x, y, 85));
        }
    }

    pathMaker = new PathMaker();

    // for (let i = 0; i < 1; i++) {
    //     collectables.push(new Collectable());
    // }

    player.velocityX = 0;
    player.velocityY = 0;
    player.visualRadius = 0;
    if (!fresh) {
        player.doorRadius = myDoor.radius;
        player.doorDilateFrame = myDoor.dilateFrame;
        player.stopDoorDilate = false;
        player.doorHasBeenBig = false;
        player.doorDilate = -1000;
        player.doorTime = 0;
    }
    player.hasKey = false;

    if (dist(player.x, player.y, key.x, key.y) < 200) {
        newMaze(fresh, myDoor);
    }

    if (dist(door.x, door.y, key.x, key.y) < 200) {
        newMaze(fresh, myDoor);
    }

    background(color(20, 114, 176, 255));

    wallCanvas.clear();
    ballCanvas.clear();

    updateWalls();
}

function keyPressed() {

    if (keyCode == ESCAPE) {
        player.reset();
    }
}

function drawKey(letter, x, y) {

    if (newKey == letter) {
        fill(palette.black);
        ellipse(x, y, 30);
        fill(palette.white);
    } else {
        fill(palette.black);
    }

    textSize(25);
    if (keyIsDown(letter)) textSize(30);
    text(char(letter), x, y);
}

function updateWalls() {

    for (let i = 0; i < walls.length; i++) {
        walls[i].update();
        walls[i].display(0);
    }

    for (let i = 0; i < walls.length; i++) {
        walls[i].display(1);
    }
}