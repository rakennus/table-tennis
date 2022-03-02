let touchPadle = {
    up: false,
    down: false,
    margin: 50,
    width: 300,

    update: function () {
        this.up = false;
        this.down = false;

        for (let i = 0; i < controls.ongoingTouches.length; i++) {
            if (
                (controls.ongoingTouches[0].pageX - rect.left) * scale < canvas.width / 2 &&
                (controls.ongoingTouches[0].pageX - rect.left) * scale > 0 &&
                (controls.ongoingTouches[0].pageY - rect.top) * scale < canvas.height &&
                (controls.ongoingTouches[0].pageY - rect.top) * scale > 0
            ) {
                this.down = true;
            }
            if (
                (controls.ongoingTouches[0].pageX - rect.left) * scale < canvas.width &&
                (controls.ongoingTouches[0].pageX - rect.left) * scale > canvas.width / 2 &&
                (controls.ongoingTouches[0].pageY - rect.top) * scale < canvas.height &&
                (controls.ongoingTouches[0].pageY - rect.top) * scale > 0
            ) {
                this.up = true;
            }
        }
    },
    draw: function () {
        ctx.save();
        ctx.strokeStyle = 'white';
        ctx.globalAlpha = 0.1;

        if (this.down) {
            ctx.moveTo(this.margin, this.margin);
            ctx.lineTo(this.width - this.margin, this.margin);

            ctx.moveTo(this.margin, this.margin);
            ctx.lineTo(this.margin, canvas.height - this.margin);

            ctx.moveTo(this.margin, canvas.height - this.margin);
            ctx.lineTo(this.width - this.margin, canvas.height - this.margin);

            ctx.stroke();

            let gradient1 = ctx.createLinearGradient(this.margin, 0, this.width - this.margin, 0);

            gradient1.addColorStop(0, 'white');
            gradient1.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient1;
            ctx.fillRect(this.margin, this.margin, this.width - this.margin * 2, canvas.height - this.margin * 2);
        }

        if (this.up) {
            ctx.moveTo(canvas.width - this.width + this.margin, this.margin);
            ctx.lineTo(canvas.width - this.margin, this.margin);

            ctx.moveTo(canvas.width - this.margin, this.margin);
            ctx.lineTo(canvas.width - this.margin, canvas.height - this.margin);

            ctx.moveTo(canvas.width - this.width + this.margin, canvas.height - this.margin);
            ctx.lineTo(canvas.width - this.margin, canvas.height - this.margin);

            ctx.stroke();

            let gradient2 = ctx.createLinearGradient(canvas.width - this.margin, 0, canvas.width - this.width + this.margin, 0);

            gradient2.addColorStop(0, 'white');
            gradient2.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient2;
            ctx.fillRect(canvas.width - this.width - this.margin, this.margin, this.width, canvas.height - this.margin * 2);
        }

        ctx.restore();
    }
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