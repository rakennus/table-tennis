let ball = new function () {
    speed = 300;

    this.roundedPosition = { x: 200, y: 20, };
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.roundedVelocity = { x: 0, y: 0 };
    this.size = { width: 20, height: 20 };

    this.maxVelocity = {
        x: speed + 100,
        y: speed + 100
    };    

    this.reset = function () {
        this.position.x = canvas.width / 2 - ball.size.width / 2;
        this.position.y = canvas.height / 2 - ball.size.height / 2;

        this.velocity.x = -speed;

        if (Math.random() * 2 <= 1) {
            this.velocity.y = -speed;
        } else {
            this.velocity.y = speed;
        }
    }

    this.update = function () {
        this.movment();
    }

    this.movment = function () {
        // collision detection with canvas borders followed by velocity invertation
        if (this.position.x + this.size.width + this.roundedVelocity.x >= canvas.width) {
            this.reset();
            player.points++;
            xpAnnouncers.push(new xpAnnouncer(100));
        } else if (this.position.x + this.roundedVelocity.x <= 0) {
            this.reset();
            opponent.points++;
        }
        if (this.position.y + this.size.height + this.roundedVelocity.y >= canvas.height) {
            this.velocity.y = -this.velocity.y;
        } else if (this.position.y + this.roundedVelocity.y <= 0) {
            this.velocity.y = -this.velocity.y;
        }

        // collision with player paddle
        if (
            player.roundedPosition.x + player.roundedVelocity.x < this.position.x + this.size.width &&
            player.roundedPosition.x + player.roundedVelocity.x + player.size.width > this.position.x &&
            player.roundedPosition.y + player.roundedVelocity.y < this.position.y + this.roundedVelocity.y + this.size.height &&
            player.roundedPosition.y + player.roundedVelocity.y + (player.size.height / 2) > this.position.y + this.roundedVelocity.y
        ) {
            this.velocity.y = -this.velocity.y;
            player.velocity.y = 0;
            player.roundedVelocity.y = 0;
            player.position.y = this.position.y + this.size.height;
            player.roundedPosition.y = this.position.y + this.size.height;
        }
        if (
            player.roundedPosition.x + player.roundedVelocity.x < this.position.x + this.size.width &&
            player.roundedPosition.x + player.roundedVelocity.x + player.size.width > this.position.x &&
            player.roundedPosition.y + player.roundedVelocity.y + player.size.height > this.position.y + this.roundedVelocity.y &&
            player.roundedPosition.y + player.roundedVelocity.y + (player.size.height / 2) < this.position.y + this.roundedVelocity.y + this.size.height
        ) {
            this.velocity.y = -this.velocity.y;
            player.velocity.y = 0;
            player.roundedVelocity.y = 0;
            player.position.y = this.position.y - player.size.height;
            player.roundedPosition.y = this.position.y - player.size.height;
        }

        if (
            this.position.x + this.roundedVelocity.x < player.roundedPosition.x + player.size.width &&
            this.position.x + this.roundedVelocity.x + (this.size.width / 2) > player.roundedPosition.x &&
            this.position.y + this.roundedVelocity.y + this.size.height > player.roundedPosition.y + player.roundedVelocity.y &&
            this.position.y + this.roundedVelocity.y < player.roundedPosition.y + player.roundedVelocity.y + player.size.height
        ) {
            this.velocity.x = -this.velocity.x;
            this.roundedVelocity.x = -this.roundedVelocity.x;
            if (this.position.y + (this.size.height / 2) < player.roundedPosition.y + (player.size.height * 0.4)) {
                this.velocity.y -= 100;
            }
            if (this.position.y + (this.size.height / 2) > player.roundedPosition.y + player.size.height - (player.size.height * 0.4)) {
                this.velocity.y += 100;
            }
        }

        // collision with opponent paddle
        if (
            opponent.roundedPosition.x + opponent.roundedVelocity.x < this.position.x + this.size.width &&
            opponent.roundedPosition.x + opponent.roundedVelocity.x + opponent.size.width > this.position.x &&
            opponent.roundedPosition.y + opponent.roundedVelocity.y < this.position.y + this.size.height &&
            opponent.roundedPosition.y + opponent.roundedVelocity.y + (opponent.size.height / 2) > this.position.y
        ) {
            this.velocity.y = -this.velocity.y;
            opponent.velocity.y = 0;
            opponent.roundedVelocity.y = 0;
            opponent.position.y = this.position.y + this.size.height;
            opponent.roundedPosition.y = this.position.y + this.size.height;
        }

        if (
            opponent.roundedPosition.x + opponent.roundedVelocity.x < this.position.x + this.size.width &&
            opponent.roundedPosition.x + opponent.roundedVelocity.x + opponent.size.width > this.position.x &&
            opponent.roundedPosition.y + opponent.roundedVelocity.y + opponent.size.height > this.position.y &&
            opponent.roundedPosition.y + opponent.roundedVelocity.y + (opponent.size.height / 2) < this.position.y + this.size.height
        ) {
            this.velocity.y = -this.velocity.y;
            opponent.velocity.y = 0;
            opponent.roundedVelocity.y = 0;
            opponent.position.y = this.position.y - opponent.size.height;
            opponent.roundedPosition.y = this.position.y - opponent.size.height;
        }

        if (
            this.position.x + this.roundedVelocity.x + this.size.width > opponent.roundedPosition.x &&
            this.position.x + this.roundedVelocity.x < opponent.roundedPosition.x + (this.size.width / 2) &&
            this.position.y + this.roundedVelocity.y + this.size.height > opponent.roundedPosition.y + opponent.roundedVelocity.y &&
            this.position.y + this.roundedVelocity.y < opponent.roundedPosition.y + opponent.roundedVelocity.y + opponent.size.height
        ) {
            this.velocity.x = -this.velocity.x;
            this.roundedVelocity.x = -this.roundedVelocity.x;
            if (this.position.y - (this.size.height / 2) < opponent.roundedPosition.y + (opponent.size.height / 3)) {
                this.velocity.y -= 100;
            }
            if (this.position.y - (this.size.height / 2) > opponent.roundedPosition.y + opponent.size.height - (opponent.size.height / 3)) {
                this.velocity.y += 100;
            }
        }

        if (this.velocity.y > this.maxVelocity.y) {
            this.velocity.y = this.maxVelocity.y;
        }
        if (this.velocity.y < -this.maxVelocity.y) {
            this.velocity.y = -this.maxVelocity.y;
        }

        // calculating the position by applaying the velocity to the old position
        this.position.x += this.velocity.x * secondsPassed;
        this.position.y += this.velocity.y * secondsPassed;

        this.roundedVelocity.x = Math.trunc(this.velocity.x * secondsPassed);
        this.roundedVelocity.y = Math.trunc(this.velocity.y * secondsPassed);

        this.roundedPosition.x = Math.trunc(this.position.x);
        this.roundedPosition.y = Math.trunc(this.position.y);
    }

    // function to draw the ball
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