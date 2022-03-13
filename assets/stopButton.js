let stopButton = new function() {
    this.width = 40;
    this.height = 40;
    this.margin = 40;
    this.x = 0;
    this.y = 0;

    this.update = function () {
        this.x = canvas.width - this.width - this.margin / 2;
        this.y = this.margin / 2;

        for (let i = 0; i < controls.ongoingTouches.length; i++) {
            if (
                //(controls.ongoingTouches[0].pageX - rect.left) * scale <  &&
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
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}