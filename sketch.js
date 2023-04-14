let palette = {
    white: "#EEE5E9",
    light: "#92DCE5",
    mid: "#D64933",
    dark: "#5F6A89",
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

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();

    player = new Player();
    collectable = new Collectable();
}

function draw() {

    background(palette.white);

    buttonsPressed();

    displayUI();

    player.update();
    player.display();

    if (collectable.collide()) {
        collectable = new Collectable();
        if(scoreCount % 3 == 2) {
            //randomInput();
            let foundPath = pathInput();
            while(!foundPath) foundPath = pathInput();
        }
        scoreCount++;
    }

    collectable.display();
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
    translate(width/2, 80);

    fill(palette.black)
    textAlign(CENTER, CENTER);
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

function randomInput() {

    let direction = int(random(4));
    let newKeycode = int(random(minKeycode, maxKeycode+1));

    while (newKeycode == up || newKeycode == down || newKeycode == left || newKeycode == right) {
        newKeycode = int(random(minKeycode, maxKeycode+1));
    }

    if (direction == 0) {
        up = newKeycode;
    } else if (direction == 1) {
        down = newKeycode;
    } else if (direction == 2) {
        left = newKeycode;
    } else if (direction == 3) {
        right = newKeycode;
    }
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
