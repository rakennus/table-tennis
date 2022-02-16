"use strict";
// global variable declaration
let canvas;
let ctx;

let secondsPassed = 0;
let oldTimeStamp = 0;
let fps = 0;

let fixedUpdateTime = 0;
let fixedUpdateCount = 0;

let controls = {
    left: false,
    right: false,
    up: false,
    down: false,
    touchControls: false,
    touchStarted: false,
    end: { x: 0, y: 0 },
    start: { x: 0, y: 0 },
}

let xpAnnouncers = [];

window.onload = (event) => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // touch listener
    canvas.addEventListener("touchstart", TouchHandleStart, false);
    canvas.addEventListener("touchmove", TouchHandleMove, false);
    canvas.addEventListener("touchend", TouchHandleEnd, false);

    // keyboard listener
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    // loads game area
    myGameArea.load();
}

let myGameArea = {
    load: function () {
        player.position.x = 40;
        player.position.y = canvas.height / 2 - player.size.height / 2;

        opponent.position.x = canvas.width - opponent.size.width - 40;
        opponent.position.y = canvas.height / 2 - opponent.size.height / 2;

        ball.reset();

        // Start the first frame request
        window.requestAnimationFrame(gameLoop);
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
    joyStick.update();

    xpAnnouncers.forEach(element => {
        element.update();
        if (element.timer >= element.time) {
            xpAnnouncers.splice(xpAnnouncers.indexOf(element), 1);
        }
    });

    xpCounter.update();

    fixedUpdateTime += secondsPassed;
    if (fixedUpdateTime >= fixedUpdateCount) { fixedUpdate(); fixedUpdateCount += 0.01 };
}

function fixedUpdate() {
    axis.update();
}

function draw() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    player.draw();
    opponent.draw();
    ball.draw();

    if (controls.touchControls) {
        joyStick.draw();
    }

    xpAnnouncers.forEach(element => {
        element.draw();
    });

    // draw fps
    ctx.font = '10px Arial';
    ctx.textAlign = "left";
    ctx.fillStyle = 'white';
    ctx.fillText("FPS: " + fps, 20, 20);

    ctx.font = '80px Arial';
    ctx.textBaseline = 'top';
    ctx.textAlign = "right";
    ctx.fillText(player.points, canvas.width / 4, 20);
    ctx.textAlign = "left";
    ctx.fillText(opponent.points, canvas.width - canvas.width / 4, 20);

    xpCounter.draw();
}

let axis = {
    horizontal: 0,
    vertical: 0,
    speed: 0.1,

    update: function () {
        if (!controls.left && !controls.right || controls.left && controls.right) {
            this.horizontal *= 0.95;
        } else if (controls.right) {
            this.horizontal += this.speed;
        } else if (controls.left) {
            this.horizontal -= this.speed;
        }

        if (this.horizontal >= 1) {
            this.horizontal = 1;
        }
        if (this.horizontal <= -1) {
            this.horizontal = -1;
        }

        if (!controls.up && !controls.down || controls.up && controls.down) {
            this.vertical *= 0.95;
        } else if (controls.down) {
            this.vertical += this.speed;
        } else if (controls.up) {
            this.vertical -= this.speed;
        }

        if (this.vertical >= 1) {
            this.vertical = 1;
        }
        if (this.vertical <= -1) {
            this.vertical = -1;
        }
    }
}

let joyStick = {
    stickX: 0,
    stickY: 0,
    x: 0,
    y: 0,
    size: 120,
    margin: 80,
    padding: 20,
    color: 'white',

    update: function () {
        this.stickX = -(controls.start.x - controls.end.x);
        this.stickY = -(controls.start.y - controls.end.y);

        if (this.stickX > this.size / 2) {
            this.stickX = this.size / 2;
        } else if (this.stickX < -this.size / 2) {
            this.stickX = -this.size / 2;
        }

        if (this.stickY > this.size / 2) {
            this.stickY = this.size / 2;
        } else if (this.stickY < -this.size / 2) {
            this.stickY = -this.size / 2;
        }
    },
    draw: function () {
        this.x = this.size / 2 + this.margin;
        this.y = canvas.height - this.size / 2 - this.margin;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI);
        ctx.strokeStyle = this.color;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x + this.stickX, this.y + this.stickY, this.size / 2 - this.padding, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function keyDownHandler(e) {
    controls.touchControls = false;

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

// touch handler
function TouchHandleStart(event) {
    event.preventDefault();
    controls.touchControls = true;

    controls.touchStarted = true;
    controls.start.x = event.changedTouches[0].pageX;
    controls.start.y = event.changedTouches[0].pageY;

    controls.end.x = event.changedTouches[0].pageX;
    controls.end.y = event.changedTouches[0].pageY;
};

function TouchHandleMove(event) {
    event.preventDefault();

    controls.end.x = event.changedTouches[0].pageX;
    controls.end.y = event.changedTouches[0].pageY;
};

function TouchHandleEnd(event) {
    event.preventDefault();

    controls.start.x = 0;
    controls.start.y = 0;

    controls.end.x = 0;
    controls.end.y = 0;

    controls.touchStarted = false;
};

function coinflip() {
    if (Math.random() * 2 <= 1) {
        return true;
    } else {
        return false;
    }
}

function xpAnnouncer(amount) {
    this.amount = amount;
    this.rotation = -0.15;
    this.x = canvas.width / 2;
    this.y = 100;
    this.timer = 0;
    this.time = 1.2;
    this.velocity = 1;
    this.alpha = 1;
    this.added = 0;

    this.update = function () {
        this.timer += secondsPassed;

        if (this.timer < 0.4) {
            this.y = -800 * this.timer * this.timer + 200;
            this.alpha = this.timer * 2;
        }
        if (this.timer > 0.4) {
            this.rotation = 0;
            if (this.added < this.amount) {
                player.score += 20;
                this.added += 20;
            }
        }
        if (this.timer > 1) {
            this.rotation = (this.timer - 1) * 10;
            this.alpha = 1 - (this.timer - 1) * 5;
        }
    }

    this.draw = function () {
        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.rotate(Math.PI * this.rotation);
        ctx.globalAlpha = this.alpha;

        ctx.font = '30px Arial';
        ctx.textAlign = "center";
        ctx.textBaseline = 'middle';
        ctx.fillText('+ ' + amount + ' XP', 0, 0);

        ctx.restore();
    }
}

let xpCounter = {
    rotation: 0,
    timer: 0,
    update: function () {
        this.timer += secondsPassed;
    },
    draw: function () {
        ctx.save();
        ctx.translate(canvas.width / 2, 20);

        ctx.rotate(Math.PI * this.rotation);

        ctx.font = '30px Arial';
        ctx.textAlign = "center";
        ctx.fillText(player.score + ' XP', 0, 0);

        ctx.restore();
    }
}