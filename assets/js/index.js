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

        this.rotation = 0

        const image = new Image();
        image.src = './assets/img/player.png';
        image.onload = () => {
            const scale = 0.25;
            this.image = image;
            this.width = image.width * scale;
            this.height = image.height * scale;

            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height / 2 - this.height / 2
            };
        };
    }

    draw() {
        c.save();
    
        // Position the glow at the engine (bottom of the spaceship)
        if (keys.w.pressed || keys.s.pressed) {
            c.save();
            const engineX = this.position.x + this.width / 2;
            const engineY = this.position.y + this.height;
    
            // Set the glow color based on which key is pressed
            c.shadowColor = keys.w.pressed ? 'orange' : 'blue'; // Orange for 'w' key, blue for 's' key
            c.shadowBlur = 15;
    
            // Draw a glowing circle at the engine position
            c.beginPath();
            c.arc(engineX, engineY, 6, 0, Math.PI * 2); // Adjust size and position as needed
            c.fillStyle = keys.w.pressed ? 'orange' : 'blue';
            c.fill();
            c.closePath();
            c.restore();
        }
    
        // Draw the spaceship image
        c.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        );
        c.rotate(this.rotation);
        c.translate(
            -this.position.x - this.width / 2,
            -this.position.y - this.height / 2
        );
    
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    
        c.restore();
    }
    
    

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
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
            this.width = 70;
            this.height = 70;
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

    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x +this.width/2,
                y: this.position.y +this.height
            },
            velocity: {
                x: 0,
                y: 12
            }
        }))
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
            this.width = 70;
            this.height = 70;
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

    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x +this.width/2,
                y: this.position.y +this.height
            },
            velocity: {
                x: 0,
                y: 10
            }
        }))
    }
}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: -240

        };

        this.velocity = {
            x: 4,
            y: 0
        };

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
                        y: this.position.y + y * 80
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
        this.radius = 6
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

// Invader Projectile Class
class InvaderProjectile {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 5
    }

    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        c.closePath()
        c.fillStyle = 'red'
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

// Particle Class
class Particle {
    constructor({position, velocity, radius, color, fades}) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        c.closePath()
        c.fillStyle = this.color;
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.fades) {
            this.opacity -= 0.01
        }

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

const projectiles = [];

const invaderProjectiles = []

const particles = []

const keys = {
    w: { pressed: false },
    s: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
};

const MAX_SPEED = 8;
const SPEED = 0.2;
const REVERSE_SPEED = 0.05;

const PROJECTILE_SPEED = 16;

let cannonToggle = true;



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
                
                const cannonOffset = 20;
                
                // Calculate positions for left and right cannons
                const centerX = player.position.x + player.width / 2;
                const centerY = player.position.y;
                
                const leftCannonX = centerX - cannonOffset;
                const leftCannonY = centerY;
                
                const rightCannonX = centerX + cannonOffset;
                const rightCannonY = centerY;
                
                // Use the toggle to switch between the two cannon positions
                const position = cannonToggle
                    ? { x: leftCannonX, y: leftCannonY }
                    : { x: rightCannonX, y: rightCannonY };
                
                projectiles.push(new Projectile({
                    position: position,
                    velocity: {
                        x: 0,
                        y: -PROJECTILE_SPEED,
                    }
                })
            );
                
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

// Background Stars
for (let i = 0; i < 150; i++) {
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 2
        },
        radius: Math.random() * 2,
        color: 'white'
    }))
}


