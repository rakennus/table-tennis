let opponent = new function () {
    // opponent properties
    this.roundedPosition = { x: 200, y: 20, };
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.roundedVelocity = { x: 0, y: 0 };
    this.size = { width: 20, height: 80 };

    this.friction = 0.004;
    this.maxVelocity = 1000;
    this.accelleration = 600;
    this.points = 0;

    this.update = function () {
        this.movment();
    }

    // function to calculate the position and velocity of the player
    this.movment = function () {
        // controls
        if (ball.velocity.x > 0) {
            if (ball.position.y >= this.roundedPosition.y && ball.position.y + ball.size.height <= this.roundedPosition.y + this.size.height) {
                this.velocity.y *= Math.pow(this.friction, secondsPassed);
            } else if (ball.position.y < this.roundedPosition.y) {
                this.velocity.y -= this.accelleration * secondsPassed;
            } else if (ball.position.y + ball.size.height > this.roundedPosition.y + this.size.height) {
                this.velocity.y += this.accelleration * secondsPassed;
            }
        }
        if (ball.velocity.x < 0) {
            if (this.roundedPosition.y + (this.size.height / 2) + 10 >= canvas.height / 2 && this.roundedPosition.y + (this.size.height / 2) - 10 <= canvas.height / 2) {
                this.velocity.y *= Math.pow(this.friction, secondsPassed);
            } else if (this.roundedPosition.y + (this.size.height / 2) - 10 > canvas.height / 2) {
                this.velocity.y -= this.accelleration * secondsPassed;
            } else if (this.roundedPosition.y + (this.size.height / 2) - 10 < canvas.height / 2) {
                this.velocity.y += this.accelleration * secondsPassed;
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
        } else if (this.roundedPosition.y + this.size.height + this.roundedVelocity.y > canvas.height) {
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

    // function to draw the opponents paddle
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
