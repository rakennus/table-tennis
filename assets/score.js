let xpAnnouncer = function (amount) {
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

let xpCounter = new function() {
    this.rotation = 0;
    this.timer = 0;
    this.score = 0;

    this.update = function () {
        this.timer += secondsPassed;

        this.rotation += 1 * secondsPassed;

        if (this.score < player.score) {
            this.score += Math.trunc(800 * secondsPassed);
        }

        if (this.score > player.score) {
            this.score = player.score;
        }
    }
    this.draw = function () {
        ctx.save();
        ctx.translate(canvas.width / 2, 20);

        ctx.rotate(Math.trunc(Math.sin(xpCounter.timer * 2) * 100) / 200);

        ctx.font = '30px Arial';
        ctx.textAlign = "center";
        ctx.fillText(this.score + ' XP', 0, 0);

        ctx.restore();
    }
}