"use strict";
// global variable declaration
let canvas = null;
let ctx = null;
let rect = null;

let ratio = 0;

let secondsPassed = 0;
let oldTimeStamp = 0;
let fps = 0;

let run = true;
let resetTime = false;

function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod =
        element.requestFullScreen ||
        element.webkitRequestFullScreen ||
        element.mozRequestFullScreen ||
        element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

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

let xpAnnouncers = [];

window.onload = (e) => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    myGameArea.canvasStyle();

    window.addEventListener('resize', myGameArea.canvasStyle());
    screen.orientation.addEventListener('change', myGameArea.canvasStyle());

    rect = canvas.getBoundingClientRect();

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
        draw();
    },
    canvasStyle: function () {
        /*
        if (canvas.clientHeight > document.documentElement.clientHeight) {
            canvas.style.width = 'inherit';
            canvas.style.height = '100%';
        }
        if (canvas.clientWidth > document.documentElement.clientWidth) {
            canvas.style.width = '100%';
            canvas.style.height = 'inherit';
        }
        */
        ratio = canvas.width / canvas.clientWidth;
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
    touchPadle.update();
    player.update();
    opponent.update();
    ball.update();
    controls.timeNotTouched += secondsPassed;
    touchControlAnnouncer.update();

    xpAnnouncers.forEach(element => {
        element.update();
        if (element.timer >= element.time) {
            xpAnnouncers.splice(xpAnnouncers.indexOf(element), 1);
        }
    });

    xpCounter.update();
}

function draw() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    player.draw();
    opponent.draw();
    ball.draw();

    if (controls.touchControls) {
        touchPadle.draw();
    }
    touchControlAnnouncer.draw();

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

let touchControlAnnouncer = {
    timer: 0,
    alpha: 0,
    visible: true,
    update: function () {
        if (controls.timeNotTouched < 5) {
            this.alpha -= 1 * secondsPassed;
        } else {
            this.alpha += 1 * secondsPassed;
        }

        if (this.alpha >= 1) {
            this.alpha = 1;
        }
        if (this.alpha <= 0) {
            this.alpha = 0;
        }
    },
    draw: function () {
        ctx.font = '30px Arial';
        ctx.textAlign = "center";
        ctx.globalAlpha = this.alpha;
        ctx.textBaseline = 'bottom';
        ctx.fillText('Use WASD or Arrow keys to move the Player,', canvas.width / 2, canvas.height / 2);
        ctx.textBaseline = 'top';
        ctx.fillText(
            'or tap on the right and on the left to move up and down.',
            canvas.width / 2,
            canvas.height / 2
        );
        ctx.globalAlpha = 1;
    },
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

let touchPadle = {
    up: false,
    down: false,

    update: function () {
        this.up = false;
        this.down = false;

        for (let i = 0; i < controls.ongoingTouches.length; i++) {
            if (
                (controls.ongoingTouches[0].pageX - rect.left) * ratio < canvas.width / 2 &&
                (controls.ongoingTouches[0].pageX - rect.left) * ratio > 0 &&
                (controls.ongoingTouches[0].pageY - rect.top) * ratio < canvas.height &&
                (controls.ongoingTouches[0].pageY - rect.top) * ratio > 0
            ) {
                this.up = true;
            }
            if (
                (controls.ongoingTouches[0].pageX - rect.left) * ratio < canvas.width &&
                (controls.ongoingTouches[0].pageX - rect.left) * ratio > canvas.width / 2 &&
                (controls.ongoingTouches[0].pageY - rect.top) * ratio < canvas.height &&
                (controls.ongoingTouches[0].pageY - rect.top) * ratio > 0
            ) {
                this.down = true;
            }
        }
    },
    draw: function () {
    }
}

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
    this.playerScore = player.score;

    player.score += this.amount;

    this.update = function () {
        this.timer += secondsPassed;

        if (this.timer < 0.4) {
            this.y = -800 * this.timer * this.timer + 200;
            this.alpha = this.timer * 2;
        }
        if (this.timer > 0.4) {
            this.rotation = 0;
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
    score: 0,

    update: function () {
        this.timer += secondsPassed;

        if (this.score < player.score) {
            this.score += Math.trunc(10000 * secondsPassed);
        }

        if (this.score > player.score) {
            this.score = player.score;
        }
    },
    draw: function () {
        ctx.save();
        ctx.translate(canvas.width / 2, 20);

        ctx.rotate(Math.PI * this.rotation);

        ctx.font = '30px Arial';
        ctx.textAlign = "center";
        ctx.fillText(this.score + ' XP', 0, 0);

        ctx.restore();
    }
}