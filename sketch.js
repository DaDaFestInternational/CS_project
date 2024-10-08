// https://coolors.co/eee5e9-6BCEDB-20b650-0d3ab4-2b303a-ff7954

let palette = {
    white: "#FEDCC0",
    light: "#B2CDC6",
    mid: "#FD9A7E",
    dark: "#4379AE",
    black: "#173045",
    lava: "#F34B1B",
    gold: "#EDB421",
  }

let keeb = [
    [81, 87, 69, 82, 84, 89, 85],
    [65, 83, 68, 70, 71, 72, 74],
    [90, 88, 67, 86, 66, 78, 77]
];

let days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

let xAxisInput = 0;
let yAxisInput = 0;

let player;
let collectables = [];
let walls = [];
let pathMaker;
let door;
let key;
let toxicWater = [];
let snow = [];

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

let dayCount = 0;

let wallCanvas;
let ballCanvas;
let objectCanvas;
let waterCanvas;

let culminations = 7;
let cumulative1 = 0;
let cumulative2 = culminations;

let brushFont;
let blackKeyImagekeyImage;
let blackKeyImage;

let risingWater;

let giveUpButton;

let interacted = false;
let startTime;
let act = 0;
let lavaCount = 5;
let toxicCount = 2;

let captionText = "TEST";

var chrisAudio = new Audio("./audio/chris.mp3");
var keyAudio = new Audio('./audio/key.mp3');
var doorAudio = new Audio('./audio/door.mp3');

function preload() {

    brushFont = loadFont("./fonts/CaveatBrush-Regular.ttf");
    keyImage = loadImage("./images/key.png");
    blackKeyImage = loadImage("./images/black-key.png");
}

function setup() {

    let maxWidth = windowWidth > 1280-10 ? 1280-10 : windowWidth;
    let maxHeight = windowHeight > 703-10 ? 703-10 : windowHeight;

    createCanvas(maxWidth, maxHeight);
    noStroke();
    angleMode(DEGREES);

    wallCanvas = createGraphics(maxWidth, maxHeight);
    wallCanvas.noStroke();

    ballCanvas = createGraphics(maxWidth, maxHeight);
    ballCanvas.noStroke();

    objectCanvas = createGraphics(maxWidth, maxHeight);
    objectCanvas.noStroke();

    waterCanvas = createGraphics(maxWidth, maxHeight);
    waterCanvas.noStroke();

    player = new Player();

    giveUpButton = new Button("Try again\ntomorrow", width-150, 70);

    // for (let i = 0; i < 50; i++) {
    //     snow.push(new Snow());
    // }

    newMaze(true);

    startTime = new Date().getTime();
}

