"use strict";
// global variable declaration
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let rect = null;

let scale = 0;

let secondsPassed = 0;
let oldTimeStamp = 0;
let fps = 0;

let run = true;
let resetTime = false;

let xpAnnouncers = [];

let controls = {
    left: false,
    right: false,
    up: false,
    down: false,
    touchControls: false,
    touchStarted: false,
    ongoingTouches: [],
    timeNotTouched: 0,
}

// loads game area on window load
window.onload = (e) => { game.load() }

let game = {
    load: function () {
        // calculating scaling of canvas
        scale = canvas.width / canvas.clientWidth;

        // recalculating scaling of canvas on resize or orientation change of the window    
        window.addEventListener('resize', () => scale = canvas.width / canvas.clientWidth);
        screen.orientation.addEventListener('change', () => scale = canvas.width / canvas.clientWidth);

        // Get canvas position in viewport
        rect = canvas.getBoundingClientRect();

        // touch listener
        canvas.addEventListener("touchstart", TouchHandleStart, false);
        canvas.addEventListener("touchmove", TouchHandleMove, false);
        canvas.addEventListener("touchend", TouchHandleEnd, false);

        // keyboard listener
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);

        ball.reset();

        // positioning player and opponent
        player.position.x = 40,
            player.position.y = canvas.height / 2 - player.size.height / 2

        opponent.position.x = canvas.width - opponent.size.width - 40,
            opponent.position.y = canvas.height / 2 - opponent.size.height / 2

        game.start();
    },
    start: function () {
        // Start the first frame request
        window.requestAnimationFrame(gameLoop);
        run = true;
        resetTime = true;
    },
    stop: function () {
        run = false;
    }
}

function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    if (resetTime) secondsPassed = 0; resetTime = false;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    if (!document.hidden) {
        // Update game objects in the loop
        update();
        // Perform the drawing operation
        draw();
    }

    // The loop function has reached it's end. Keep requesting new frames
    if (run) window.requestAnimationFrame(gameLoop);
}

// update all objects
function update() {
    // update objects
    player.update();
    opponent.update();
    ball.update();

    controls.timeNotTouched += secondsPassed;
    touchControlAnnouncer.update();

    // update xp announcers and the xp counter
    for (let i = 0; i < xpAnnouncers.length; i++) {
        xpAnnouncers[i].update();
        if (xpAnnouncers[i].timer >= xpAnnouncers[i].time) xpAnnouncers.splice(xpAnnouncers.indexOf(xpAnnouncers[i]), 1);
    }

    xpCounter.update();

    touchPadle.update();
}

function draw() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw objects
    player.draw();
    opponent.draw();
    ball.draw();

    if (controls.touchControls) {
        touchPadle.draw();
    }
    touchControlAnnouncer.draw();

    // draw xp announcers and the xp counter
    for (let i = 0; i < xpAnnouncers.length; i++) {
        xpAnnouncers[i].draw();
    }

    xpCounter.draw();

    touchPadle.draw();

    // draw fps
    ctx.font = '10px Arial';
    ctx.textAlign = "left";
    ctx.fillStyle = 'white';
    ctx.fillText("FPS: " + fps, 20, 20);

    // draw points
    ctx.font = '80px Arial';
    ctx.textBaseline = 'top';
    ctx.textAlign = "right";
    ctx.fillText(player.points, canvas.width / 4, 20);
    ctx.textAlign = "left";
    ctx.fillText(opponent.points, canvas.width - canvas.width / 4, 20);
}

function keyDownHandler(e) {
    controls.touchControls = false;
    controls.timeNotTouched = 0;

    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") controls.right = true;
    if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") controls.left = true;
    if (e.key == "Up" || e.key == "ArrowUp" || e.key == "w" || e.key == "W") controls.up = true;
    if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s" || e.key == "S") controls.down = true;
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") controls.right = false;
    if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") controls.left = false;
    if (e.key == "Up" || e.key == "ArrowUp" || e.key == "w" || e.key == "W") controls.up = false;
    if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s" || e.key == "S") controls.down = false;
}

// touch handler
function TouchHandleStart(e) {
    e.preventDefault();
    controls.touchControls = true;
    controls.timeNotTouched = 0;
    controls.ongoingTouches = e.changedTouches;
};

function TouchHandleMove(e) {
    e.preventDefault();
    controls.timeNotTouched = 0;
    controls.ongoingTouches = e.changedTouches;
};

function TouchHandleEnd(e) {
    e.preventDefault();
    controls.ongoingTouches = [];
};