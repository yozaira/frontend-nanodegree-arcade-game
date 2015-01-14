/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
var Engine = (function(global) {

  /* Predefine the variables we'll be using within this scope,
   * create the canvas element, grab the 2D context for that canvas
   * set the canvas elements height/width and add it to the DOM.
   */
  var doc = global.document;
  var win = global.window;
  var canvas = doc.createElement('canvas');
  canvas.className = "froggerCanvas";
  var ctx = canvas.getContext('2d');
  canvas.width = 505;
  canvas.height= 660;
  var container = document.querySelector("#container");
  container.appendChild(canvas);

  var animate = false;
  var lastTime;
  var isOver = false;

  /* This function serves as the kickoff point for the game loop itself
   * and handles properly calling the update and render methods.
   */
  function main() {
    /* Get our time delta information which is required if your game
     * requires smooth animation. Because everyone's computer processes
     * instructions at different speeds we need a constant value that
     * would be the same for everyone (regardless of how fast their
     * computer is) - hurray time!
     */
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    /* Call our update/render functions, pass along the time delta to
     * our update function since it may be used for smooth animation.
     */
    update(dt);
    renderBg();
    renderEntities();
    /* Set our lastTime variable which is used to determine the time delta
     * for the next time this function is called.
     */
    lastTime = now;

    /* Use the browser's requestAnimationFrame function to call this
     * function again as soon as the browser is able to draw another frame.
     */
    if (global.animate) win.requestAnimationFrame(main);
  };



  /* This function does some initial setup that should only occur once,
   * particularly setting the lastTime variable that is required for the
   * game loop.
   */
  function init() {

    drawScoreBoard();

    createEnemies();

    lastTime = Date.now();
    main();

    window.addEventListener('keyup', function(event) {
      player.handleInput();
    }, false);

    window.addEventListener('keyup', function(event) {
      Key.onKeyup(event);
    }, false);

    window.addEventListener('keydown', function(event) {
      Key.onKeydown(event);
    }, false);

    // Listen for clicks on "New Game" button, call "reset" in engine.js
    window.onload = function() {
      document.getElementById("playAgain").addEventListener("click", function(e) {
        reset();
      }, false);
    }

  }


  /* This is called by the update function  and loops through all of the
   * objects within your allEnemies array as defined in app.js and calls
   * their update() methods. It will then call the update function for your
   * player object. These update methods should focus purely on updating
   * the data/properties related to  the object. Do your drawing in your
   * render methods.
   */
  function updateEntities(dt) {
    allEnemies.forEach(function(enemy) {
      enemy.update(dt);
    });
    player.update();
  }


  /* This function is called by main (our game loop) and itself calls all
   * of the functions which may need to update entity's data. Based on how
   * you implement your collision detection (when two entities occupy the
   * same space, for instance when your character should die), you may find
   * the need to add an additional function call here. For now, we've left
   * it commented out - you may or may not want to implement this
   * functionality this way (you could just implement collision detection
   * on the entities themselves within your app.js file).
   */
  function update(dt) {

    updateEntities(dt);
    checkCollision();

  }


  /* This function initially draws the "game level", it will then call
   * the renderEntities function. Remember, this function is called every
   * game tick (or loop of the game engine) because that's how games work -
   * they are flipbooks creating the illusion of animation but in reality
   * they are just drawing the entire screen over and over.
   */
  function renderBg() {
    /* This array holds the relative URL to the image used
     * for that particular row of the game level.
     */
    var rowImages = [
        'images/water-block.png',
        // 'images/stone-block.png', // Row 1 of 3 of stone
        // 'images/stone-block.png', // Row 2 of 3 of stone
        'images/stone-block.png', // Row 3 of 3 of stone
        'images/grass-block.png', // Row 1 of 2 of grass
        'images/grass-block.png', // Row 1 of 2 of grass
        'images/grass-block.png', // Row 1 of 2 of grass
        'images/grass-block.png', // Row 1 of 2 of grass
        'images/stone-block.png'  // Row 2 of 2 of grass
      ],
      numRows = 7,
      numCols = 5,
      row, col;

    /* Loop through the number of rows and columns we've defined above
     * and, using the rowImages array, draw the correct image for that
     * portion of the "grid"
     */
    for (row = 0; row < numRows; row++) {
      for (col = 0; col < numCols; col++) {
        /* The drawImage function of the canvas' context element
         * requires 3 parameters: the image to draw, the x coordinate
         * to start drawing and the y coordinate to start drawing.
         * We're using our Resources helpers to refer to our images
         * so that we get the benefits of caching these images, since
         * we're using them over and over.
         */
        ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);        
      }
    }
  }



  function createEnemies() {

    for (var i = 0; i < 4; i++) {
      // enemy starting x position will be set at random point
      var x = Math.floor(Math.random() * (50) + -80);
      // use var i value  to calculate the enemy starting y position and set it at different points
      var y = (83 * i) + 140;
      // enemy object is defined on renderEntities() function on froggerEngine.js
      allEnemies.push(new Enemy(x, y, 'images/enemy-bug.png'));
    }
    // console.log(allEnemies );
  }



  var playerWon = function() {

    isOver = true;
    player.update();
    allEnemies.forEach(function(enemy) {
      enemy.reset();
    });
    // Draws score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "32px Helvetica";
    ctx.textAlign = "center";
    ctx.textBaseline = 'top';
    ctx.fillText('Congratulations. You Won!! ', ctx.canvas.width / 2, 70);
  };


  var scoreEnd = function() {

    isOver = true;
    player.update();
    allEnemies.forEach(function(enemy) {
      enemy.reset();
    });
    // Draws score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "32px Helvetica";
    ctx.textAlign = "center";
    ctx.textBaseline = 'top';
    ctx.fillText('Game is Over! ', ctx.canvas.width / 2, 70);
  };



  var scoreStart = function() {
    // Draws score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = 'top';
    ctx.fillText('Score: ' + player.score, 55, 70);

    for (var i = 0; i < player.lives; i++) {
      ctx.drawImage( 
                   Resources.get(player.Star), 300 + (i * Resources.get(player.Star).width * .3), 
                   55, Resources.get(player.Star).width * .3, Resources.get(player.Star).height * .3
                   );
    }
  };



  function drawScoreBoard() {

    if (player.lives == 0) {
      scoreEnd();
    } else if (player.score == 500) {
      playerWon();
    } else {
      scoreStart();
    }
  }



  /* This function is called by the render function and is called on each game
   * tick. It's purpose is to then call the render functions you have defined
   * on your enemy and player entities within app.js
   */
  function renderEntities() {
    /* Loop through all of the objects within the allEnemies array and call
     *  the render function you have defined.
     */
    // console.log(allEnemies);
    allEnemies.forEach(function(enemy) {
      enemy.render();
      // console.log(enemy);
      // console.log(' Show enemies Position : ' + enemy.positionX);
      // console.log('Render enemies ' + enemy.sprite);
    });

    player.render();
    // console.log(Resources.get(player.sprite).width);

    drawScoreBoard();
  }


  function checkCollision() {
    //resets game on enemies/player collisions    
    for (var current = 0, quantityEnemies = allEnemies.length; current < quantityEnemies; current++) {

      if (player.positionX <= (allEnemies[current].positionX + 70) &&
        allEnemies[current].positionX <= (player.positionX + 50) &&
        player.positionY <= (allEnemies[current].positionY + 70) &&
        allEnemies[current].positionY <= (player.positionY + 60)) {
        animate = true;
        player.reset();
        player.lives--;
        // console.log("Lives left: " + player.lives);
      }
    }
  };



  /* This function does nothing but it could have been a good place to
   * handle game reset states - maybe a new game menu or a game over screen
   * those sorts of things. It's only called once by the init() method.
   */
  function reset() {
   
    // console.log("Engine reset enabled");

    global.animate = true;
    player.score = 0;

    allEnemies.forEach(function(enemy) {
      enemy.reset();
    });
    player.reset();
    main();
  }



  /* Go ahead and load all of the images we know we're going to need to
   * draw our game level. Then set init as the callback method, so that when
   * all of these images are properly loaded our game will start.
   */
  Resources.load([
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png',
    'images/Star.png',
    'images/enemy-bug.png',
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
  ]);
  Resources.onReady(init);

  /* Assign the canvas' context object to the global variable (the window
   * object when run in a browser) so that developer's can use it more easily
   * from within their app.js files.
   */
  global.ctx = ctx;
  global.animate = animate;
  global.reset = reset;


})(this);