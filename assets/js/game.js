  var snake, apple,bonus, squareSize, bonusSquareSize, score, speed,
    updateDelay, direction, new_direction,
    addNew, cursors, scoreTextValue, speedTextValue, textStyle_Key, textStyle_Value,
      widthGame,heigthGame,historicalScore = [], intervalVar,intervalVarBonus, timeRandomGap,timeRandomGapBonus,music;

var Game = {
    
    preload : function() {
        // Here we load all the needed resources for the level.
        // In our case, that's just two squares - one for the snake body and one for the apple.
        game.load.image('snake', 'assets/images/snake1.png');
        game.load.image('apple', 'assets/images/apple2.png');
        game.load.image('bonus', 'assets/images/bonus2.png');
    },
    
    randomIntervalApple : function(){
        intervalVar = setInterval(function(){
            apple.destroy();
            // Make a new one.
            let randomX = Math.floor(Math.random() * 40 ) * squareSize,
            randomY = Math.floor(Math.random() * 30 ) * squareSize;
            // Add a new apple.
            apple = game.add.sprite(randomX, randomY, 'apple');
        },timeRandomGap);
    },
    
    randomIntervalBonus : function(){
        intervalVarBonus = setInterval(function(){
            bonus.destroy();
            // Make a new one.
            let randomX = Math.floor(Math.random() * 40 ) * bonusSquareSize,
            randomY = Math.floor(Math.random() * 30 ) * bonusSquareSize;
            // Add a new apple.
            bonus = game.add.sprite(randomX, randomY, 'bonus');
        },timeRandomGapBonus);
    },

    create : function() {

        // By setting up global variables in the create function, we initialise them on game start.
        // We need them to be globally available so that the update function can alter them.

        snake = [];                     // This will work as a stack, containing the parts of our snake
        apple = {};                     // An object for the apple;
        bonus = {};                     // An object for the bonus;
        squareSize = 16;                // The length of a side of the squares. Our image is 16x16 pixels.
        bonusSquareSize = 16;                // The length of a side of the bonus squares. Our image is 28x28 pixels.
        score = 0;                      // Game score.
        speed = 0;                      // Game speed.
        updateDelay = 0;                // A variable for control over update rates.
        direction = 'right';            // The direction of our snake.
        new_direction = null;           // A buffer to store the new direction into.
        addNew = false;                 // A variable used when an apple has been eaten.
        widthGame=800;
        heigthGame=800;
        timeRandomGap = Math.floor(Math.random() * (11000 - 4000)) + 4000;
        timeRandomGapBonus = Math.floor(Math.random() * (6000 - 1000)) + 1000;

        // Set up a Phaser controller for keyboard input.
        cursors = game.input.keyboard.createCursorKeys();

        game.stage.backgroundColor = '#f7df9c';

        // Generate the initial snake stack. Our snake will be 10 elements long.
        for(var i = 0; i < 1; i++){
            snake[i] = game.add.sprite(160+i*squareSize, 160, 'snake');  // Parameters are (X coordinate, Y coordinate, image)
        }


        // Genereate the first apple.
        this.generateApple();
        
        // Genereate the first bonus.
        this.generateBonus();
        
        this.randomIntervalApple();
        
        this.randomIntervalBonus();

        // Add Text to top of game.
        textStyle_Key = { font: "bold 14px sans-serif", fill: "#2F4F4F", align: "center" };
        textStyle_Value = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };

        // Score.
        game.add.text(30, 20, "SCORE", textStyle_Key);
        scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
        // Speed.
        game.add.text(500, 20, "SPEED", textStyle_Key);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);
        
    },

    update: function() {

        // Handle arrow key presses, while not allowing illegal direction changes that will kill the player.        
        //Verify to previous score with the current score
        if(historicalScore.length>0 && historicalScore[historicalScore.length-1]<=score){
            if(textStyle_Value.fill=="#fff"){
                textStyle_Value.fill="#FF4500";
            }
        }
        
        if (cursors.right.isDown && direction!='left')
        {
            new_direction = 'right';
        }
        else if (cursors.left.isDown && direction!='right')
        {
            new_direction = 'left';
        }
        else if (cursors.up.isDown && direction!='down')
        {
            new_direction = 'up';
        }
        else if (cursors.down.isDown && direction!='up')
        {
            new_direction = 'down';
        }

        // A formula to calculate game speed based on the score.
        // The higher the score, the higher the game speed, with a maximum of 10;
        speed = Math.min(10, Math.floor(score/5));
        // Update speed value on game screen.
        speedTextValue.text = '' + speed;

        // Since the update function of Phaser has an update rate of around 60 FPS,
        // we need to slow that down make the game playable.

        // Increase a counter on every update call.
        updateDelay++;

        // Do game stuff only if the counter is aliquot to (10 - the game speed).
        // The higher the speed, the more frequently this is fulfilled,
        // making the snake move faster.
        if (updateDelay % (10 - speed) == 0) {

            // Snake movement

            var firstCell = snake[snake.length - 1],
                lastCell = snake.shift(),
                oldLastCellx = lastCell.x,
                oldLastCelly = lastCell.y;

            // If a new direction has been chosen from the keyboard, make it the direction of the snake now.
            if(new_direction){
                direction = new_direction;
                new_direction = null;
            }

            // Change the last cell's coordinates relative to the head of the snake, according to the direction.

            if(direction == 'right'){

                lastCell.x = firstCell.x + 16;
                lastCell.y = firstCell.y;
            }
            else if(direction == 'left'){
                lastCell.x = firstCell.x - 16;
                lastCell.y = firstCell.y;
            }
            else if(direction == 'up'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y - 16;
            }
            else if(direction == 'down'){
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y + 16;
            }

            // Place the last cell in the front of the stack.
            // Mark it as the first cell.

            snake.push(lastCell);
            firstCell = lastCell;

            // End of snake movement.

            // Increase length of snake if an apple had been eaten.
            // Create a block in the back of the snake with the old position of the previous last block (it has moved now along with the rest of the snake).
            if(addNew){
                snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
                addNew = false;
            }

            // Check for apple collision.
            this.appleCollision();
            
            // Check for bonus collision.
            this.bonusCollision();

            // Check for collision with self. Parameter is the head of the snake.
            this.selfCollision(firstCell);

            // Check with collision with wall. Parameter is the head of the snake.
            this.wallCollision(firstCell);

        }

    },

    generateApple: function(){

        // Chose a random place on the grid.
        // X is between 0 and 585 (39*16)
        // Y is between 0 and 435 (29*16)
        
        let randomX = Math.floor(Math.random() * 40 ) * squareSize,
        randomY = Math.floor(Math.random() * 30 ) * squareSize;

        // Add a new apple.
        apple = game.add.sprite(randomX, randomY, 'apple');
        
    },
    
    generateBonus: function(){

        // Chose a random place on the grid.
        // X is between 0 and 585 (39*28)
        // Y is between 0 and 435 (29*28)
        
        let randomX = Math.floor(Math.random() * 40 ) * bonusSquareSize,
        randomY = Math.floor(Math.random() * 30 ) * bonusSquareSize;

        // Add a new bonus.
        bonus = game.add.sprite(randomX, randomY, 'bonus');
        
    },

    appleCollision: function() {
        for (var i = 0; i < snake.length; i++) {
            if (
                snake[i].x < apple.x + apple.width &&
                snake[i].x + squareSize > apple.x &&
                snake[i].y < apple.y + apple.height &&
                snake[i].y + squareSize > apple.y
            ) {
                addNew = true;
                apple.destroy();
                this.generateApple();
                score++;
                scoreTextValue.text = score.toString();
                timeRandomGap = Math.floor(Math.random() * (11000 - 4000)) + 4000;
            }
        }
    },
    
    bonusCollision: function() {
        for (var i = 0; i < snake.length; i++) {
            if (
                snake[i].x < bonus.x + bonus.width &&
                snake[i].x + squareSize > bonus.x &&
                snake[i].y < bonus.y + bonus.height &&
                snake[i].y + squareSize > bonus.y
            ) {
                addNew = true;
                bonus.destroy();
                this.generateBonus();
                score += 9;
                scoreTextValue.text = score.toString();
            }
        }
    }
    ,

    selfCollision: function(head) {

        // Check if the head of the snake overlaps with any part of the snake.
        for(var i = 0; i < snake.length - 1; i++){
            if(head.x == snake[i].x && head.y == snake[i].y){
                historicalScore.push(score);
                // If so, go to game over screen.
                game.scale.setGameSize(800, 800);
                clearInterval(intervalVar);
                clearInterval(intervalVarBonus);
                game.state.start('Game_Over');
            }
        }

    },
    
    wallCollision: function(head) {
        // Check if the head of the snake is in the boundaries of the game field.
        if (head.x >= widthGame || head.x < 0 || head.y >= heigthGame || head.y < 0) {
            if (head.x < 0) {
                new_direction = 'right';
                head.x = snake[0].x;
            } else if (head.x >= widthGame) {
                new_direction = 'left';
                head.x = widthGame - squareSize;
            } else if (head.y >= heigthGame) {
                new_direction = 'up';
                head.y = heigthGame - squareSize;
            } else if (head.y < 0) {
                new_direction = 'down';
                head.y = snake[0].y;
            }
            // Reduce the game field size.
            heigthGame -= 50;
            widthGame -= 50;
    
            if (heigthGame < 300 || widthGame < 300) {
                game.scale.setGameSize(800, 800);
                clearInterval(intervalVar);
                clearInterval(intervalVarBonus);
                music = game.sound.stopAll();
                game.state.start('Game_Over');
            } else {
                game.scale.setGameSize(heigthGame, widthGame);
            }
        }
    }
    
};

