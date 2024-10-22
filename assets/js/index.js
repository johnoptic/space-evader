const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor() {

        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image()
        image.src = '../assets/img/player.png'
        image.onload = () => {
            this.image = image;
            this.width = 100;
            this.height = 100;
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 40
            }
        }
    }

    draw() {
        //c.fillStyle = 'red'
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)     
    }

    update() {
        if (this.image) {
        this.draw()
        this.position.x += this.velocity.x
        }
    }
}

const player = new Player()
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    if (keys.a.pressed) {
        player.velocity.x = -3
    } else if (keys.d.pressed) {
        player.velocity.x = 3
    } else {
        player.velocity.x = 0
    }
}

animate();

addEventListener('keydown', ({ key }) => {
    console.log(key)
    switch (key) {
        case 'a':
            console.log('left')
            keys.a.pressed = true
            break;
        case 'd':
            console.log('right')
            keys.d.pressed = true
            break;
        case ' ':
            console.log('space')
            break;
    }
})

addEventListener('keyup', ({ key }) => {
    console.log(key)
    switch (key) {
        case 'a':
            keys.a.pressed = false
            break;
        case 'd':
            keys.d.pressed = false
            break;
        case ' ':
            console.log('space')
            break;
    }
})