function draw() {

    let timeElapsed = int((new Date().getTime() - startTime)/1000);

    if (timeElapsed > 60*2 && act < 1) {
        act = 1;
        console.log("act 1");
    } if (timeElapsed > 60*4 && act < 2) {
        act = 2;
        console.log("act 2");
    } if (timeElapsed > 60*6 && act < 3) {
        act = 3;
        lavaCount = 5;
        toxicCount = 2;
        console.log("act 3");
    }

    objectCanvas.clear();
    ballCanvas.background(color(68, 140, 187, 10)); // dark

    buttonsPressed();
    narrationStart();
    giveUpButton.update();

    player.inWater = false;

    if (risingWater != 0) {
        risingWater.update();
        risingWater.display();
    }

    for (let i = 0; i < toxicWater.length; i++) {
        toxicWater[i].update();
        // toxicWater[i].display(100);
    }

    door.update();
    door.display();

    key.update();
    key.display();

    player.update();
    player.display();

    if (!player.hasKey && key.collide(player)) {
        player.hasKey = true;
        updateWalls();
        waterCanvas.clear();
        keyAudio.play();
    }

    if (player.hasKey && door.enter(player)) {
        doorAudio.play();
        newMaze(false, door);
        if(dayCount % 3 == 2) {
            let foundPath = pathInput();
            while(!foundPath) foundPath = pathInput();
        }
        dayCount++;
        if (act == 1 || act == 3) lavaCount++;
        if (act == 2 || act == 3) toxicCount++;

        if (cumulative1 < cumulative2) {
            cumulative1+=3;
        } else {
            cumulative1 = 3;
            cumulative2--;

            if (cumulative2 < 0) {
                cumulative2 = culminations;
                snow = [];
            }
        }
    }

    image(ballCanvas, 0, 0);
    image(waterCanvas, 0, 0);

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

    for (let i = 0; i < snow.length; i++) {
        snow[i].update();
        snow[i].display();
    }

    let radius = 55;
    fill(palette.black);
    noStroke();
    ellipse(0, 0, radius);
    ellipse(width, 0, radius);
    ellipse(width, height, radius);
    ellipse(0, height, radius);

    noFill();
    stroke(palette.black);
    strokeWeight(10);
    rect(width/2, height/2, width, height);

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

function narrationStart() {

    if(keyIsDown(left) || keyIsDown(right) || keyIsDown(up) || keyIsDown(down)){
        chrisAudio.play();

        if(chrisAudio.currentTime > 4 && chrisAudio.currentTime < 12){
            captionText = "My name is Chris, I'm 30, I've had ME for a number of years now and for a number of";
        }

        if(chrisAudio.currentTime > 12 && chrisAudio.currentTime < 23){
            captionText = "years before that I have had chronic pain as well. I'm Japanese and I'm Ukrainian,";
        }

        if(chrisAudio.currentTime > 23 && chrisAudio.currentTime < 30){
            captionText = "I walk with a stick because of the chronic pain. This project's about the sort of disabled";
        }

        if(chrisAudio.currentTime > 30 && chrisAudio.currentTime < 40){
            captionText = "experience specifically, sort of leaning towards chronic fatigue and sort of repetition and";
        }

        if(chrisAudio.currentTime > 40 && chrisAudio.currentTime < 47){
            captionText = "how in normal sort of life repetition breeds sort of ability that you've got the 10,000";
        }

        if(chrisAudio.currentTime > 47 && chrisAudio.currentTime < 53){
            captionText = "hours sort of thing and I guess this is the opposite of that where the more you do something";
        }

        if(chrisAudio.currentTime > 53 && chrisAudio.currentTime < 57){
            captionText = "it doesn't, well it's not that you lose it, it's just the more you do something doesn't";
        }

        if(chrisAudio.currentTime > 57 && chrisAudio.currentTime < 65){
            captionText = "mean anything, your sort of habits become out of whack no matter sort of what you do";
        }

        if(chrisAudio.currentTime > 65 && chrisAudio.currentTime < 74){
            captionText = "and yeah there's no real way of progressing sometimes and it's more about adapting to";
        }

        if(chrisAudio.currentTime > 74 && chrisAudio.currentTime < 79){
            captionText = "circumstances as they change. Essentially what I want you to experience is trying to";
        }

        if(chrisAudio.currentTime > 79 && chrisAudio.currentTime < 84){
            captionText = "focus on something while trying to focus on another thing that's changing and just being";
        }

        if(chrisAudio.currentTime > 84 && chrisAudio.currentTime < 96){
            captionText = "more difficult and empathise with that as a broader and more constant experience.";
        }

        if(chrisAudio.currentTime > 96 && chrisAudio.currentTime < 102){
            captionText = " So I think what made me want to do a project sort of like this was the fact that it seems";
        }

        if(chrisAudio.currentTime > 102 && chrisAudio.currentTime < 111){
            captionText = "very rare for disabled lives to be sort of, for there to be art made about disabled lives";
        }

        if(chrisAudio.currentTime > 111 && chrisAudio.currentTime < 119){
            captionText = "that isn't sort of inspiration porn which I think part of it comes from trying to fit";
        }

        if(chrisAudio.currentTime > 119 && chrisAudio.currentTime < 126){
            captionText = "disability into a sort of traditional western three-part narrative format which, like most";
        }

        if(chrisAudio.currentTime > 126 && chrisAudio.currentTime < 133){
            captionText = "lives, it just doesn't work in and unless you're taking the smallest segment of a specific";
        }

        if(chrisAudio.currentTime > 133 && chrisAudio.currentTime < 139){
            captionText = "up it's never going to fit that sort of narrative that people might enjoy and actually the lived";
        }

        if(chrisAudio.currentTime > 139 && chrisAudio.currentTime < 146){
            captionText = "reality is sort of constant flux and lots of ups and downs and I think I just wanted";
        }

        if(chrisAudio.currentTime > 146 && chrisAudio.currentTime < 153){
            captionText = "to reflect that in as simple a way as possible. Sort of creating sort of more bleak art is";
        }

        if(chrisAudio.currentTime > 153 && chrisAudio.currentTime < 161){
            captionText = "also like seen as more worthy because it's like looking at the bleak reality and being";
        }

        if(chrisAudio.currentTime > 161 && chrisAudio.currentTime < 167){
            captionText = "like we need to change is what I think a lot of artists lean towards and I don't think";
        }

        if(chrisAudio.currentTime > 167 && chrisAudio.currentTime < 174){
            captionText = "that's true I think it's kind of the opposite where you need to create sort of hopeful art";
        }

        if(chrisAudio.currentTime > 174 && chrisAudio.currentTime < 184){
            captionText = "and there's a genre in sort of Japanese art, I guess, that's called iyashikei which is it";
        }

        if(chrisAudio.currentTime > 184 && chrisAudio.currentTime < 190){
            captionText = "means like sort of healing genre or soothing genre and it's sort of I guess it sort of";
        }

        if(chrisAudio.currentTime > 190 && chrisAudio.currentTime < 200){
            captionText = "really applied to a lot of like Ghibli films where like, what's it called, Majo no Takkyubin, which is";
        }

        if(chrisAudio.currentTime > 200 && chrisAudio.currentTime < 205){
            captionText = "Kiki's Delivery Service where kind of nothing really happens it's like a sort of big kind of exciting";
        }

        if(chrisAudio.currentTime > 205 && chrisAudio.currentTime < 213){
            captionText = "thing at the end but nothing really happens it's just really nice to watch and I think";
        }

        if(chrisAudio.currentTime > 213 && chrisAudio.currentTime < 218){
            captionText = "that kind of film has more of an effect on people, like Ghibli is so popular worldwide";
        }

        if(chrisAudio.currentTime > 218 && chrisAudio.currentTime < 222){
            captionText = "for that reason that it's like such a rare genre to just like watch something that's nice";
        }

        if(chrisAudio.currentTime > 222 && chrisAudio.currentTime < 228){
            captionText = "like Grave of the Fireflies is one of their sort of bleaker very harsher films but";
        }

        if(chrisAudio.currentTime > 228 && chrisAudio.currentTime < 238){
            captionText = "like that's not people's favorite film and I think I guess I remember interviewing a";
        }

        if(chrisAudio.currentTime > 238 && chrisAudio.currentTime < 244){
            captionText = "poet sort of about their practice and she kept on talking about how like how difficult";
        }

        if(chrisAudio.currentTime > 244 && chrisAudio.currentTime < 252){
            captionText = "and bleak her work was and so I asked her why she doesn't sort of create any poems from";
        }

        if(chrisAudio.currentTime > 252 && chrisAudio.currentTime < 257){
            captionText = "a more happy place and she's like 'I've literally never thought of that before I guess it's";
        }

        if(chrisAudio.currentTime > 257 && chrisAudio.currentTime < 262){
            captionText = "probably harder because I've never done it' and I think that is one of those things that";
        }

        if(chrisAudio.currentTime > 262 && chrisAudio.currentTime < 268){
            captionText = "stayed with me that like, oh yeah people like being sort of happy in a bleak time is much";
        }

        if(chrisAudio.currentTime > 268 && chrisAudio.currentTime < 273){
            captionText = "harder and I think the only sort of urgency that art might have now is to make people";
        }

        if(chrisAudio.currentTime > 273 && chrisAudio.currentTime < 281){
            captionText = "feel better and like to encourage positive change rather than just being like sort of";
        }

        if(chrisAudio.currentTime > 281 && chrisAudio.currentTime < 288){
            captionText = "overwhelmingly negative about things which I understand is sort of a reflection of how";
        }

        if(chrisAudio.currentTime > 288 && chrisAudio.currentTime < 294){
            captionText = "people feel and I think I have been very guilty of this too of sort of more recently creating";
        }

        if(chrisAudio.currentTime > 294 && chrisAudio.currentTime < 302){
            captionText = "less happy works. It's quite hard to sort of both ways look back and look forwards with";
        }

        if(chrisAudio.currentTime > 302 && chrisAudio.currentTime < 311){
            captionText = "ME especially when sort of memory and stuff is getting quite shaken and affected because";
        }

        if(chrisAudio.currentTime > 311 && chrisAudio.currentTime < 319){
            captionText = "like my past feels so distant to me, like even I think there's a sort of removal of one degree";
        }

        if(chrisAudio.currentTime > 319 && chrisAudio.currentTime < 323){
            captionText = "to when I didn't have ME but I still had the stick and I think that's the easiest for";
        }

        if(chrisAudio.currentTime > 323 && chrisAudio.currentTime < 329){
            captionText = "me to remember and then there's an even bigger removal from before that, which feels so distant";
        }

        if(chrisAudio.currentTime > 329 && chrisAudio.currentTime < 336){
            captionText = "to me I think now and there's like almost a dreamlike quality to those memories because";
        }

        if(chrisAudio.currentTime > 336 && chrisAudio.currentTime < 343){
            captionText = "it feels so unreal and disconnected almost and part of that is to do with like, I guess";
        }

        if(chrisAudio.currentTime > 343 && chrisAudio.currentTime < 349){
            captionText = "the distance from it but also like my lived experience is so changed from that and it's";
        }

        if(chrisAudio.currentTime > 349 && chrisAudio.currentTime < 359){
            captionText = "so like unrelated almost and then yeah it's also true the future where, like ME is quite";
        }

        if(chrisAudio.currentTime > 359 && chrisAudio.currentTime < 368){
            captionText = "a strange disease, not a lot is known about it, sort of research is being done now especially";
        }

        if(chrisAudio.currentTime > 368 && chrisAudio.currentTime < 377){
            captionText = "with like Long COVID having quite a lot of similarities to it but yeah I think there's";
        }

        if(chrisAudio.currentTime > 377 && chrisAudio.currentTime < 384){
            captionText = "a sense of, I think I struggle with looking at the future like even sort of planning a";
        }

        if(chrisAudio.currentTime > 384 && chrisAudio.currentTime < 395){
            captionText = "trip in summer feels kind of shaky because both the chance that it won't happen and like";
        }

        if(chrisAudio.currentTime > 395 && chrisAudio.currentTime < 400){
            captionText = "I don't know, I think because I live in the day to day quite a lot more than most people";
        }

        if(chrisAudio.currentTime > 400 && chrisAudio.currentTime < 406){
            captionText = "do because there's more for me to think about in the day to day and then that sort of";
        }

        if(chrisAudio.currentTime > 406 && chrisAudio.currentTime < 412){
            captionText = "I think contrasted with the fact that my day to days aren't that different and they do";
        }

        if(chrisAudio.currentTime > 412 && chrisAudio.currentTime < 421){
            captionText = "blend into one so I guess time perception becomes strange, but yeah because I'm sort of";
        }

        if(chrisAudio.currentTime > 421 && chrisAudio.currentTime < 426){
            captionText = "almost like lizard brain sort of just like paying attention to my body and how I am in";
        }

        if(chrisAudio.currentTime > 426 && chrisAudio.currentTime < 433){
            captionText = "literally the present moment I think it's quite a struggle to plan for the future and";
        }

        if(chrisAudio.currentTime > 433 && chrisAudio.currentTime < 440){
            captionText = "also think back. Yeah so I think in terms of diagnosis for ME it's kind of all about";
        }

        if(chrisAudio.currentTime > 440 && chrisAudio.currentTime < 450){
            captionText = "self-advocacy which is difficult to do as you start to deteriorate and it might seem";
        }

        if(chrisAudio.currentTime > 450 && chrisAudio.currentTime < 454){
            captionText = "sort of weird for me to say but luckily for me I had chronic pain before that, so I was";
        }

        if(chrisAudio.currentTime > 454 && chrisAudio.currentTime < 459){
            captionText = "kind of used to going into the GP and sort of being like 'This is what's happening this";
        }

        if(chrisAudio.currentTime > 459 && chrisAudio.currentTime < 466){
            captionText = "is probably what I need' and because GPs like it's not they're not built for like anything";
        }

        if(chrisAudio.currentTime > 466 && chrisAudio.currentTime < 473){
            captionText = "complex like they're built for people who are slightly ill and maybe need some sort";
        }

        if(chrisAudio.currentTime > 473 && chrisAudio.currentTime < 479){
            captionText = "of antibiotics or something they kind of don't have the training or understanding to deal";
        }

        if(chrisAudio.currentTime > 479 && chrisAudio.currentTime < 486){
            captionText = "with complex chronic health issues so you kind of have to remember everything yourself";
        }

        if(chrisAudio.currentTime > 486 && chrisAudio.currentTime < 491){
            captionText = "and also I had the sort of bad luck that sort of during COVID all my medical records";
        }

        if(chrisAudio.currentTime > 491 && chrisAudio.currentTime < 498){
            captionText = "got lost so I mean it kind of worked out both positively and negatively because then it";
        }

        if(chrisAudio.currentTime > 498 && chrisAudio.currentTime < 508){
            captionText = "meant I could go to my GP and be like this is what's been wrong with me and for how long";
        }

        if(chrisAudio.currentTime > 508 && chrisAudio.currentTime < 516){
            captionText = "I didn't remember like all the medications I've taken which is the sort of only downside";
        }

        if(chrisAudio.currentTime > 516 && chrisAudio.currentTime < 523){
            captionText = "at this point but, because I sort of knew what procedures had been done to me and I'd been";
        }

        if(chrisAudio.currentTime > 523 && chrisAudio.currentTime < 532){
            captionText = "used to sort of fighting essentially the sort of NHS on what I need and stuff it helped a lot";
        }

        if(chrisAudio.currentTime > 532 && chrisAudio.currentTime < 540){
            captionText = "and I think now luckily as my sort of brain has sort of deteriorated a lot more";
        }

        if(chrisAudio.currentTime > 540 && chrisAudio.currentTime < 543){
            captionText = "my partner has sort of taken a lot of that role and like I said because we were sort of";
        }

        if(chrisAudio.currentTime > 543 && chrisAudio.currentTime < 555){
            captionText = "we've been sort of together during my time with ME, entire time with ME, I think that's";
        }

        if(chrisAudio.currentTime > 555 && chrisAudio.currentTime < 558){
            captionText = "been really helpful in terms of sort of, and I've been really lucky with that actually";
        }

        if(chrisAudio.currentTime > 558 && chrisAudio.currentTime < 567){
            captionText = "in terms of sort of easing both her and me into it and yeah I think self-diagnosis is";
        }

        if(chrisAudio.currentTime > 567 && chrisAudio.currentTime < 574){
            captionText = "such a huge part of basically treating chronic illness yourself which you have to do like";
        }

        if(chrisAudio.currentTime > 574 && chrisAudio.currentTime < 579){
            captionText = "people won't help you with it really unless you're very lucky you are the only one that";
        }

        if(chrisAudio.currentTime > 579 && chrisAudio.currentTime < 586){
            captionText = "really knows what's going on with your body and so you have to sort of navigate that because";
        }

        if(chrisAudio.currentTime > 586 && chrisAudio.currentTime < 592){
            captionText = "in like inevitably in the doctor's appointment you're going to forget some symptoms are key";
        }

        if(chrisAudio.currentTime > 592 && chrisAudio.currentTime < 596){
            captionText = "and that'll happen a few times definitely especially if you're sort of like becoming";
        }

        if(chrisAudio.currentTime > 596 && chrisAudio.currentTime < 601){
            captionText = "more forgetful once I lose a train of thought I sort of have to let it go otherwise I know";
        }

        if(chrisAudio.currentTime > 601 && chrisAudio.currentTime < 606){
            captionText = "I won't get it back like holding you know there's that classic like holding water";
        }

        if(chrisAudio.currentTime > 606 && chrisAudio.currentTime < 610){
            captionText = "in your hands where if you hold it too tightly you're just gonna yeah I'll lose my train";
        }

        if(chrisAudio.currentTime > 610 && chrisAudio.currentTime < 616){
            captionText = "of thought like internally definitely a lot as well I'll do that sort of classic thing";
        }

        if(chrisAudio.currentTime > 616 && chrisAudio.currentTime < 624){
            captionText = "of like, oh what was I doing, but like truly not having any way to remember that speaking";
        }

        if(chrisAudio.currentTime > 624 && chrisAudio.currentTime < 633){
            captionText = "of which, yeah I've forgotten what I was saying but yeah self-diagnosis is I think such an";
        }

        if(chrisAudio.currentTime > 633 && chrisAudio.currentTime < 638){
            captionText = "important step because you're not really gonna like I wouldn't have got an ME diagnosis without";
        }

        if(chrisAudio.currentTime > 638 && chrisAudio.currentTime < 646){
            captionText = "having sort of realised I had ME and then dealing with that for two years until I eventually";
        }

        if(chrisAudio.currentTime > 646 && chrisAudio.currentTime < 651){
            captionText = "annoyingly easily, got to a clinic where they were like 'Hh yeah we're just gonna diagnose";
        }

        if(chrisAudio.currentTime > 651 && chrisAudio.currentTime < 654){
            captionText = "you then you clearly have ME' and I was like yeah I thought they'd been saying that for";
        }

        if(chrisAudio.currentTime > 654 && chrisAudio.currentTime < 659){
            captionText = "a very long time but yeah until you get to the specialist clinic where they just diagnose";
        }

        if(chrisAudio.currentTime > 659 && chrisAudio.currentTime < 666){
            captionText = "you you don't get the diagnosis and like my chronic pain stuff is still undiagnosed because";
        }

        if(chrisAudio.currentTime > 666 && chrisAudio.currentTime < 670){
            captionText = "by the time I got to the specialist clinic ME was affecting me way more than chronic pain";
        }

        if(chrisAudio.currentTime > 670 && chrisAudio.currentTime < 680){
            captionText = "so I had to go to a different specialist clinic for ME and yeah, but equally for me";
        }

        if(chrisAudio.currentTime > 680 && chrisAudio.currentTime < 687){
            captionText = "that's kind of fine I just the chronic pain was something I got used to very easily and";
        }

        if(chrisAudio.currentTime > 687 && chrisAudio.currentTime < 692){
            captionText = "actually I think quite weirdly I found the chronic pain very easy to get used to and";
        }

        if(chrisAudio.currentTime > 692 && chrisAudio.currentTime < 701){
            captionText = "the stick and stuff like very easy to get used to, whereas the ME has been much harder";
        }

        if(chrisAudio.currentTime > 701 && chrisAudio.currentTime < 708){
            captionText = "which I guess it's affected much more in a sense as well like the chronic pain was almost";
        }

        if(chrisAudio.currentTime > 708 && chrisAudio.currentTime < 714){
            captionText = "the light version of ME like it affected my brain a bit because like you're sort of constantly";
        }

        if(chrisAudio.currentTime > 714 && chrisAudio.currentTime < 719){
            captionText = "sort of dealing with the pain and affecting my body because like it changed how I walked";
        }

        if(chrisAudio.currentTime > 719 && chrisAudio.currentTime < 728){
            captionText = "physiology and stuff and I was quite sick to begin with but yeah ME is kind of the beginning";
        }

        if(chrisAudio.currentTime > 728 && chrisAudio.currentTime < 734){
            captionText = "sort of when I first started noticing that things weren't normal were I think I just";
        }

        if(chrisAudio.currentTime > 734 && chrisAudio.currentTime < 740){
            captionText = "started to get tired kind of in a big way that I wasn't used to because sort of even";
        }

        if(chrisAudio.currentTime > 740 && chrisAudio.currentTime < 747){
            captionText = "after I developed chronic pain I've been using a walking stick to walk for many years now";
        }

        if(chrisAudio.currentTime > 747 && chrisAudio.currentTime < 756){
            captionText = "essentially what I first noticed when I guess I started to be affected by ME was essentially";
        }

        if(chrisAudio.currentTime > 756 && chrisAudio.currentTime < 763){
            captionText = "tiredness so I never really got tired before even though I've been using a stick to walk";
        }

        if(chrisAudio.currentTime > 763 && chrisAudio.currentTime < 773){
            captionText = " for quite a few years by that point and in fact it sort of it felt quite juxtaposed";
        }

        if(chrisAudio.currentTime > 773 && chrisAudio.currentTime < 779){
            captionText = "to that in the sense that sort of when I first started, I have chronic pain and when I first";
        }

        if(chrisAudio.currentTime > 779 && chrisAudio.currentTime < 785){
            captionText = "started I got quite sick and then I happened to be going by a stick store basically";
        }

        if(chrisAudio.currentTime > 785 && chrisAudio.currentTime < 791){
            captionText = "on my way to work which someone was actually carrying me to because we're going for a meeting";
        }

        if(chrisAudio.currentTime > 791 && chrisAudio.currentTime < 795){
            captionText = "based on like 'Oh you've been sick a lot and something's happening' but we happened to walk";
        }

        if(chrisAudio.currentTime > 795 && chrisAudio.currentTime < 804){
            captionText = "by a stick store and I got one and yeah I could walk again but then there was a sort of";
        }

        if(chrisAudio.currentTime > 804 && chrisAudio.currentTime < 811){
            captionText = "slow recovery period where I started to get used to that and then about by a year";
        }

        if(chrisAudio.currentTime > 811 && chrisAudio.currentTime < 820){
            captionText = "later I was like very confidently moving around yeah, and then this felt kind of the opposite";
        }

        if(chrisAudio.currentTime > 820 && chrisAudio.currentTime < 826){
            captionText = "of that where I was like I was starting to get a bit more tired and being like 'Oh I guess";
        }

        if(chrisAudio.currentTime > 826 && chrisAudio.currentTime < 830){
            captionText = "maybe it's like using the stick for quite a few years I've been like walking maybe too";
        }

        if(chrisAudio.currentTime > 830 && chrisAudio.currentTime < 838){
            captionText = "heavily on it as sort of like a young person who's quite fit and healthy' so I was like maybe";
        }

        if(chrisAudio.currentTime > 838 && chrisAudio.currentTime < 843){
            captionText = "I've just like you know impacted my arm too much into like affecting my body and then";
        }

        if(chrisAudio.currentTime > 843 && chrisAudio.currentTime < 852){
            captionText = "slowly being like 'Oh maybe I should walk less' and yeah and then it was like starting to";
        }

        if(chrisAudio.currentTime > 852 && chrisAudio.currentTime < 859){
            captionText = "cancel plans when I was like feeling a bit too tired for it but then I think the first";
        }

        if(chrisAudio.currentTime > 859 && chrisAudio.currentTime < 865){
            captionText = "sort of major signs that something was like not normally just like tired was I'd had these";
        }

        if(chrisAudio.currentTime > 865 && chrisAudio.currentTime < 872){
            captionText = "sort of like, kind of like being hangry basically these sort of meltdowns where I'd just like";
        }

        if(chrisAudio.currentTime > 872 && chrisAudio.currentTime < 882){
            captionText = "have nothing I just get so tired in the way that like a child does almost and that's because";
        }

        if(chrisAudio.currentTime > 882 && chrisAudio.currentTime < 889){
            captionText = "like normally you don't get that depleted and I was just getting that depleted and then";
        }

        if(chrisAudio.currentTime > 889 && chrisAudio.currentTime < 892){
            captionText = "that's something that I never even did as a child sort of have these sort of breakdowns";
        }

        if(chrisAudio.currentTime > 892 && chrisAudio.currentTime < 898){
            captionText = "so that's when I was like 'Oh something's up yeah this isn't normal.' Sort of tiredness is";
        }

        if(chrisAudio.currentTime > 898 && chrisAudio.currentTime < 903){
            captionText = "I think tiredness is a very loose word for it I think fatigue is commonly used but";
        }

        if(chrisAudio.currentTime > 903 && chrisAudio.currentTime < 911){
            captionText = "I think fatigue is also sort of in modern parlance quite misused with things like allyship fatigue";
        }

        if(chrisAudio.currentTime > 911 && chrisAudio.currentTime < 922){
            captionText = "and stuff which is kind of a non-thing but yeah the tiredness is sort of unlike anything";
        }

        if(chrisAudio.currentTime > 922 && chrisAudio.currentTime < 929){
            captionText = "I'd experienced previously, I think part of the contrast for me is I used to be a very";
        }

        if(chrisAudio.currentTime > 929 && chrisAudio.currentTime < 935){
            captionText = "energetic person. I wasn't necessarily the fittest person in terms of exercise and stuff";
        }

        if(chrisAudio.currentTime > 935 && chrisAudio.currentTime < 941){
            captionText = "I was quite fit but like I was always a sort of person who could persevere even if I was";
        }

        if(chrisAudio.currentTime > 941 && chrisAudio.currentTime < 950){
            captionText = "extremely exhausted and sort of I'd have no problems with that, like I could easily stay";
        }

        if(chrisAudio.currentTime > 950 && chrisAudio.currentTime < 958){
            captionText = "awake for a couple days doing quite physical activity and exercise and stuff and then now";
        }

        if(chrisAudio.currentTime > 958 && chrisAudio.currentTime < 972){
            captionText = "I think the sort of fatigue is kind of on another level of how deeply it affects me.";
        }

        if(chrisAudio.currentTime > 972 && chrisAudio.currentTime < 978){
            captionText = "Like even now, like as I've been housebound for quite a while and mostly bed bound within";
        }

        if(chrisAudio.currentTime > 978 && chrisAudio.currentTime < 982){
            captionText = "that and there's a huge difference to me when I can tell when I'm physically exhausted";
        }

        if(chrisAudio.currentTime > 982 && chrisAudio.currentTime < 990){
            captionText = "in a normal way or if it's more ME related because physically exhausted in a normal way, it feels";
        }

        if(chrisAudio.currentTime > 990 && chrisAudio.currentTime < 995){
            captionText = "like nothing I often won't necessarily notice I'm physically exhausted until I start to";
        }

        if(chrisAudio.currentTime > 995 && chrisAudio.currentTime < 1003){
            captionText = "feel the sort of ME exhaustion come on because it sort of penetrates like deep, there's like";
        }

        if(chrisAudio.currentTime > 1003 && chrisAudio.currentTime < 1013){
            captionText = "the phrase 'Bone Tired' feels like such a sort of light read of it, like I remember sort of";
        }

        if(chrisAudio.currentTime > 1013 && chrisAudio.currentTime < 1018){
            captionText = "reading some things where it was like the theories that it's like cellular where energy";
        }

        if(chrisAudio.currentTime > 1018 && chrisAudio.currentTime < 1024){
            captionText = "issues with ME and I think I really feel that because it does feel like the tiredness is";
        }

        if(chrisAudio.currentTime > 1024 && chrisAudio.currentTime < 1034){
            captionText = "permeating every single sort of element of your being and yeah I think it took a lot";
        }

        if(chrisAudio.currentTime > 1034 && chrisAudio.currentTime < 1043){
            captionText = "of getting used to because I was an energetic person so I have to sort of avoid physical";
        }

        if(chrisAudio.currentTime > 1043 && chrisAudio.currentTime < 1049){
            captionText = "things with ME because basically getting too tired is gonna only make you worse so it's";
        }

        if(chrisAudio.currentTime > 1049 && chrisAudio.currentTime < 1056){
            captionText = "I guess one of the few physical acts that I sort of do on a sort of regular basis that's";
        }

        if(chrisAudio.currentTime > 1056 && chrisAudio.currentTime < 1065){
            captionText = "sort of exactly the same so maybe that's also why it's sort of stands out to me. I realise";
        }

        if(chrisAudio.currentTime > 1065 && chrisAudio.currentTime < 1072){
            captionText = "this quite often about how removed I am from like people as well like I think sometimes";
        }

        if(chrisAudio.currentTime > 1072 && chrisAudio.currentTime < 1081){
            captionText = "when I see friends, I have this weird like sort of moment of like it almost feels like coming";
        }

        if(chrisAudio.currentTime > 1081 && chrisAudio.currentTime < 1088){
            captionText = "like meeting people who are, and you're both speaking your second language and there's";
        }

        if(chrisAudio.currentTime > 1088 && chrisAudio.currentTime < 1098){
            captionText = "this sort of barrier culturally as well as language linguistically where you kind of";
        }

        if(chrisAudio.currentTime > 1098 && chrisAudio.currentTime < 1105){
            captionText = "can't communicate to a certain extent about things I think part of that is a lot of sort of";
        }

        if(chrisAudio.currentTime > 1105 && chrisAudio.currentTime < 1115){
            captionText = "able-bodied people it's difficult to talk about disability with them because sort of";
        }

        if(chrisAudio.currentTime > 1115 && chrisAudio.currentTime < 1120){
            captionText = "I think able-bodied people don't really know how to interact with disability and I think";
        }

        if(chrisAudio.currentTime > 1120 && chrisAudio.currentTime < 1125){
            captionText = "a huge part of that is sort of taught, like often young people are told not to look at";
        }

        if(chrisAudio.currentTime > 1125 && chrisAudio.currentTime < 1130){
            captionText = "disabled people and like 'Don't stare, it's rude' and then they just like never look at";
        }

        if(chrisAudio.currentTime > 1130 && chrisAudio.currentTime < 1136){
            captionText = "disabled people so then they've got this weird like sort of 'I should look away from you' kind";
        }

        if(chrisAudio.currentTime > 1136 && chrisAudio.currentTime < 1144){
            captionText = "of vibe when they're talking to you and so yeah I think I think it might be sort of one";
        }

        if(chrisAudio.currentTime > 1144 && chrisAudio.currentTime < 1152){
            captionText = "of those things that sort of if you don't experience it you just kind of have to listen";
        }

        if(chrisAudio.currentTime > 1152 && chrisAudio.currentTime < 1156){
            captionText = "and I think in the arts that's not, that's one of those things that people say they do";
        }

        if(chrisAudio.currentTime > 1156 && chrisAudio.currentTime < 1164){
            captionText = "but don't and struggle with.";
        }

        if(chrisAudio.currentTime > 1164){
            captionText = "";
        }

    }
}

function displayUI() {

    push();

    fill(palette.black)
    textAlign(CENTER, CENTER);
    noStroke();
    textFont(brushFont);

    textSize(25);
    text(days[dayCount%days.length], width - 50, 35);

    text(captionText, width - 640, 650);

    fill(palette.mid);
    rect(width - 50, 80, 50, 50, 10);

    fill(palette.white);
    textSize(40);
    text(dayCount+1, width - 50, 73);

    translate(width/2, 85);

    fill(palette.white);
    stroke(palette.mid);
    strokeWeight(1);
    rect(0, 0, 110, 110, 15);
    rect(0, 0, 110-10, 110-10, 10);

    noStroke();
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

    giveUpButton.display();
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
    toxicWater = [];

    risingWater = 0;
    if (act == 3) risingWater = new RisingWater();

    let offset = 27;

    for (let j = 0; j <= height+offset*2; j += offset) {
        for (let i = 0; i <= width; i += offset) {

            let x = i + random(-offset, offset);
            let y = j + random(-offset, offset);

            walls.push(new Wall(x, y, 85));
        }
    }

    waterCanvas.clear();

    if (act == 2 || act == 3) {
        for (let i = 0; i < toxicCount/2; i++) {
            toxicWater.push(new ToxicWater());
        }
    }

    giveUpButton.lifeTime = 0;
    player.bounceCount = 0;
    player.lavaDeathCount = 0;

    pathMaker = new PathMaker();

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
        return;
    }

    if (dist(door.x, door.y, key.x, key.y) < 200) {
        newMaze(fresh, myDoor);
        return;
    }

    background(color(20, 114, 176, 255));

    wallCanvas.clear();
    ballCanvas.clear();

    updateWalls();

    for (let i = 0; i < 100; i++) ballCanvas.background(color(68, 140, 187, 10));

    if (dayCount <= 1) return;

    if (snow.length > 1000 || (random() < 0.3 && snow.length > 0)) {
        let half = snow.length/2;
        snow = snow.splice(0, half);
    } else if (snow.length == 0) {
        for (let i = 0; i < 50; i++) {
            snow.push(new Snow());
        }
    } else {
        let currentSnow = snow.length;
        for (let i = 0; i < currentSnow; i++) {
            snow.push(new Snow());
        }
    }
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
    text(char(letter), x, y-5);
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
