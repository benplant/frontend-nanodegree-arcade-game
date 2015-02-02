// Board object to hold constants for the board
// and any other default values.
// This could be made into a more complex classs / function
// that would allow for different levels to increase
// the difficulty of the game or level layout details.
var Board = {
    BOARD_HEIGHT: 606,
    BOARD_WIDTH: 505,
    // X spaces * 101
    BLOCK_WIDTH: 101,
    // Y spaces * 83 plus a 60 pixel offset
    BLOCK_HEIGHT: 83,
    Y_OFFSET: 60,
    ENEMY_MIN_SPEED: 50,
    ENEMY_MAX_SPEED: 200
};

// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Default min and max speeds
    this.min_speed = Board.ENEMY_MIN_SPEED;
    this.max_speed = Board.ENEMY_MAX_SPEED;

    // Default speed
    this.speed = this.max_speed - this.min_speed;

    // Set the enemy in a starting position.
    this.returnToStart();
}

// Update the enemies speed with a random speed between min and max
// Paramater: min, the minimum value for the random speed
// Paramater: max, the maximum value for the random speed
Enemy.prototype.setRandomSpeed = function(min, max) {
    // Use min and max if provided, otherwise use the defaults
    var minimum = min || this.min_speed;
    var maximum = max || this.max_speed;
    this.speed = Math.floor(Math.random() * (maximum - minimum)) + minimum;
}

// Set a random row (Y) for the enemy to appear on
Enemy.prototype.setRandomRow = function() {
    var row = Math.floor(Math.random() * 3);
    this.y = Board.Y_OFFSET + Board.BLOCK_HEIGHT * row;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Check whether enemy has collided with player
    this.checkForCollisionWithPlayer();

    // If enemy is off the board, return it to the start
    // and send it back in again.
    if (this.x > Board.BOARD_WIDTH) {
        this.returnToStart();
    } else {
        this.x = this.x + dt * this.speed;
    }
}

// Check for collision with player
Enemy.prototype.checkForCollisionWithPlayer = function() {
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
// Use BLOCK_HEIGHT for the height value and descrease the width
// from 101 to 80 for more accurate collision detection.
    if (this.x < player.x + 80 &&
        this.x + 80 > player.x &&
        this.y < player.y + Board.BLOCK_HEIGHT &&
        Board.BLOCK_HEIGHT + this.y > player.y) {
        // collision detected!
        // cause players death
        player.death();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Return the Enemy to a starting position
Enemy.prototype.returnToStart = function() {
    // x position: just off the left of the board.
    this.x = -Board.BLOCK_WIDTH;
    // Set the y position to a random row
    this.setRandomRow();
    // Since this enemy is respawning, give it a
    // new random speed.
    this.setRandomSpeed();
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';

    this.returnToStart();
}

// Update the player's position, required method for game
Player.prototype.update = function() {
    // Check if the player has won
    if (this.hasWonTheGame()) {
        this.wonGame();
    }
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Handle input for player movement
Player.prototype.handleInput = function(key) {
    if (key == 'up') {
        // allow all 'up' movements, as a win will be
        // considered anything off the top of the board.
        this.y = this.y - Board.BLOCK_HEIGHT;
    } else if (key == 'left') {
        if (this.x - Board.BLOCK_WIDTH >= 0) {
            this.x = this.x - Board.BLOCK_WIDTH;
        }
    } else if (key == 'right') {
        if (this.x + Board.BLOCK_WIDTH < Board.BOARD_WIDTH) {
            this.x = this.x + Board.BLOCK_WIDTH;
        }
    } else if (key == 'down') {
        if (this.y + Board.BLOCK_HEIGHT < Board.BOARD_HEIGHT - Board.BLOCK_HEIGHT - Board.Y_OFFSET) {
            this.y = this.y + Board.BLOCK_HEIGHT;
        }
    }
}

// Check whether the player has successfully won the game.
// Return true if the player is in a state where they have won.
// Return false if the player is not in a winning state.
Player.prototype.hasWonTheGame = function() {
    // Default win is if the player is in the water
    if (this.y <= 0) {
        return true;
    } else {
        return false;
    }
}

// Action to take when player wins
Player.prototype.wonGame = function() {
    // Let user know they won the game
    alert("You win!");
    // Return player to start
    this.returnToStart();
}

// Action to take on player's death
Player.prototype.death = function() {
    // Default is just return the player to the start
    this.returnToStart();
}

// Return player to starting position
Player.prototype.returnToStart = function() {
    // x position: left side of player is 2 block widths over.
    this.x = Board.BLOCK_WIDTH * 2;
    // y position: top side of player is 4 blocks down + an offset.
    this.y = Board.BLOCK_HEIGHT * 4 + Board.Y_OFFSET;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Test enemies
var allEnemies = [];
var total_enemies = 5;
for (var i = 0; i < total_enemies; i++) {
    var enemy = new Enemy();
    enemy.setRandomSpeed();
    enemy.setRandomRow();
    allEnemies.push(enemy);
}

// Test player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
