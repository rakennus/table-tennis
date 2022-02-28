let player = new function () {
    // player properties
    this.position = {x: 0,y: 0};
    this.size = {width: 20,height: 100};
    this.velocity = {x: 0,y: 0};
    this.roundedVelocity = {x: 0,y: 0};

    this.maxVelocity = 800;
    this.accelleration = 4000;
    this.touchAccelleration = 4000;
    this.points = 0;
    this.score = 0;

    this.update = function () {
        this.movment();
    }

    // function to calculate the position and velocity of the player
    this.movment = function () {
        // controls
        if (controls.touchControls) {
            if (!touchPadle.up && !touchPadle.down || touchPadle.up && touchPadle.down) {
                this.velocity.y *= Math.pow(0.3, secondsPassed);
            } else if (touchPadle.down) {
                this.velocity.y += this.touchAccelleration * secondsPassed;
            } else if (touchPadle.up) {
                this.velocity.y -= this.touchAccelleration * secondsPassed;
            }
        } else {            
            if (!controls.up && !controls.down || controls.up && controls.down) {
                this.velocity.y *= Math.pow(0.3, secondsPassed);
            } else if (controls.down) {
                this.velocity.y += this.accelleration * secondsPassed;
            } else if (controls.up) {
                this.velocity.y -= this.accelleration * secondsPassed;
            }
        }

        if (this.velocity.y >= this.maxVelocity) {
            this.velocity.y = this.maxVelocity;
        }
        if (this.velocity.y <= -this.maxVelocity) {
            this.velocity.y = -this.maxVelocity;
        }

        // collision detection with canvas borders
        if (this.position.y + this.roundedVelocity.y < 0) {
            this.velocity.y = 0;
            this.roundedVelocity.y = 0;
            this.position.y = 0;
        } else if (this.position.y + this.size.height + this.roundedVelocity.y > canvas.height) {
            this.velocity.y = 0;
            this.roundedVelocity.y = 0;
            this.position.y = canvas.height - this.size.height;
        }

        // calculating the position by applaying the velocity to the old position
        this.roundedVelocity.x = Math.trunc(this.velocity.x * secondsPassed);
        this.roundedVelocity.y = Math.trunc(this.velocity.y * secondsPassed);

        this.position.x += this.roundedVelocity.x;
        this.position.y += this.roundedVelocity.y;
    }

    // function to draw the players paddle
    this.draw = function () {
        ctx.fillStyle = "white";
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    }
}
