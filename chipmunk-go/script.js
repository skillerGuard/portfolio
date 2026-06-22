const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false; // Disable anti-aliasing for pixel perfect art

// UI Elements
const gameContainer = document.getElementById('game-container');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const scoreDisplay = document.getElementById('score-display');
const finalScoreDisplay = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

// Game State
let gameState = 'START'; // START, PLAYING, GAMEOVER
let score = 0;
let frames = 0;
let gameSpeed = 4;
let animationId;
let nextLogGap = 50;

const DEBUG_HITBOXES = false;

function drawDebugHitbox(obj, color = 'red') {
    if (!DEBUG_HITBOXES) return;
    let hx = obj.x + (obj.hitbox ? obj.hitbox.offsetX : 0);
    let hy = obj.y + (obj.hitbox ? obj.hitbox.offsetY : 0);
    let hw = obj.hitbox ? obj.hitbox.width : obj.width;
    let hh = obj.hitbox ? obj.hitbox.height : obj.height;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(hx, hy, hw, hh);
}

// Input State
const keys = {
    jump: false
};

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        keys.jump = true;
        if (gameState === 'PLAYING' && player.grounded) {
            player.jump();
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        keys.jump = false;
        // Variable jump height: cut upward momentum if key released early
        if (gameState === 'PLAYING' && player.dy < 0) {
            player.dy *= 0.5;
        }
    }
});

// Mobile Touch Controls
window.addEventListener('touchstart', (e) => {
    if (e.target.tagName === 'BUTTON') return; // Don't trigger jump when tapping UI buttons
    
    // Prevent default scrolling behavior on mobile
    if (gameState === 'PLAYING') {
        e.preventDefault();
    }
    
    keys.jump = true;
    if (gameState === 'PLAYING' && player.grounded) {
        player.jump();
    }
}, { passive: false });

window.addEventListener('touchend', (e) => {
    keys.jump = false;
    if (gameState === 'PLAYING' && player.dy < 0) {
        player.dy *= 0.5;
    }
});

// Load Images
const images = {};
const imageUrls = {
    log: 'assets/platform-long.png',
    eagle: 'assets/eagle.png',
    spike: 'assets/spikes.png',
    acorn: 'assets/acorn.png',
    run1: 'assets/player-run-1.png', run2: 'assets/player-run-2.png', run3: 'assets/player-run-3.png', 
    run4: 'assets/player-run-4.png', run5: 'assets/player-run-5.png', run6: 'assets/player-run-6.png',
    idle1: 'assets/player-idle-1.png', idle2: 'assets/player-idle-2.png', 
    idle3: 'assets/player-idle-3.png', idle4: 'assets/player-idle-4.png',
    jump1: 'assets/player-jump-1.png', jump2: 'assets/player-jump-2.png',
    eagle1: 'assets/eagle-attack-1.png', eagle2: 'assets/eagle-attack-2.png',
    eagle3: 'assets/eagle-attack-3.png', eagle4: 'assets/eagle-attack-4.png',
    cherry1: 'assets/cherry-1.png', cherry2: 'assets/cherry-2.png', cherry3: 'assets/cherry-3.png',
    cherry4: 'assets/cherry-4.png', cherry5: 'assets/cherry-5.png', cherry6: 'assets/cherry-6.png',
    cherry7: 'assets/cherry-7.png'
};

const anims = {
    run: ['run1', 'run2', 'run3', 'run4', 'run5', 'run6'],
    idle: ['idle1', 'idle2', 'idle3', 'idle4'],
    jump: ['jump1', 'jump2'],
    eagle: ['eagle1', 'eagle2', 'eagle3', 'eagle4'],
    acorn: ['cherry1', 'cherry2', 'cherry3', 'cherry4', 'cherry5', 'cherry6', 'cherry7']
};

let imagesLoaded = 0;
const totalImages = Object.keys(imageUrls).length;

for (let key in imageUrls) {
    images[key] = new Image();
    images[key].src = imageUrls[key];
    images[key].onload = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            if (gameState === 'START') {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                player.draw();
            }
        }
    };
}

