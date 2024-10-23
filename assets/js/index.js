const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        };

        const image = new Image();
        image.src = '../assets/img/player.png';
        image.onload = () => {
            this.image = image;
            this.width = 100;
            this.height = 100;
            this.rotation = 0;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height / 2 - this.height / 2
            };
        };
    }

    draw() {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        c.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        c.restore();
    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            // Implement friction to x and y velocity
            this.velocity.x *= 0.999; 
            this.velocity.y *= 0.999; 

            // Keep player in bounds
            if (this.position.x < 0) this.position.x = canvas.width;
            else if (this.position.x > canvas.width) this.position.x = 0;

            if (this.position.y < 0) this.position.y = canvas.height;
            else if (this.position.y > canvas.height) this.position.y = 0;
        }
    }
}

const player = new Player();
const keys = {
    w: { pressed: false },
    s: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
};

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    // Acceleration
    if (keys.w.pressed) {
        player.velocity.x += Math.cos(player.rotation) * 0.15; 
        player.velocity.y += Math.sin(player.rotation) * 0.15; 
    }
    // Small reverse thrust
    if (keys.s.pressed) {
        player.velocity.x -= Math.cos(player.rotation) * 0.05; 
        player.velocity.y -= Math.sin(player.rotation) * 0.05; 
    }
    // Rotate
    if (keys.d.pressed) player.rotation += 0.05;
    if (keys.a.pressed) player.rotation -= 0.05;
}

animate();

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true;
            break;
        case 's':
            keys.s.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 'd':
            keys.d.pressed = true;
            break;
    }
});

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});
