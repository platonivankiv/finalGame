import {CONTEXT} from "./constants.js";

export class Shot {
    constructor(velocity, playerX, playerY) {
        this.position = {
            x: playerX,
            y: playerY,
        }
        this.velocity = velocity;
        this.radius = 5;
        this.color = 'white';
    }

    create() {
        CONTEXT.beginPath();
        CONTEXT.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        CONTEXT.fillStyle = this.color;
        CONTEXT.fill();
    }

    update() {
        this.create();
        this.position.x = this.position.x + this.velocity.x;
        this.position.y = this.position.y + this.velocity.y;
    }
}
