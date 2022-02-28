let opponent = new function () {
    // opponent properties
    this.position = { x: 0, y: 0 };
    this.size = { width: 20, height: 100 };
    this.velocity = { x: 0, y: 0 };
    this.roundedVelocity = { x: 0, y: 0 };

    this.friction = 0;
    this.maxVelocity = 800;
    this.accelleration = 1000;
    this.points = 0;

    this.update = function () {
        this.movment();
    }

    // function to calculate the position and velocity of the player
    this.movment = function () {
        // controls
        if (ball.velocity.x > 0) {
            if (ball.position.y >= this.position.y && ball.position.y + ball.size.height <= this.position.y + this.size.height) {
                this.velocity.y *= Math.pow(this.friction, secondsPassed);
            } else if (ball.position.y < this.position.y) {
                this.velocity.y -= this.accelleration * secondsPassed;
            } else if (ball.position.y + ball.size.height > this.position.y + this.size.height) {
                this.velocity.y += this.accelleration * secondsPassed;
            }
        }
        if (ball.velocity.x < 0) {
            if (this.position.y + (this.size.height / 2) + 10 >= canvas.height / 2 && this.position.y + (this.size.height / 2) - 10 <= canvas.height / 2) {
                this.velocity.y *= Math.pow(this.friction, secondsPassed);
            } else if (this.position.y + (this.size.height / 2) - 10 > canvas.height / 2) {
                this.velocity.y -= this.accelleration * secondsPassed;
            } else if (this.position.y + (this.size.height / 2) - 10 < canvas.height / 2) {
                this.velocity.y += this.accelleration * secondsPassed;
            }
        }

        if (this.velocity.y >= this.maxVelocity) this.velocity.y = this.maxVelocity;
        if (this.velocity.y <= -this.maxVelocity) this.velocity.y = -this.maxVelocity;

        // calculating the position by applaying the velocity to the old position
        this.roundedVelocity.x = Math.trunc(this.velocity.x * secondsPassed);
        this.roundedVelocity.y = Math.trunc(this.velocity.y * secondsPassed);

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

        this.position.x += this.roundedVelocity.x;
        this.position.y += this.roundedVelocity.y;
    }

    // function to draw the opponents paddle
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
