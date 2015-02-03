// Board object to hold constants for the board
// and any other default values.
// This could be expanded into a more complex classs / function
// that would allow for different levels to increase
// the difficulty of the game and/or level layout details.
var Board = {
    BOARD_HEIGHT: 606,
    BOARD_WIDTH: 505,
    BLOCK_WIDTH: 101,
    BLOCK_HEIGHT: 83,
    Y_OFFSET: 60,
    ENEMY_MIN_SPEED: 50,
    ENEMY_MAX_SPEED: 200,
    ROCK_SPEED: 300,
    PLAYER_SPRITES: ['images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png']
};

// Enemies our player must avoid
var Enemy = function() {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Default min and max speeds
    this.minSpeed = Board.ENEMY_MIN_SPEED;
    this.maxSpeed = Board.ENEMY_MAX_SPEED;

    // Calculate default speed of this enemy
    this.speed = this.maxSpeed - this.minSpeed;

    // Set this enemy in a starting position.
    this.returnToStart();
}

// Update this enemie's speed with a random speed between min and max
// Parameter: min, the minimum value for the random speed
// Parameter: max, the maximum value for the random speed
Enemy.prototype.setRandomSpeed = function(min, max) {
    // Use min and max if provided, otherwise use defaults
    var minimum = min || this.minSpeed;
    var maximum = max || this.maxSpeed;
    this.speed = Math.floor(Math.random() * (maximum - minimum) + minimum);
}

// Set a random row for this enemy to appear on
Enemy.prototype.setRandomRow = function() {
    var row = Math.floor(Math.random() * 3);
    this.y = Board.Y_OFFSET + Board.BLOCK_HEIGHT * row;
}

// Update this enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Check whether this enemy has collided with player
    this.checkForCollisionWithPlayer();

    // Check whether this enemy has collided with a rock
    this.checkForCollisionWithRock();

    // If this enemy is off the board, return it to the start.
    // Otherwise move forward based on this enemie's speed.
    if (this.x > Board.BOARD_WIDTH) {
        this.returnToStart();
    } else {
        this.x = this.x + dt * this.speed;
    }
}

// Check for collision with player
Enemy.prototype.checkForCollisionWithPlayer = function() {
// Check whether this enemy's bounds overlap with the player
// Use BLOCK_HEIGHT for both player and enemy heights to ensure
// that collisions only occur if on the same row.
// Descrease the widths from 101 to 80 to provide more detailed
// collision detection rather than just being on the same block.
    if (this.x < player.x + 80 &&
        this.x + 80 > player.x &&
        this.y < player.y + Board.BLOCK_HEIGHT &&
        Board.BLOCK_HEIGHT + this.y > player.y) {
        // collision detected!
        // cause players death
        player.death();
    }
}

