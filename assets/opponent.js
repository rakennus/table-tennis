let opponent = new function () {
    // opponent properties
    this.position = {
        x: 0,
        y: 0
    };
    this.size = {
        width: 20,
        height: 100
    };
    this.velocity = {
        x: 0,
        y: 0
    };
    this.maxVelocity = {
        x: 480,
        y: 480
    };
    this.roundedVelocity = {
        x: 0,
        y: 0
    };
    this.friction = {
        x: 0.9,
        y: 0.9
    };
    this.speed = {
        x: 20,
        y: 20
    };
    this.points = 0;

    this.update = function () {
        this.movment();
    }

    // function to calculate the position and velocity of the player
    this.movment = function () {
        // controls
        if (ball.velocity.x > 0) {
            if (ball.position.y >= this.position.y && ball.position.y + ball.size.height <= this.position.y + this.size.height) {
                this.velocity.y *= this.friction.y;
            } else if (ball.position.y < this.position.y) {
                this.velocity.y -= this.speed.y;
            } else if (ball.position.y + ball.size.height > this.position.y + this.size.height) {
                this.velocity.y += this.speed.y;
            }
        }
        if (ball.velocity.x < 0) {
            if (this.position.y + (this.size.height / 2) + 10 >= canvas.height / 2 && this.position.y + (this.size.height / 2) - 10 <= canvas.height / 2) {
                this.velocity.y *= this.friction.y;
            } else if (this.position.y + (this.size.height / 2) - 10 > canvas.height / 2) {
                this.velocity.y -= this.speed.y;
            } else if (this.position.y + (this.size.height / 2) - 10 < canvas.height / 2) {
                this.velocity.y += this.speed.y;
            }
        }

        if (this.velocity.y > this.maxVelocity.y) {
            this.velocity.y = this.maxVelocity.y;
        } else if (this.velocity.y < -this.maxVelocity.y) {
            this.velocity.y = -this.maxVelocity.y;
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
