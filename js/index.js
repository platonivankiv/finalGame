'use strict'

import {
    CANVAS,
    CONTEXT,
    SCORE_EL,
    MODAL_EL,
    MODAL_SCORE_EL,
    RESTART_BTN_EL,
    START_MODAL_EL,
    START_BTN_EL,
} from './constants.js'

import { Player } from './Player.js'
import { Shot } from './Shot.js'
import { Enemy } from './Enemy.js'
import { Particle } from './Particle.js'

CANVAS.width = innerWidth;
CANVAS.height = innerHeight;

const x = CANVAS.width / 2;
const y = CANVAS.height / 2;

let player = new Player(x, y, 10, 'white');
let shots = [];
let enemies = [];
let particles = [];
let animationId;
let intervalId;
let score = 0;

function init() {
    player = new Player(x, y, 10, 'white');
    shots = [];
    enemies = [];
    particles = [];
    score = 0;
    SCORE_EL.innerHTML = score;
}

function createEnemies() {
    intervalId = setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4;

        let x;
        let y;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : CANVAS.width + radius;
            y = Math.random() * CANVAS.height;
        } else {
            x = Math.random() * CANVAS.width;
            y = Math.random() < 0.5 ? 0 - radius : CANVAS.height + radius;
        }

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

        const angle = Math.atan2(CANVAS.height / 2 - y,
            CANVAS.width / 2 - x)

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }


        enemies.push(new Enemy(x, y, radius, color, velocity))
    }, 1000)
}

function animate() {
    animationId = requestAnimationFrame(animate);

    // эффект затухания для объектов
    CONTEXT.fillStyle = 'rgba(0, 0, 0, 0.1)';
    CONTEXT.fillRect(0, 0, CANVAS.width, CANVAS.height);

    player.create();

    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
    });

    shots.forEach((shot, index) => {
        shot.update();

        // удаление выстрелов при выходе за края экрана
        if (shot.x + shot.radius < 0 ||
            shot.x - shot.radius > CANVAS.width ||
            shot.y + shot.radius < 0 ||
            shot.y - shot.radius > CANVAS.height) {
            setTimeout(() => {
                shot.splice(index, 1);
            }, 0)
        }
    })

    enemies.forEach((enemy, index) => {
        enemy.update();

        const distance = Math.hypot(player.x - enemy.x,
            player.y - enemy.y);

        // конец игры
        if (distance - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);
            clearInterval(intervalId);

            MODAL_EL.style.display = 'block';
            gsap.fromTo('#modalEl', {scale: 0.8, opacity: 0}, {
                scale: 1, opacity: 1,
                ease: 'expo'
            });
            MODAL_SCORE_EL.innerHTML = score;
        }

        shots.forEach((shot, shotIndex) => {
            const distance = Math.hypot(shot.x - enemy.x,
                shot.y - enemy.y);

            // соприкосновение снаряда с врагом
            if (distance - enemy.radius - shot.radius < 1) {

                // создание взрывов
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(
                        new Particle(
                            shot.x,
                            shot.y,
                            Math.random() * 2,
                            enemy.color,
                            {
                                x: (Math.random() - 0.5) * (Math.random() * 6),
                                y: (Math.random() - 0.5) * (Math.random() * 6),
                            }))
                }
                if (enemy.radius - 10 > 5) {

                    // увеличение счета при попадании
                    score += 100;
                    SCORE_EL.innerHTML = score;

                    gsap.to(enemy, {
                        radius: enemy.radius - 10,
                    })
                    setTimeout(() => {
                        shots.splice(shotIndex, 1);
                    }, 0);

                } else {

                    // увеличение счета при полном уничтожении врага
                    score += 250;
                    SCORE_EL.innerHTML = score;

                    setTimeout(() => {
                        enemies.splice(index, 1);
                        shots.splice(shotIndex, 1);
                    }, 0);
                }

            }
        })
    })
}

addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - CANVAS.height / 2,
        event.clientX - CANVAS.width / 2,
    )
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5,
    }
    shots.push(new Shot(CANVAS.width / 2, CANVAS.height / 2,
        5, 'white', velocity)
    )
});


// restart
RESTART_BTN_EL.addEventListener('click', () => {
    init();
    animate();
    createEnemies();
    gsap.to('#restartModalEl', {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.out',
        onComplete: () => {
            MODAL_EL.style.display = 'none';
        }
    })
})

START_BTN_EL.addEventListener('click', () => {
    init();
    animate();
    createEnemies();
    gsap.to('#startModalEl', {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.out',
        onComplete: () => {
            START_MODAL_EL.style.display = 'none';
        }
    })
})