// Check for collision with rock
Enemy.prototype.checkForCollisionWithRock = function() {
// Check whether this enemy's bounds overlap with the rock
// Only need to check if there is currently a rock on screen
    if (player.rock != null) {
        if (this.x < player.rock.x + 80 &&
            this.x + 80 > player.rock.x &&
            this.y < player.rock.y + Board.BLOCK_HEIGHT &&
            Board.BLOCK_HEIGHT + this.y > player.rock.y) {
            // collision detected!
            // The rock can only hit one enemy
            // so remove it on collision
            player.rock = null;

            // return this enemy to starting point.
            this.returnToStart();
        }
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Return the Enemy to a starting position
Enemy.prototype.returnToStart = function() {
    // Set the x position to just off the left of the board.
    this.x = -Board.BLOCK_WIDTH;
    // Set the y position to a random row
    this.setRandomRow();
    // Give the enemy a new random speed.
    this.setRandomSpeed();
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Default player sprite settings
    this.sprite = 'images/char-boy.png';
    this.currentSpriteNumber = 0;

    // The player can have a rock to throw
    this.rock = null;

    // Select a random sprite to start
    this.changeToRandomCharacter();

    // Place player at starting position
    this.returnToStart();
}

// Update the player's position, required method for game
Player.prototype.update = function(dt) {
    // Check if the player has won
    if (this.hasWonTheGame()) {
        this.wonGame();
    }

    // If player has a rock on screen, update it.
    if (this.rock != null) {
        this.rock.update(dt);
    }
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // If player has a rock on screen, render it.
    if (this.rock != null) {
        this.rock.render();
    }
}

// Handle input for player movement
Player.prototype.handleInput = function(key) {
    if (key == 'up') {
        // Allow all 'up' movements, as a win will be
        // anything in the water at the top of the board
        this.y = this.y - Board.BLOCK_HEIGHT;
    } else if (key == 'left') {
        // Ensure player will still be on the board
        if (this.x - Board.BLOCK_WIDTH >= 0) {
            this.x = this.x - Board.BLOCK_WIDTH;
        }
    } else if (key == 'right') {
        // Ensure player will still be on the board
        if (this.x + Board.BLOCK_WIDTH < Board.BOARD_WIDTH) {
            this.x = this.x + Board.BLOCK_WIDTH;
        }
    } else if (key == 'down') {
        // Ensure player will still be on the board
        if (this.y + Board.BLOCK_HEIGHT < Board.BOARD_HEIGHT -
            Board.BLOCK_HEIGHT - Board.Y_OFFSET) {
            this.y = this.y + Board.BLOCK_HEIGHT;
        }
    } else if (key == 'c') {
        // Change the player sprite image
        this.changeCharacter();
    } else if (key == 'space') {
        // Throw a rock
        this.throwRock();
    }
}

// Check whether the player has successfully won the game.
// Return true if the player is in a state where they have won.
// Return false if the player is not in a winning state.
Player.prototype.hasWonTheGame = function() {
    // Default win is if the player is in the water
    return (this.y <= 0) ? true : false;
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
    // Default is to just return the player to the start
    this.returnToStart();
}

// Return player to starting position
Player.prototype.returnToStart = function() {
    // x position: left side of player is 2 block widths over.
    this.x = Board.BLOCK_WIDTH * 2;
    // y position: top side of player is 4 blocks down + an offset.
    this.y = Board.BLOCK_HEIGHT * 4 + Board.Y_OFFSET;
}

// Change the player's sprite image
Player.prototype.changeCharacter = function(spriteNumber) {
    // Use the defined spriteNumber if provided
    if (spriteNumber != null) {
        this.currentSpriteNumber = spriteNumber;
    } else {  // otherwise just toggle through the sprites
        this.currentSpriteNumber = this.currentSpriteNumber + 1;
    }

    // If the curent value is beyone the range of
    // available sprites, default to 0.
    if (this.currentSpriteNumber >= Board.PLAYER_SPRITES.length) {
        this.currentSpriteNumber = 0;
    }

    this.sprite = Board.PLAYER_SPRITES[this.currentSpriteNumber];
}

// Select a random sprite for player
Player.prototype.changeToRandomCharacter = function() {
    // Choose a random sprite number based on the total
    // available sprites
    var spriteNumber = Math.floor(Math.random() *
        Board.PLAYER_SPRITES.length);

    this.changeCharacter(spriteNumber);
}

// Have the player throw a rock
Player.prototype.throwRock = function() {
    // Player can only throw a rock
    // if there isn't already one on screen.
    if (this.rock == null) {
        this.rock = new Rock();
    }
}

// Rocks our player can throw
var Rock = function() {
    this.sprite = 'images/Rock.png';

    // Rock starts from just above player
    this.x = player.x;
    this.y = player.y - 40;
}

// Update the rock's position
// Rock moves vertically until off the board
Rock.prototype.update = function(dt) {
    // If the rock is off the board, remove it.
    // Otherwise move upwards based on speed.
    if (this.y < 0) {
        player.rock = null;
    } else {
        this.y = this.y - dt * Board.ROCK_SPEED;
    }
}

// Draw the rock on the screen
Rock.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// Create enemies
var allEnemies = [];
var totalEnemies = 5;
for (var i = 0; i < totalEnemies; i++) {
    var enemy = new Enemy();
    enemy.setRandomSpeed();
    enemy.setRandomRow();
    allEnemies.push(enemy);
}

// Create Player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        67: 'c',
        32: 'space'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
