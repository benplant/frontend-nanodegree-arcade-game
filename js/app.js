var Board = {
    // X spaces * 101
    BLOCK_WIDTH: 101,
    // Y spaces * 83 plus a 60 pixel offset
    BLOCK_HEIGHT: 83,
    Y_OFFSET: 60
};

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Default start location (Just off the left of the board)
    this.x = -Board.BLOCK_WIDTH;
    this.y = Board.Y_OFFSET;

    // Default speed
    this.speed = 15;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // if enemy goes off the right side of the screen,
    // set the x position back to just off the left side (-101)
    console.log(Board);
    console.log(Board.BLOCK_WIDTH);
    if (this.x > Board.BLOCK_WIDTH * 5) {
        this.x = -Board.BLOCK_WIDTH;
    } else {
        this.x = this.x + dt * this.speed;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';

    // Start location
    // X spaces * 101
    // Y spaces * 83 plus a 60 pixel offset
    this.x = Board.BLOCK_WIDTH * 2;
    this.y = Board.BLOCK_HEIGHT * 4 + Board.Y_OFFSET;
}

// Update the player's position, required method for game
Player.prototype.update = function() {
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Handle input for player movement
Player.prototype.handleInput = function() {

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Test enemies
var enemy1 = new Enemy();
enemy1.speed = 50;
enemy1.y = Board.Y_OFFSET;
var enemy2 = new Enemy();
enemy2.speed = 100;
enemy2.y = Board.Y_OFFSET + Board.BLOCK_HEIGHT
var enemy3 = new Enemy();
enemy3.speed = 80;
enemy3.y = Board.Y_OFFSET + Board.BLOCK_HEIGHT * 2;
var allEnemies = [enemy1, enemy2, enemy3];

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
