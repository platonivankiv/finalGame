const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const scoreEl = document.querySelector('#scoreEl');
const modalEl = document.querySelector('#modalEl');

const modalScoreEl = document.querySelector('#modalScoreEl');
const restartBtnEl = document.querySelector('#restartBtnEl');

const startModalEl = document.querySelector('#startModalEl');
const startBtnEl = document.querySelector('#startBtnEl');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

const friction = 0.99;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }


    draw() {
        context.save();
        context.globalAlpha = this.alpha;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 10, 'white');
let projectiles = [];
let enemies = [];
let particles = [];
let animationId;
let intervalId;
let score = 0;

function init() {
    player = new Player(x, y, 10, 'white');
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    scoreEl.innerHTML = score;
}

function spawnEnemies() {
    intervalId = setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4;

        let x;
        let y;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

        const angle = Math.atan2(canvas.height / 2 - y,
            canvas.width / 2 - x)

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
    context.fillStyle = 'rgba(0, 0, 0, 0.1)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    player.draw();

    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        } else {
            particle.update();
        }
    });

    projectiles.forEach((projectile, index) => {
        projectile.update();

        // удаление снарядов при выходе за края экрана
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(index, 1);
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

            modalEl.style.display = 'block';
            gsap.fromTo('#modalEl', {scale: 0.8, opacity: 0}, {
                scale: 1, opacity: 1,
                ease: 'expo'
            });
            modalScoreEl.innerHTML = score;
        }

        projectiles.forEach((projectile, projectileIndex) => {
            const distance = Math.hypot(projectile.x - enemy.x,
                projectile.y - enemy.y);

            // соприкосновение снаряда с врагом
            if (distance - enemy.radius - projectile.radius < 1) {

                // создание взрывов
                for (let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(
                        new Particle(
                            projectile.x,
                            projectile.y,
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
                    scoreEl.innerHTML = score;

                    gsap.to(enemy, {
                        radius: enemy.radius - 10,
                    })
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);

                } else {

                    // увеличение счета при полном уничтожении врага
                    score += 250;
                    scoreEl.innerHTML = score;

                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }

            }
        })
    })
}

addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2,
    )
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5,
    }
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2,
        5, 'white', velocity)
    )
});


// restart
restartBtnEl.addEventListener('click', () => {
    init();
    animate();
    spawnEnemies();
    gsap.to('#restartModalEl', {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.out',
        onComplete: () => {
            modalEl.style.display = 'none';
        }
    })
})

startBtnEl.addEventListener('click', () => {
    init();
    animate();
    spawnEnemies();
    // startModalEl.style.display = 'none';
    gsap.to('#startModalEl', {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        ease: 'expo.out',
        onComplete: () => {
            startModalEl.style.display = 'none';
        }
    })
})


