let ball = new function () {
    speed = 400;
    this.position = {
        x: 0,
        y: 0
    };
    this.size = {
        width: 20,
        height: 20
    };
    this.velocity = {
        x: 0,
        y: 0
    };
    this.maxVelocity = {
        x: speed + 100,
        y: speed + 100
    };
    this.roundedVelocity = {
        x: 0,
        y: 0
    };

    this.reset = function () {

        this.position.x = canvas.width / 2 - ball.size.width / 2;
        this.position.y = canvas.height / 2 - ball.size.height / 2;

        this.velocity.x = -speed;

        if (coinflip()) {
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
            xpAnnouncers.push(new xpAnnouncer(2000));
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
            player.position.x + player.roundedVelocity.x < this.position.x + this.size.width &&
            player.position.x + player.roundedVelocity.x + player.size.width > this.position.x &&
            player.position.y + player.roundedVelocity.y < this.position.y + this.roundedVelocity.y + this.size.height &&
            player.position.y + player.roundedVelocity.y + (player.size.height / 2) > this.position.y + this.roundedVelocity.y
        ) {
            this.velocity.y = -this.velocity.y;
            player.position.y = this.position.y + this.size.height;
            player.roundedVelocity.y = 0;
            player.velocity.y = 0;
        }

        if (
            player.position.x + player.roundedVelocity.x < this.position.x + this.size.width &&
            player.position.x + player.roundedVelocity.x + player.size.width > this.position.x &&
            player.position.y + player.roundedVelocity.y + player.size.height > this.position.y + this.roundedVelocity.y &&
            player.position.y + player.roundedVelocity.y + (player.size.height / 2) < this.position.y + this.roundedVelocity.y + this.size.height
        ) {
            this.velocity.y = -this.velocity.y;
            player.position.y = this.position.y - player.size.height;
            player.roundedVelocity.y = 0;
            player.velocity.y = 0;
        }

        if (
            this.position.x + this.roundedVelocity.x < player.position.x + player.size.width &&
            this.position.x + this.roundedVelocity.x + (this.size.width / 2) > player.position.x &&
            this.position.y + this.roundedVelocity.y + this.size.height > player.position.y + player.roundedVelocity.y &&
            this.position.y + this.roundedVelocity.y < player.position.y + player.roundedVelocity.y + player.size.height
        ) {
            this.velocity.x = -this.velocity.x;
            this.roundedVelocity.x = -this.roundedVelocity.x;
            if (this.position.y + (this.size.height / 2) < player.position.y + (player.size.height * 0.4)) {
                this.velocity.y -= 100;
            }
            if (this.position.y + (this.size.height / 2) > player.position.y + player.size.height - (player.size.height * 0.4)) {
                this.velocity.y += 100;
            }
        }

        // collision with opponent paddle
        if (
            opponent.position.x + opponent.roundedVelocity.x < this.position.x + this.size.width &&
            opponent.position.x + opponent.roundedVelocity.x + opponent.size.width > this.position.x &&
            opponent.position.y + opponent.roundedVelocity.y < this.position.y + this.size.height &&
            opponent.position.y + opponent.roundedVelocity.y + (opponent.size.height / 2) > this.position.y
        ) {
            this.velocity.y = -this.velocity.y;
            this.position.y = opponent.position.y + opponent.roundedVelocity.y - this.size.height;
        }

        if (
            opponent.position.x + opponent.roundedVelocity.x < this.position.x + this.size.width &&
            opponent.position.x + opponent.roundedVelocity.x + opponent.size.width > this.position.x &&
            opponent.position.y + opponent.roundedVelocity.y + opponent.size.height > this.position.y &&
            opponent.position.y + opponent.roundedVelocity.y + (opponent.size.height / 2) < this.position.y + this.size.height
        ) {
            this.velocity.y = -this.velocity.y;
            this.position.y = opponent.position.y + opponent.roundedVelocity.y + opponent.size.height;
        }

        if (
            this.position.x + this.roundedVelocity.x + this.size.width > opponent.position.x &&
            this.position.x + this.roundedVelocity.x < opponent.position.x + (this.size.width / 2) &&
            this.position.y + this.roundedVelocity.y + this.size.height > opponent.position.y + opponent.roundedVelocity.y &&
            this.position.y + this.roundedVelocity.y < opponent.position.y + opponent.roundedVelocity.y + opponent.size.height
        ) {
            this.velocity.x = -this.velocity.x;
            this.roundedVelocity.x = -this.roundedVelocity.x;
            if (this.position.y - (this.size.height / 2) < opponent.position.y + (opponent.size.height / 3)) {
                this.velocity.y -= 100;
            }
            if (this.position.y - (this.size.height / 2) > opponent.position.y + opponent.size.height - (opponent.size.height / 3)) {
                this.velocity.y += 100;
            }
        }

        if (this.velocity.y > this.maxVelocity.y) {
            this.velocity.y = this.maxVelocity.y;
        }
        if (this.velocity.y < -this.maxVelocity.y) {
            this.velocity.y = -this.maxVelocity.y;
        }

        this.roundedVelocity.x = Math.trunc(this.velocity.x * secondsPassed);
        this.roundedVelocity.y = Math.trunc(this.velocity.y * secondsPassed);

        this.position.x += this.roundedVelocity.x;
        this.position.y += this.roundedVelocity.y;


    }

    // function to draw the ball
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