import {CONTEXT} from "./constants.js";

export class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    create() {
        CONTEXT.beginPath();
        CONTEXT.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        CONTEXT.fillStyle = this.color;
        CONTEXT.fill();
    }

    update() {
        this.create();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}