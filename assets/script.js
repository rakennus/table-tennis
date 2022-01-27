"use strict";
// global variable declaration
let canvas;
let ctx;

let secondsPassed = 0;
let oldTimeStamp = 0;
let fps = 0;

let controls = {
    left: false,
    right: false,
    up: false,
    down: false
}

window.onload = startGame;

function startGame() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // loads game area
    myGameArea.load();

    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}

let myGameArea = {
    load: function () {
        player.position.x = 40;
        player.position.y = canvas.height / 2 - player.size.height / 2;

        opponent.position.x = canvas.width - opponent.size.width - 40;
        opponent.position.y = canvas.height / 2 - opponent.size.height / 2;

        ball.reset();
    }
}

function gameLoop(timeStamp) {
    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    if (!document.hidden) {
        // Update game objects in the loop
        update();
        // Perform the drawing operation
        draw();
    }

    // The loop function has reached it's end. Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

// update all objects
function update() {
    player.update();
    opponent.update();
    ball.update();
}

function draw() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    player.draw();
    opponent.draw();
    ball.draw();

    // draw fps
    ctx.font = '10px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText("FPS: " + fps, 10, 20);

    ctx.font = '80px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = "right";
    ctx.fillText(player.points, canvas.width / 2 - 40, 100);
    ctx.textAlign = "left";
    ctx.fillText(opponent.points, canvas.width / 2 + 40, 100);
}

// keyboard controls
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
        controls.right = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
        controls.left = true;
    }
    else if (e.key == "Up" || e.key == "ArrowUp" || e.key == "w" || e.key == "W") {
        controls.up = true;
    }
    else if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s" || e.key == "S") {
        controls.down = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
        controls.right = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
        controls.left = false;
    }
    else if (e.key == "Up" || e.key == "ArrowUp" || e.key == "w" || e.key == "W") {
        controls.up = false;
    }
    else if (e.key == "Down" || e.key == "ArrowDown" || e.key == "s" || e.key == "S") {
        controls.down = false;
    }
}

function coinflip() {
    if (Math.random() * 2 <= 1) {
        return true;
    } else {
        return false;
    }
}