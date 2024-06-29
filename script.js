const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const grid = 20;
let snakeSpeed = 100; // Initial snake speed (lower is slower)
let snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4
};
let apple = {
    x: 320,
    y: 320
};
let gameOver = false;
let score = 0;
let gameInterval; // Variable to hold the interval for game loop

// Function to get a random integer within a range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Function to check if a position is on the snake's body
function isSnakePosition(position) {
    for (let i = 0; i < snake.cells.length; i++) {
        if (position.x === snake.cells[i].x && position.y === snake.cells[i].y) {
            return true;
        }
    }
    return false;
}

// Function to reset the game
function resetGame() {
    clearInterval(gameInterval); // Clear any existing game interval
    snake = {
        x: 160,
        y: 160,
        dx: grid,
        dy: 0,
        cells: [],
        maxCells: 4
    };

    // Generate initial apple position that is not on the snake
    do {
        apple = {
            x: getRandomInt(0, 20) * grid,
            y: getRandomInt(0, 20) * grid
        };
    } while (isSnakePosition(apple));

    gameOver = false;
    score = 0; // Reset score
    updateScore(); // Draw initial score
    gameInterval = setInterval(gameLoop, snakeSpeed); // Start game loop with interval
}

// Function to update the game state and render the game
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    // Wrap snake around canvas edges
    if (snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height) {
        gameOver = true; // Snake hits the border, game over
    }

    snake.cells.unshift({ x: snake.x, y: snake.y });

    // Remove snake tail if it exceeds max length
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Check if snake eats apple
    if (snake.x === apple.x && snake.y === apple.y) {
        snake.maxCells++;
        // Generate new apple position that is not on the snake
        do {
            apple = {
                x: getRandomInt(0, 20) * grid,
                y: getRandomInt(0, 20) * grid
            };
        } while (isSnakePosition(apple));
        
        score += 1; // Increase score when snake eats apple
        updateScore(); // Update score display
    }

    // Draw apple
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.cells.forEach(function (cell, index) {
        if (index === 0) {
            ctx.fillStyle = 'blue'; // Head color
        } else {
            ctx.fillStyle = 'green'; // Body color
        }
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
    });

    // Check if snake hits the border
    if (gameOver) {
        clearInterval(gameInterval); // Stop the game loop
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText('Game Over', 150, 200);
        ctx.font = '16px Arial';
        ctx.fillText('Press ENTER to restart', 130, 250);
        return;
    }
}

// Function to update the score display
function updateScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `Your Score: ${score}`;
}

// Event listener for keyboard input
document.addEventListener('keydown', function (e) {
    if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
    }

    // Change snake direction based on arrow key input
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    } else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    } else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    } else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    } else if (e.key === ' ') { // Spacebar for pause/unpause
        if (gameInterval) {
            clearInterval(gameInterval); // Pause the game
            gameInterval = null;
        } else {
            gameInterval = setInterval(gameLoop, snakeSpeed); // Unpause the game
        }
    }
});

// Start the game loop initially
resetGame();
