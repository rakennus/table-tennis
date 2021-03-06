let touchPadle = new function () {
    this.up = false;
    this.down = false;
    this.margin = 50;
    this.width = 300;

    this.update = function () {
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
    }
    this.draw = function () {
        ctx.save();
        ctx.strokeStyle = 'white';

        if (this.down) {
            ctx.beginPath();

            ctx.moveTo(this.margin, this.margin);
            ctx.lineTo(this.width - this.margin, this.margin);

            ctx.moveTo(this.margin, this.margin);
            ctx.lineTo(this.margin, canvas.height - this.margin);

            ctx.moveTo(this.margin, canvas.height - this.margin);
            ctx.lineTo(this.width - this.margin, canvas.height - this.margin);

            ctx.stroke();
            ctx.closePath();
        }

        if (this.up) {
            ctx.beginPath();

            ctx.moveTo(canvas.width - this.width + this.margin, this.margin);
            ctx.lineTo(canvas.width - this.margin, this.margin);

            ctx.moveTo(canvas.width - this.margin, this.margin);
            ctx.lineTo(canvas.width - this.margin, canvas.height - this.margin);

            ctx.moveTo(canvas.width - this.width + this.margin, canvas.height - this.margin);
            ctx.lineTo(canvas.width - this.margin, canvas.height - this.margin);

            ctx.stroke();
            ctx.closePath();
        }

        ctx.restore();
    }
}

let touchControlAnnouncer = new function () {
    this.visible = true;

    this.update = function () {
        if (controls.timeNotTouched < 5) {
            this.visible = false;
        } else {
            this.visible = true;
        }
    }
    this.draw = function () {
        if (this.visible) {
            ctx.font = '30px Arial';
            ctx.textAlign = "center";

            ctx.textBaseline = 'bottom';
            ctx.fillText(
                'Use WASD or Arrow keys to move the Player,',
                canvas.width / 2,
                canvas.height / 2
            );

            ctx.textBaseline = 'top';
            ctx.fillText(
                'or tap on the right or on the left to move up and down.',
                canvas.width / 2,
                canvas.height / 2
            );
        }
    }
}