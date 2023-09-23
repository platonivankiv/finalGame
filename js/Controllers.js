export class Controllers {
    constructor(keyList = ['KeyW', 'KeyA', 'KeyS', 'KeyD']) {
        this.keyList = keyList;
        this.keys = {};

        addEventListener('keydown', event => this.changeState(event))
        addEventListener('keyup', event => this.changeState(event))
    }

    changeState(event) {
        if (!this.keyList.includes(event.code)) {
            return;
        }
        this.keys[event.code] = event.type === 'keydown';
    }
}