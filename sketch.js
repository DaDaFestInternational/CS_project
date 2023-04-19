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
let collectable;
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

let scoreCount = 0;

let wallCount = 1200;

function setup() {

    createCanvas(windowWidth, windowHeight);
    noStroke();
    angleMode(DEGREES);

    player = new Player();

    newMaze();
}

function draw() {

    background(palette.white);

    buttonsPressed();

    player.update();
    player.display();

    if (collectable.collide(player)) {
       newMaze();
        if(scoreCount % 3 == 2) {
            let foundPath = pathInput();
            while(!foundPath) foundPath = pathInput();
        }
        scoreCount++;
    }

    for (let i = 0; i < walls.length; i++) {
        walls[i].display();
    }

    collectable.display();

    displayUI();
}

function buttonsPressed() {

    let strength = 0.27;

    if (keyIsDown(left)) {
        xAxisInput = -strength;
    } else if (keyIsDown(right)) {
        xAxisInput = strength;
    } else {
        xAxisInput = 0;
    }

    if (keyIsDown(up)) {
        yAxisInput = -strength;
    } else if (keyIsDown(down)) {
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
    textSize(30);
    text(char(up), 0, -30);
    text(char(down), 0, 30);
    text(char(left), -30, 0);
    text(char(right), 30, 0);

    angleMode(DEGREES);
    rotate(45);

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
    } else if (direction == 1) {
        rightCoord = newCoord;
        right = newKeycode;
    } else if (direction == 2) {
        upCoord = newCoord;
        up = newKeycode;
    } else if (direction == 3) {
        downCoord = newCoord;
        down = newKeycode;
    }

    return true;
}

function newMaze() {

    walls = [];

    for (let i = 0; i < wallCount; i++) {
        walls.push(new Wall());
    }

    pathMaker = new PathMaker();
    collectable = new Collectable();

    player.velocityX = 0;
    player.velocityY = 0;

    if (dist(player.x, player.y, collectable.x, collectable.y) < 300) {
        newMaze();
    }
}

function keyPressed() {

    if (keyCode == ESCAPE) {
        player.reset();
    }
}