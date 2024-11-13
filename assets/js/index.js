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
        image.src = './assets/img/playerOne.png';
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
        c.save()
        c.translate(
            player.position.x + player.width / 2,
            player.position.y + player.height /2
        )
        c.rotate(this.rotation)
        c.translate(
            -player.position.x - player.width / 2,
            -player.position.y - player.height /2
        )
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        c.restore()
    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x;
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
                y: 5
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
                y: 5
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

// Invader Projectile Class
class InvaderProjectile {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 4
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


//-------------------------
// Globals
//-------------------------

// Instantiate Player Object
const player = new Player();

const grids = []

const projectiles = [];

const invaderProjectiles = []


const keys = {
    w: { pressed: false },
    s: { pressed: false },
    a: { pressed: false },
    d: { pressed: false },
};

const MAX_SPEED = 8;
const SPEED = 0.2;
const REVERSE_SPEED = 0.05;

const PROJECTILE_SPEED = 12;

// let cannonToggle = true;



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
                /*
                const cannonOffset = 20; // Distance from the center to the cannons
                const forwardOffset = 50; // How far forward the cannon positions should be from the ship's center
                
                // Calculate positions for left and right cannons
                
                const leftCannonX = player.position.x + Math.cos(player.rotation) * forwardOffset - Math.sin(player.rotation) * cannonOffset;
                const leftCannonY = player.position.y + Math.sin(player.rotation) * forwardOffset + Math.cos(player.rotation) * cannonOffset;
                
                const rightCannonX = player.position.x + Math.cos(player.rotation) * forwardOffset + Math.sin(player.rotation) * cannonOffset;
                const rightCannonY = player.position.y + Math.sin(player.rotation) * forwardOffset - Math.cos(player.rotation) * cannonOffset;
                

                
                const position = cannonToggle ? { x: leftCannonX, y: leftCannonY } : { x: rightCannonX, y: rightCannonY };

                */

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
    player.update()

    // Player Movement
    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -7
        player.rotation = -.15
    } else if (keys.d.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 7
        player.rotation = .15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }

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
    if (frames % 100 === 0 && grid.invaders.length > 0) {
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