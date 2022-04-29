let player = new function () {
    // player properties
    this.roundedPosition = { x: 200, y: 20, };
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.roundedVelocity = { x: 0, y: 0 };
    this.size = { width: 20, height: 100 };

    this.friction = 0.005;
    this.maxVelocity = 800;
    this.accelleration = 8000;
    this.touchAccelleration = 4000;
    this.points = 0;
    this.XP = 0;

    this.update = function () {
        this.movment();
    }

    // function to calculate the position and velocity of the player
    this.movment = function () {
        // controls
        if (controls.touchControls) {
            if (!touchPadle.up && !touchPadle.down || touchPadle.up && touchPadle.down) {
                this.velocity.y *= Math.pow(this.friction, secondsPassed);
            } else if (touchPadle.down) {
                this.velocity.y += this.touchAccelleration * secondsPassed;
            } else if (touchPadle.up) {
                this.velocity.y -= this.touchAccelleration * secondsPassed;
            }
        } else {
            if (!controls.up && !controls.down || controls.up && controls.down) {
                this.velocity.y *= Math.pow(this.friction, secondsPassed);
            } else if (controls.down) {
                this.velocity.y += this.accelleration * secondsPassed;
            } else if (controls.up) {
                this.velocity.y -= this.accelleration * secondsPassed;
            }
        }

        if (this.velocity.y >= this.maxVelocity) this.velocity.y = this.maxVelocity;
        if (this.velocity.y <= -this.maxVelocity) this.velocity.y = -this.maxVelocity;

        // collision detection with canvas borders
        if (this.roundedPosition.y + this.roundedVelocity.y < 0) {
            this.velocity.y = 0;
            this.roundedVelocity.y = 0;
            this.position.y = 0;
            this.roundedPosition.y = 0;
        } else if (this.position.y + this.size.height + this.roundedVelocity.y > canvas.height) {
            this.velocity.y = 0;
            this.roundedVelocity.y = 0;
            this.position.y = canvas.height - this.size.height;
            this.roundedPosition.y = canvas.height - this.size.height;
        }

        // calculating the position by applaying the velocity to the old position
        this.position.x += this.velocity.x * secondsPassed;
        this.position.y += this.velocity.y * secondsPassed;

        this.roundedVelocity.x = Math.trunc(this.velocity.x * secondsPassed);
        this.roundedVelocity.y = Math.trunc(this.velocity.y * secondsPassed);

        this.roundedPosition.x = Math.trunc(this.position.x);
        this.roundedPosition.y = Math.trunc(this.position.y);
    }

    // function to draw the players paddle
    this.draw = function () {
        ctx.fillStyle = "white";
        ctx.fillRect(
            this.roundedPosition.x,
            this.roundedPosition.y,
            this.size.width,
            this.size.height
        );
    }
}
