const mongoose = require('mongoose');

const Game = mongoose.model('Game');

exports.saveGame = (req, res) => {
  const game = new Game();

  game.gameId = req.params.id;
  game.gameRound = req.body.gameRound;
  game.gameOwner = req.body.gameOwner;
  game.gameWinner = req.body.gameWinner;
  game.gamePlayers = req.body.gamePlayers;
  game.gameEnded = req.body.gameEnded;
  game.timePlayed = req.body.timePlayed;
  game.save((err) => {
    if (err) {
      res.status(400).json(err);
    }
  });
};