// Player Object
const player = {
    x: 100,
    y: 100,
    width: 48,
    height: 48,
    hitbox: { offsetX: 12, offsetY: 16, width: 24, height: 32 },
    dy: 0,
    gravity: 0.6,
    jumpForce: -16,
    grounded: false,
    gliding: false,
    currentPlatform: null,

    // Animation properties
    state: 'idle',
    frameIndex: 0,
    frameTimer: 0,
    frameSpeed: 5, // update frame every 5 game frames

    draw() {
        // Update animation logic based on state
        if (gameState === 'PLAYING') {
            if (!this.grounded) {
                this.state = 'jump';
                this.frameIndex = this.dy > 0 ? 1 : 0; // jump1 going up, jump2 going down
            } else {
                this.state = 'run';
            }
        } else {
            this.state = 'idle';
        }

        // Animate if running or idle
        if (this.state === 'run' || this.state === 'idle') {
            this.frameTimer++;
            if (this.frameTimer >= this.frameSpeed) {
                this.frameTimer = 0;
                this.frameIndex = (this.frameIndex + 1) % anims[this.state].length;
            }
        }

        let currentAnim = anims[this.state];
        if (this.frameIndex >= currentAnim.length) this.frameIndex = 0;
        
        let frameKey = currentAnim[this.frameIndex];

        if (images[frameKey] && images[frameKey].complete) {
            ctx.drawImage(images[frameKey], this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'brown';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        drawDebugHitbox(this, 'red');
    },

    update() {
        // Sticky platform check
        if (this.currentPlatform) {
            let px = this.x + (this.hitbox ? this.hitbox.offsetX : 0);
            let pw = this.hitbox ? this.hitbox.width : this.width;
            let lx = this.currentPlatform.x + (this.currentPlatform.hitbox ? this.currentPlatform.hitbox.offsetX : 0);
            let lw = this.currentPlatform.hitbox ? this.currentPlatform.hitbox.width : this.currentPlatform.width;

            // Check if still within X bounds
            if (px + pw > lx && px < lx + lw) {
                // Stick to the platform perfectly
                this.grounded = true;
                this.dy = 0;
                let ph = this.hitbox ? this.hitbox.height : this.height;
                let ly = this.currentPlatform.y + (this.currentPlatform.hitbox ? this.currentPlatform.hitbox.offsetY : 0);
                this.y = ly - (this.hitbox ? this.hitbox.offsetY : 0) - ph;
                
                // We don't apply gravity if we are perfectly stuck to it
                return;
            } else {
                // Fell off the edge
                this.currentPlatform = null;
                this.grounded = false;
            }
        }

        // Apply Gravity (if not stuck to a platform)
        this.gliding = keys.jump && this.dy > 0;
        let currentGravity = this.gliding ? this.gravity * 0.1 : this.gravity;
        
        this.dy += currentGravity;
        if (this.gliding && this.dy > 2) {
            this.dy = 2; // Cap fall speed for better glide
        }
        this.y += this.dy;

        this.grounded = false;

        // Collision with floor (kill floor)
        if (this.y > canvas.height) {
            gameOver();
        }

        // Roof collision
        if (this.y < 0) {
            this.y = 0;
            this.dy = 0;
        }
    },

    jump() {
        this.dy = this.jumpForce;
        this.grounded = false;
        this.currentPlatform = null; // Detach on jump
        this.frameIndex = 0;
    }
};

// Logs / Platforms
let logs = [];
const LOG_HEIGHT = 40;

function spawnLog() {
    let width = Math.random() * 150 + 100; // 100 to 250 width
    // Ensure logs are somewhat reachable
    let lastLog = logs[logs.length - 1];
    let y = canvas.height - 150;
    
    if (lastLog) {
        let maxJumpDiff = 120; // Reduced vertical variance to ensure it's jumpable
        let minY = Math.max(200, lastLog.y - maxJumpDiff);
        let maxY = Math.min(canvas.height - 50, lastLog.y + maxJumpDiff);
        y = Math.random() * (maxY - minY) + minY;
    }

    // Fair Traps: only put spikes on wide logs
    let hasSpike = false;
    let isMoving = false;
    
    if (width > 160) {
        hasSpike = Math.random() < 0.3; // 30% chance on wide logs
    }
    
    // Give logs a chance to move vertically if they don't have spikes (too hard otherwise)
    if (!hasSpike && Math.random() < 0.25) { // 25% chance
        isMoving = true;
    }

    logs.push({
        x: canvas.width,
        y: y,
        width: width,
        height: LOG_HEIGHT,
        hitbox: { offsetX: 0, offsetY: 0, width: width, height: LOG_HEIGHT },
        hasSpike: hasSpike,
        isMoving: isMoving,
        startY: y,
        oscillationOffset: Math.random() * Math.PI * 2,
        oscillationSpeed: Math.random() * 0.02 + 0.02
    });
}

// Entities (Traps/Enemies)
let entities = [];

function spawnEntity() {
    let type = Math.random();
    if (type < 0.5) {
        // Eagle (flies left)
        entities.push({
            type: 'eagle',
            x: canvas.width,
            y: Math.random() * (canvas.height / 3), // Top third to avoid blocking jumps
            width: 50,
            height: 40,
            hitbox: { offsetX: 10, offsetY: 15, width: 30, height: 15 },
            dx: -(gameSpeed + 2),
            dy: 0,
            frameIndex: 0,
            frameTimer: 0
        });
    } else {
        // Acorn (falls down)
        entities.push({
            type: 'acorn',
            x: Math.random() * (canvas.width / 2) + canvas.width / 2, // Spawns in right half
            y: -50,
            width: 30,
            height: 30,
            hitbox: { offsetX: 5, offsetY: 5, width: 20, height: 20 },
            dx: -gameSpeed, // moves left with world
            dy: 3, // falling
            frameIndex: 0,
            frameTimer: 0
        });
    }
}

// Zero-allocation Collision Math
function checkCollision(obj1, obj2) {
    let r1x = obj1.x + (obj1.hitbox ? obj1.hitbox.offsetX : 0);
    let r1y = obj1.y + (obj1.hitbox ? obj1.hitbox.offsetY : 0);
    let r1w = obj1.hitbox ? obj1.hitbox.width : obj1.width;
    let r1h = obj1.hitbox ? obj1.hitbox.height : obj1.height;
    
    let r2x = obj2.x + (obj2.hitbox ? obj2.hitbox.offsetX : 0);
    let r2y = obj2.y + (obj2.hitbox ? obj2.hitbox.offsetY : 0);
    let r2w = obj2.hitbox ? obj2.hitbox.width : obj2.width;
    let r2h = obj2.hitbox ? obj2.hitbox.height : obj2.height;

    return (
        r1x < r2x + r2w &&
        r1x + r1w > r2x &&
        r1y < r2y + r2h &&
        r1y + r1h > r2y
    );
}

// Game Loop Functions
function resetGame() {
    player.x = 100;
    player.y = canvas.height / 2 - 100;
    player.dy = 0;
    player.state = 'idle';
    player.frameIndex = 0;
    player.currentPlatform = null;
    logs = [];
    entities = [];
    score = 0;
    frames = 0;
    gameSpeed = 4;
    nextLogGap = 50;
    scoreDisplay.innerText = `Score: ${score}`;
    
    // Initial Platform (long runway to start)
    logs.push({
        x: 0,
        y: canvas.height - 100,
        width: canvas.width,
        height: LOG_HEIGHT,
        hitbox: { offsetX: 0, offsetY: 0, width: canvas.width, height: LOG_HEIGHT },
        hasSpike: false,
        isMoving: false,
        startY: canvas.height - 100,
        oscillationOffset: 0,
        oscillationSpeed: 0
    });
}

function updateLogsAndCollisions() {
    for (let i = logs.length - 1; i >= 0; i--) {
        let log = logs[i];
        log.x -= gameSpeed;

        if (log.isMoving) {
            // Oscillate up and down by 60 pixels
            log.y = log.startY + Math.sin(frames * log.oscillationSpeed + log.oscillationOffset) * 60;
        }

        // Draw log
        if (images.log.complete) {
            ctx.drawImage(images.log, log.x, log.y, log.width, log.height);
        } else {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(log.x, log.y, log.width, log.height);
        }
        drawDebugHitbox(log, 'blue');

        // Draw Spike if has one
        if (log.hasSpike) {
            let spikeRect = {
                x: log.x + log.width / 2 - 15,
                y: log.y - 30,
                width: 30,
                height: 30,
                hitbox: { offsetX: 5, offsetY: 15, width: 20, height: 15 }
            };
            if (images.spike.complete) {
                ctx.drawImage(images.spike, spikeRect.x, spikeRect.y, spikeRect.width, spikeRect.height);
            } else {
                ctx.fillStyle = 'gray';
                ctx.beginPath();
                ctx.moveTo(spikeRect.x, spikeRect.y + spikeRect.height);
                ctx.lineTo(spikeRect.x + spikeRect.width/2, spikeRect.y);
                ctx.lineTo(spikeRect.x + spikeRect.width, spikeRect.y + spikeRect.height);
                ctx.fill();
            }
            drawDebugHitbox(spikeRect, 'yellow');

            // Spike Collision
            if (checkCollision(player, spikeRect)) {
                gameOver();
            }
        }

        // Collision with log (landing)
        if (!player.currentPlatform) { // Only check landing if not already stuck
            let px = player.x + (player.hitbox ? player.hitbox.offsetX : 0);
            let py = player.y + (player.hitbox ? player.hitbox.offsetY : 0);
            let pw = player.hitbox ? player.hitbox.width : player.width;
            let ph = player.hitbox ? player.hitbox.height : player.height;

            let lx = log.x + (log.hitbox ? log.hitbox.offsetX : 0);
            let ly = log.y + (log.hitbox ? log.hitbox.offsetY : 0);
            let lw = log.hitbox ? log.hitbox.width : log.width;

            if (
                player.dy > 0 && // falling
                px + pw > lx && 
                px < lx + lw &&
                py + ph > ly && 
                py + ph < ly + player.dy + 8 // Increased tolerance for fast moving logs jumping into player
            ) {
                player.currentPlatform = log; // Lock onto this log
                player.grounded = true;
                player.dy = 0;
                player.y = ly - (player.hitbox ? player.hitbox.offsetY : 0) - ph;
            }
        }

        if (log.x + log.width < 0) {
            if (player.currentPlatform === log) {
                player.currentPlatform = null; // Safety detach if destroyed
            }
            logs.splice(i, 1);
        }
    }
}

function updateEntities() {
    for (let i = entities.length - 1; i >= 0; i--) {
        let ent = entities[i];
        ent.x += ent.dx;
        ent.y += ent.dy;

        if (ent.type === 'eagle') {
            ent.frameTimer++;
            if (ent.frameTimer >= 5) {
                ent.frameTimer = 0;
                ent.frameIndex = (ent.frameIndex + 1) % anims.eagle.length;
            }
            let frameKey = anims.eagle[ent.frameIndex];
            if (images[frameKey] && images[frameKey].complete) {
                ctx.drawImage(images[frameKey], ent.x, ent.y, ent.width, ent.height);
            }
        } else {
            ent.frameTimer++;
            if (ent.frameTimer >= 5) {
                ent.frameTimer = 0;
                ent.frameIndex = (ent.frameIndex + 1) % anims.acorn.length;
            }
            let frameKey = anims.acorn[ent.frameIndex];
            if (images[frameKey] && images[frameKey].complete) {
                ctx.drawImage(images[frameKey], ent.x, ent.y, ent.width, ent.height);
            }
        }
        
        drawDebugHitbox(ent, 'purple');

        // Collision
        if (checkCollision(player, ent)) {
            gameOver();
        }

        // Remove offscreen
        if (ent.x + ent.width < 0 || ent.y > canvas.height) {
            entities.splice(i, 1);
        }
    }
}

// Global variable for CSS background scrolling
let bgX = 0;

function gameLoop() {
    if (gameState !== 'PLAYING') return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // CSS GPU Parallax Update
    bgX -= gameSpeed * 0.5;
    if (bgX <= -800) bgX = 0; // Prevent huge negatives
    gameContainer.style.backgroundPositionX = `${bgX}px`;

    // Spawning logic
    let lastLog = logs[logs.length - 1];
    if (!lastLog || (canvas.width - (lastLog.x + lastLog.width)) >= nextLogGap) {
        spawnLog();
        nextLogGap = Math.random() * 140 + 30; // random gap between 30px and 170px
    }
    
    if (frames % 250 === 0) {
        spawnEntity();
    }

    // Update World Objects FIRST (Moves platforms to their new frame positions)
    updateLogsAndCollisions();
    updateEntities();

    // Update Player SECOND (If stuck to platform, it will snap perfectly to the newly calculated Y)
    player.update();

    // Draw Player
    player.draw();

    // Score & Difficulty
    frames++;
    if (frames % 10 === 0) {
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
    }
    
    // Increase speed slowly
    if (frames % 600 === 0) {
        gameSpeed += 0.5;
    }

    animationId = requestAnimationFrame(gameLoop);
}

function startGame() {
    gameState = 'PLAYING';
    startScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    resetGame();
    gameLoop();
}

function gameOver() {
    gameState = 'GAMEOVER';
    cancelAnimationFrame(animationId);
    finalScoreDisplay.innerText = score;
    gameOverScreen.classList.add('active');
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Draw the initial state once images load (so you see the idle squirrel)
setTimeout(() => {
    if (gameState === 'START') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.draw();
    }
}, 500);
