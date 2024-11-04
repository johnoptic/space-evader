const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const fullscreenButton = document.getElementById("fullScreen");


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
                y: canvas.height / 2 + (canvas.height / 2 - this.height / 2)
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

    drawGlow() {
        c.save();
        c.translate(this.position.x, this.position.y);
        c.rotate(this.rotation);
        
        // Draw the glowing effect if W is pressed
        if (keys.w.pressed) {
            c.beginPath();
            c.arc(-this.width / 2, this.height / 2 - 50, 10, 0, Math.PI * 2); 
            c.fillStyle = 'rgba(255, 165, 0, 0.5'; // Orange color with some transparency
            c.fill();
            c.closePath();
        }

        c.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        c.restore();
    }

    update() {
        if (this.image) {
            this.drawGlow();
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            // Implement friction to x and y velocity
            this.velocity.x *= 0.999; 
            this.velocity.y *= 0.999; 

            // Keep player in bounds and implement bouncing behavior
            if (this.position.x < 0) {
                this.position.x = 0;
                this.velocity.x = -this.velocity.x / 2; // Bounce back and lose half velocity
            } else if (this.position.x > canvas.width) {
                this.position.x = canvas.width;
                this.velocity.x = -this.velocity.x / 2; // Bounce back and lose half velocity
            }

            if (this.position.y < 0) {
                this.position.y = 0;
                this.velocity.y = -this.velocity.y / 2; // Bounce back and lose half velocity
            } else if (this.position.y > canvas.height) {
                this.position.y = canvas.height;
                this.velocity.y = -this.velocity.y / 2; // Bounce back and lose half velocity
            }
        }
    }
}

// Invader One Class
class InvaderOne {
    constructor({position}) {

        this.velocity = {
            x: 0,
            y: 0
        };

        const image = new Image();
        image.src = '../assets/img/invader1.png';
        image.onload = () => {
            this.image = image;
            this.width = 20;
            this.height = 20;
            this.position = {
                x: position.x,
                y: position.y
            };
        };
    }

    draw() {
        c.drawImage(this.image, this.position.x - this.width / 2, this.position.y );
    }

    update({velocity}) {
        if (this.image) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;

        }
    }
}

// Invader Two Class
class InvaderTwo {
    constructor({position}) {

        this.velocity = {
            x: 0,
            y: 0
        };

        const image = new Image();
        image.src = '../assets/img/invader2.png';
        image.onload = () => {
            this.image = image;
            this.width = 20;
            this.height = 20;
            this.position = {
                x: position.x,
                y: position.y
            };
        };
    }

    draw() {
        c.drawImage(this.image, this.position.x - this.width / 2, this.position.y );
    }

    update({velocity}) {
        if (this.image) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;

        }
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }

        this.velocity = {
            x: 4,
            y: 0
        }

        this.invaders = []


        const columns = Math.floor(Math.random() * 4 + 8)
        const rows = Math.floor(Math.random() * 3 + 1)

        this.width = columns * 80

        const InvaderClass = Math.random() > 0.5 ? InvaderOne : InvaderTwo;

        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new InvaderClass({
                    position: {
                        x: x * 80,
                        y: y * 80
                    }
                }));
            }
        }
    }
        

    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x +this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 80
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



//-------------------------
// Globals
//-------------------------

// Instantiate Player Object
const player = new Player();

const grids = []

const keys = {
    w: { pressed: false },
    s: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
};

const MAX_SPEED = 8;
const SPEED = 0.4;
const REVERSE_SPEED = 0.05;
const ROTATIONAL_SPEED = 0.05;
const PROJECTILE_SPEED = 10;

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
        case 'ArrowUp':
            keys.w.pressed = true;
            event.preventDefault();
            break;
        case 's':
        case 'ArrowDown':
            keys.s.pressed = true;
            event.preventDefault();
            break;
        case 'a':
        case 'ArrowLeft':
            keys.a.pressed = true;
            event.preventDefault();
            break;
        case 'd':
        case 'ArrowRight':
            keys.d.pressed = true;
            event.preventDefault();
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
        case 'ArrowUp':
            keys.w.pressed = false;
            break;
        case 's':
        case 'ArrowDown':
            keys.s.pressed = false;
            break;
        case 'a':
        case 'ArrowLeft':
            keys.a.pressed = false;
            break;
        case 'd':
        case 'ArrowRight':
            keys.d.pressed = false;
            break;
    }
});

//-------------------------
// Functions
//-------------------------

let frames = 0
let randomInterval = Math.floor((Math.random() * 400) + 1200);

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

    grids.forEach(grid => {
        grid.update();
        grid.invaders.forEach((invader) => {
            invader.update({velocity: grid.velocity})
        })
    })

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

    console.log(randomInterval)
    // Spawning Invaders
    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor((Math.random() * 400) + 1200)
        frames = 0
    }

    frames++
}

// Call Animation Loop
animate();


// Fullscreen functionality
fullscreenButton.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        // Enter fullscreen mode
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) { // Safari
            canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) { // IE11
            canvas.msRequestFullscreen();
        }
    } else {
        // Exit fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE11
            document.msExitFullscreen();
        }
    }
});

// Resize canvas on fullscreen change
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Listen for resize events (for when entering/exiting fullscreen)
window.addEventListener("resize", resizeCanvas);
resizeCanvas();