import {CONTEXT} from "./constants.js";

export class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    create() {
        CONTEXT.beginPath();
        CONTEXT.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        CONTEXT.fillStyle = this.color;
        CONTEXT.fill();
    }
}