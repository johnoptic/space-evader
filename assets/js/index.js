const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

//-------------------------
// Classes
//-------------------------

// Player Class
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

// Projectile Class
class Projectile {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 5
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        c.closePath()
        c.fillStyle = 'white'
        c.fill()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
    isOffScreen() {
        return (
            this.position.x < 0 ||
            this.position.x > canvas.width ||
            this.position.y < 0 ||
            this.position.y > canvas.height
        );
    }
}

// Instantiate Player Object
const player = new Player();

//-------------------------
// Globals
//-------------------------

const keys = {
    w: { pressed: false },
    s: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
};

const MAX_SPEED = 20;
const SPEED = 0.15;
const REVERSE_SPEED = 0.05;
const ROTATIONAL_SPEED = 0.05;
const PROJECTILE_SPEED = 12;

let cannonToggle = true;

const projectiles = [];

//-------------------------
// Event Listeners
//-------------------------

addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
    }

    switch (event.key) {
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
        case ' ':
            if (player.image) {
                
                const cannonOffset = 20; // Distance from the center to the cannons
                const forwardOffset = 50; // How far forward the cannon positions should be from the ship's center
                
                // Calculate positions for left and right cannons
                const leftCannonX = player.position.x + Math.cos(player.rotation) * forwardOffset - Math.sin(player.rotation) * cannonOffset;
                const leftCannonY = player.position.y + Math.sin(player.rotation) * forwardOffset + Math.cos(player.rotation) * cannonOffset;
                
                const rightCannonX = player.position.x + Math.cos(player.rotation) * forwardOffset + Math.sin(player.rotation) * cannonOffset;
                const rightCannonY = player.position.y + Math.sin(player.rotation) * forwardOffset - Math.cos(player.rotation) * cannonOffset;
                

                
                const position = cannonToggle ? { x: leftCannonX, y: leftCannonY } : { x: rightCannonX, y: rightCannonY };

                projectiles.push(new Projectile({
                    position: position,
                    velocity: {
                        x: Math.cos(player.rotation) * PROJECTILE_SPEED,
                        y: Math.sin(player.rotation) * PROJECTILE_SPEED,
                    },
                }));

                cannonToggle = !cannonToggle; // Toggle between cannons
            }
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

//-------------------------
// Functions
//-------------------------

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i]
        projectile.update()

        // Check if the projectile is off-screen
        if (projectile.isOffScreen()) {
            projectiles.splice(i, 1);
        }
    }
    console.log(projectiles.length)
    // Acceleration
    if (keys.w.pressed) {
        player.velocity.x += Math.cos(player.rotation) * SPEED; 
        player.velocity.y += Math.sin(player.rotation) * SPEED; 
    }
    // Small reverse thrust
    if (keys.s.pressed) {
        player.velocity.x -= Math.cos(player.rotation) * REVERSE_SPEED; 
        player.velocity.y -= Math.sin(player.rotation) * REVERSE_SPEED; 
    }
    // Clamp the player's velocity
    const speed = Math.sqrt(player.velocity.x ** 2 + player.velocity.y ** 2);
    if (speed > MAX_SPEED) {
        player.velocity.x = (player.velocity.x / speed) * MAX_SPEED;
        player.velocity.y = (player.velocity.y / speed) * MAX_SPEED;
    }
    // Rotate
    if (keys.d.pressed) player.rotation += ROTATIONAL_SPEED;
    if (keys.a.pressed) player.rotation -= ROTATIONAL_SPEED;
}

// Call Animation Loop
animate();


