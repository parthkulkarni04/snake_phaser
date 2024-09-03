var Game_Over = {

    create : function() {
        // Display the "GAME OVER" text instead of an image.
        game.add.text(400, 150, "GAME OVER", { font: "bolder 48px sans-serif", fill: "#FF0000", align: "center" }).anchor.set(0.5);

        // Last Score Info.
        game.add.text(300, 250, "LAST SCORE", { font: "bolder 24px sans-serif", fill: "#FFFB00", align: "center"});
        game.add.text(500, 250, score.toString(), { font: "bolder 26px sans-serif", fill: "#fff", align: "center" });

        // Add a button or use an input listener to start the game again.
        this.input.onDown.add(this.startGame, this);  // Starts game on mouse click or touch.
    },

    startGame: function () {
        // Stop all sounds and start the actual game state.
        music = game.sound.stopAll();
        this.state.start('Game');
    }

};
