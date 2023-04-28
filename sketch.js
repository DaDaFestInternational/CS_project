// https://coolors.co/eee5e9-92dce5-20b650-0d3ab4-2b303a

let palette = {
    white: "#EEE5E9",
    light: "#92DCE5",
    mid: "#20B650",
    dark: "#0D3AB4",
    black: "#2B303A",
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

let wallCount = 2000;

let wallCanvas;
let ballCanvas;

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

    player = new Player();

    newMaze();
}

function draw() {

    background(color(238, 229, 233, 10));
    wallCanvas.clear();
    ballCanvas.background(color(238, 229, 233, 10));

    buttonsPressed();

    player.update();
    player.display();

    for (let i = 0; i < collectables.length; i++) {

        if (collectables[i].collide(player)) {
           newMaze();
            if(scoreCount % 3 == 2) {
                let foundPath = pathInput();
                while(!foundPath) foundPath = pathInput();
            }
            scoreCount++;
        }

        collectables[i].update();
        collectables[i].display();
    }


    for (let i = 0; i < walls.length; i++) {
        walls[i].display();
    }

    image(ballCanvas, 0, 0);
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

    fill(palette.mid)
    textAlign(CENTER, CENTER);

    textSize(20);
    text("score = " + scoreCount, 0, 40);

    translate(0, 120);

    drawKey(up, 0, -30);
    drawKey(down, 0, 30);
    drawKey(left, -30, 0);
    drawKey(right, 30, 0);

    angleMode(DEGREES);
    rotate(45);
    fill(palette.mid);
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

function newMaze() {

    walls = [];
    collectables = [];

    for (let i = 0; i < 100; i++) {
        walls.push(new Wall(1000));
    }

    for (let i = 0; i < wallCount; i++) {
        walls.push(new Wall(75));
    }

    pathMaker = new PathMaker();

    for (let i = 0; i < 1; i++) {
        collectables.push(new Collectable());
    }

    player.velocityX = 0;
    player.velocityY = 0;

    for (let i = 0; i < collectables.length; i++) {
        if (dist(player.x, player.y, collectables[i].x, collectables[i].y) < 300) {
            newMaze();
        }
    }

    background(color(238, 229, 233, 255));
    wallCanvas.clear();
    ballCanvas.clear();
}

function keyPressed() {

    if (keyCode == ESCAPE) {
        player.reset();
    }
}

function drawKey(letter, x, y) {

    if (newKey == letter) {
        fill(palette.mid);
        ellipse(x, y, 30);
        fill(palette.black);
    } else {
        fill(palette.mid);
    }

    textSize(25);
    if (keyIsDown(letter)) textSize(30);
    text(char(letter), x, y);
}