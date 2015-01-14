/*  -----------------------------------------------------------------------------*/
// Instantiation 
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player;
var playerInitPositionX = ctx.canvas.width / 2.5;
var playerInitPositionY = ctx.canvas.height - 170;
// time in milliseconds
var bestTime = 0;


/* Create a new object to use as base for
 * all objects which we'll be putting on our
 * canvas. Every object has, at minimum,
 * a position, an image, and a render function which
 * should not differ between different types (player, enemy, any pickups/blockers, etc.)
 */

var Avatar = function(x, y, spriteImg) {

  this.sprite = spriteImg || "";
  this.positionX = x || 0;
  this.positionY = y || 0;
  this.initPositionX = this.positionX;
  this.initPositionY = this.positionY;
  this.width =  Resources.get(this.sprite).width  || 0;
  this.height = Resources.get(this.sprite).height || 0;
}
// console.log(new Avatar.prototype.constructor );
// console.log(Avatar.prototype);
// console.log(Avatar.constructor);
// var avatar = new Avatar(300, 200,'images/enemy-bug.png'); 
// console.log(avatar);


/*
 * Enemy
 * define constructors that allow you to provide property values at object creation time.
 * n object of these types has properties of all the objects above it in the chain. In addition,
 *  these definitions override the inherited value of the dept property with new values specific to these objects.
 */
var Enemy = function(x, y, spriteImg) {
  Avatar.call(this, x, y, spriteImg);
  // randomize enemy speed. 
  // http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript 
  this.speed = Math.floor(Math.random() * (121) + 100); 
}


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};


//  update the enemy's position
Enemy.prototype.update = function(dt) {

  // multiply any movement by the dt parameter to ensure 
  // the game runs at the same speed for all computers.
  if(this.positionX <= ctx.canvas.width) {
     this.positionX += this.speed * dt;
  } else {
    // start enemy entirely beyond left side, then have it appear to move smoothly into canvas
    this.positionX = -Resources.get(player.sprite).width;
  }
}

/* 
 * Reset the enemy's position
 */
Enemy.prototype.reset = function() {
  this.positionX = this.initPositionX;
  this.positionY = this.initPositionY;
}


/*
 *  Player
 *  This class requires an update(), render() and a handleInput() method.
 */
var Player = function(x, y, spriteImg, moveX, moveY) {

  Avatar.call(this, x, y, spriteImg, moveX, moveY);
  // number of pixels to move per keystroke in both x and y directions.
  this.moveX = moveX || 0;
  this.moveY = moveY || 0;
  this.Star = 'images/Star.png';
  this.lives = 5;
  this.score = 0;
  this.timeCount = 0;
  this.level = 0;

}

// update player
Player.prototype.update = function() {
  /* this is called every time main is called in engine.js.
   * simply update the timer to the new system time.
   * When game ends, start time will be subtracted from this.timer value
   */
  if (this.positionY - this.moveY <= 0) {
    animate = true;
    this.reset();
    this.score += 100;
    this.level = 0;
  }
};


// render player
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};


/* 
 * Reset the player's position.  Send player back to starting position
 */
Player.prototype.reset = function(checkTime) {
  this.positionX = this.initPositionX;
  this.positionY = this.initPositionY;
};

// Handle keyboard controls
// checks the up, down, left, and right arrow keys to see if the user has pressed them. 
// If so, the player is moved in the corresponding direction. Javascript Game 
// Development - Keyboard Input http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/

var Key = {
  _pressed: {},

  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,

  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  onKeyup: function(event) {
    delete this._pressed[event.keyCode];
  }
};


Player.prototype.handleInput = function() {

  switch (true) {
    case Key.isDown(Key.UP):
      if (this.positionY - this.moveY > 0) {
        this.positionY -= this.moveY
      };
      break;

    case Key.isDown(Key.LEFT):
      if (this.positionX - this.moveX >= 0) {
        this.positionX -= this.moveX
      };
      break;

    case Key.isDown(Key.DOWN):
      if (this.positionY + Resources.get(player.sprite).height + this.moveY <= ctx.canvas.height) {
        this.positionY += this.moveY
      };
      break;

    case Key.isDown(Key.RIGHT):
      if (this.positionX + Resources.get(player.sprite).width + this.moveX <= ctx.canvas.width) {
        this.positionX += this.moveX
      };
      break;
  }
};


// 101 is width of all blocks, 83 is defined in engine.js as the default y step size when adding the blocks...   col * 101, row * 83
player = new Player(playerInitPositionX, playerInitPositionY, 'images/char-horn-girl.png', 101, 83);
// console.log(player);