function createParticles({ object, color, fades }) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 3,
                y: (Math.random() - 0.5) * 3
            },
            radius: Math.random() * 5,
            color: color || 'yellow',
            fades
        }))
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, i) => {

        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
        } else {
            particle.update()
        }

    })


    // Player acceleration properties
    const acceleration = 0.1;
    const friction = 0.98; // Friction to gradually reduce speed

    // Player Movement along x-axis
    if (keys.a.pressed) {
        player.velocity.x -= acceleration;
        player.rotation = -0.15;
    } else if (keys.d.pressed) {
        player.velocity.x += acceleration;
        player.rotation = 0.15;
    } else {
        player.rotation = 0;
    }

    // Player Movement along y-axis
    if (keys.w.pressed) {
        player.velocity.y -= acceleration;
        player.rotation = 0;
    } else if (keys.s.pressed) {
        player.velocity.y += acceleration;
        player.rotation = 0;
    }

    // Apply friction to gradually slow down the player
    player.velocity.x *= friction;
    player.velocity.y *= friction;

    // Update player position
    player.position.x += player.velocity.x;
    player.position.y += player.velocity.y;

    // Keep player within canvas bounds
    if (player.position.x < 0) player.position.x = 0;
    if (player.position.x + player.width > canvas.width) player.position.x = canvas.width - player.width;
    if (player.position.y < 0) player.position.y = 0;
    if (player.position.y + player.height > canvas.height) player.position.y = canvas.height - player.height;


    invaderProjectiles.forEach((invaderProjectile, index) => {
        // Check if the projectile is off-screen
        if (invaderProjectile.isOffScreen()) {
            invaderProjectiles.splice(index, 1);
        } else {
            invaderProjectile.update();
    
            // Collision detection between player and invaderProjectile
            const playerLeft = player.position.x;
            const playerRight = player.position.x + player.width;
            const playerTop = player.position.y;
            const playerBottom = player.position.y + player.height;
    
            const projectileLeft = invaderProjectile.position.x - invaderProjectile.radius;
            const projectileRight = invaderProjectile.position.x + invaderProjectile.radius;
            const projectileTop = invaderProjectile.position.y - invaderProjectile.radius;
            const projectileBottom = invaderProjectile.position.y + invaderProjectile.radius;
    
            if (
                projectileRight > playerLeft &&
                projectileLeft < playerRight &&
                projectileBottom > playerTop &&
                projectileTop < playerBottom
            ) {
                console.log("Player has been hit");
                createParticles({
                    object: player,
                    fades: true
                })
                invaderProjectiles.splice(index, 1); // Remove projectile after collision
            }
        }
    });
    

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i]
        projectile.update()

        // Check if the projectile is off-screen
        if (projectile.isOffScreen()) {
            projectiles.splice(i, 1);
        }
    }

    grids.forEach((grid, gridIndex) => {
        grid.update();

    // Check if the grid has moved off the screen
    if (grid.position.y > canvas.height + 320) {
        grids.splice(gridIndex, 1); // Remove the grid from the array
    }

    // Spawn Projectiles
    if (frames % 60 === 0 && grid.invaders.length > 0) {
        grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
    }

        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity });
    
            projectiles.forEach((projectile, j) => {
                // Check if the projectile is within the invader's bounds
                if (
                    projectile.position.x >= invader.position.x &&
                    projectile.position.x <= invader.position.x + invader.width &&
                    projectile.position.y >= invader.position.y &&
                    projectile.position.y <= invader.position.y + invader.height
                ) {

                    createParticles({
                        object: invader,
                        fades: true
                    })

                    // Remove invader and projectile on collision
                    setTimeout(() => {
                        grid.invaders.splice(i, 1); // Remove invader
                        projectiles.splice(j, 1);   // Remove projectile

                        if (grid.invaders.length > 0) {
                            const firstInvader = grid.invaders[0]
                            const lastInvader = grid.invaders[grid.invaders.length -1]

                            grid.width = lastInvader.position.x - firstInvader.position.x
                            
                        } else {
                            grid.splice(gridIndex, 1)
                        }
                    }, 0);
                }
            });
        });
    });
    

    // Spawning Invaders
    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor((Math.random() * 400) + 1200)
        frames = 0
    }

    player.update()

    frames++
}

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

//
// Debugging
//

console.log(fullscreenButton);

// Call Animation Loop
animate();