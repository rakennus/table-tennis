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

    levelStats.xp += 100;

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

let levelStats = new function () {
    this.rotation = 0;
    this.timer = 0;
    this.xp = 0;
    this.smoothXP = 0;

    this.barValue = 0;
    this.lvl = 0;
    this.xpLeft = 0;

    this.update = function () {
        this.timer += secondsPassed;

        this.rotation += 1 * secondsPassed;

        if (this.smoothXP < this.xp) {
            this.smoothXP += Math.trunc(800 * secondsPassed);
        }

        if (this.smoothXP > this.xp) {
            this.smoothXP = this.xp;
        }

        if (this.smoothXP >= this.xpLeft) {
            this.lvl++;
            localStorage.setItem("table-tennis-lvl", levelStats.lvl)
            this.xp = 0;
            this.xpLeft = 700 + this.lvl * 100;

            player.points = 0;
            opponent.points = 0;
        }
    }

    this.draw = function () {
        ctx.save();
        ctx.translate(canvas.width / 2, 60);

        ctx.rotate(Math.trunc(Math.sin(this.timer * 2) * 50) / 200);

        ctx.font = '30px Arial';
        ctx.textAlign = "center";
        ctx.fillText(this.smoothXP + ' XP', 0, 0);

        ctx.restore();

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.rect(
            canvas.width / 4 + 20,
            25,
            canvas.width / 2 - 40,
            25
        );
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "white";
        ctx.fillRect(
            canvas.width / 4 + 20,
            25,
            (canvas.width / 2 - 40) / this.xpLeft * this.smoothXP,
            25
        );

        // draw xp and level stats
        ctx.font = '30px Arial';
        ctx.textBaseline = 'base';
        ctx.textAlign = "right";
        ctx.fillText("lvl: " + this.lvl, canvas.width - canvas.width / 4 - 20, 60);
        ctx.textAlign = "left";
        ctx.fillText("xp left: " + (this.xpLeft - this.smoothXP), canvas.width / 4 + 20, 60);

        // draw points
        ctx.font = '80px Arial';
        ctx.textBaseline = 'top';
        ctx.textAlign = "right";
        ctx.fillText(player.points, canvas.width / 4, 20);
        ctx.textAlign = "left";
        ctx.fillText(opponent.points, canvas.width - canvas.width / 4, 20);
    }
}