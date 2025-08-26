const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 14;
const paddleHeight = 90;
const ballRadius = 12;

// Initial positions
let leftPaddle = { x: 22, y: canvas.height/2 - paddleHeight/2, width: paddleWidth, height: paddleHeight };
let rightPaddle = { x: canvas.width - paddleWidth - 22, y: canvas.height/2 - paddleHeight/2, width: paddleWidth, height: paddleHeight };

let ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    vx: 6 * (Math.random() > 0.5 ? 1 : -1),
    vy: 4 * (Math.random() > 0.5 ? 1 : -1),
    radius: ballRadius
};

let leftScore = 0;
let rightScore = 0;

// Mouse controls for left paddle
canvas.addEventListener('mousemove', function(e) {
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height/2;

    // Clamp paddle to canvas bounds
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > canvas.height) leftPaddle.y = canvas.height - leftPaddle.height;
});

// Simple AI for right paddle
function moveAIPaddle() {
    const center = rightPaddle.y + rightPaddle.height/2;
    if (ball.y < center - 10) {
        rightPaddle.y -= 5;
    } else if (ball.y > center + 10) {
        rightPaddle.y += 5;
    }
    // Clamp paddle to canvas bounds
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > canvas.height) rightPaddle.y = canvas.height - rightPaddle.height;
}

function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.vx = 6 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Game loop
function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Ball collision with top/bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.vy *= -1;
    }

    // Ball collision with paddles
    // Left paddle
    if (
        ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
        ball.y > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height
    ) {
        ball.x = leftPaddle.x + leftPaddle.width + ball.radius; // Move ball out of paddle
        ball.vx *= -1;
        // Add a little "spin" based on where it hit the paddle
        let hitPos = (ball.y - (leftPaddle.y + leftPaddle.height/2)) / (leftPaddle.height/2);
        ball.vy += hitPos * 2;
    }

    // Right paddle
    if (
        ball.x + ball.radius > rightPaddle.x &&
        ball.y > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height
    ) {
        ball.x = rightPaddle.x - ball.radius; // Move ball out of paddle
        ball.vx *= -1;
        let hitPos = (ball.y - (rightPaddle.y + rightPaddle.height/2)) / (rightPaddle.height/2);
        ball.vy += hitPos * 2;
    }

    // Score
    if (ball.x < 0) {
        rightScore++;
        resetBall();
    }
    if (ball.x > canvas.width) {
        leftScore++;
        resetBall();
    }

    moveAIPaddle();
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.strokeStyle = "#fff";
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = "#fff";
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.font = "40px Arial";
    ctx.fillText(leftScore, canvas.width/2 - 60, 60);
    ctx.fillText(rightScore, canvas.width/2 + 25, 60);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();