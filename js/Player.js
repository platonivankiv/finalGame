import {CANVAS, CONTEXT, RADIUS, COLOR} from "./constants.js";
import {Controllers} from "./Controllers.js";

export class Player {
    constructor() {
        this.position = {
            x: CANVAS.width / 2,
            y: CANVAS.height / 2
        }
        this.velocity = {
            x: 5,
            y: 5,
        }
        this.radius = RADIUS;
        this.color = COLOR;
        this.keyboard = new Controllers(['KeyW', 'KeyA', 'KeyS', 'KeyD']);
        this.keys = this.keyboard.keys;
    }

    create() {
        CONTEXT.beginPath();
        CONTEXT.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        CONTEXT.fillStyle = this.color;
        CONTEXT.fill();
    }

    update() {
        if (this.keys.KeyA) {
            this.position.x -= this.velocity.x;
            if (this.position.x <= 20) {
                this.position.x = 20;
            }
        }
        if (this.keys.KeyD) {
            this.position.x += this.velocity.x;
            if (this.position.x >= window.innerWidth - 20) {
                this.position.x = window.innerWidth - 20;
            }
        }
        if (this.keys.KeyW) {
            this.position.y -= this.velocity.y;
            if (this.position.y <= 20) {
                this.position.y = 20;
            }
        }
        if (this.keys.KeyS) {
            this.position.y += this.velocity.y;
            if (this.position.y >= CANVAS.height - 20) {
                this.position.y = CANVAS.height - 20;
            }
        }
    }
}