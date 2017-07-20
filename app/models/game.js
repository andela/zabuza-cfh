const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  gameId: { type: String, required: true },
  gameRound: { type: Number, default: 0 },
  gameOwner: { type: Object, required: true },
  gameWinner: { type: Object, required: true },
  gamePlayers: { type: Array, default: [] },
  gameEnded: { type: Boolean, default: false },
  timePlayed: { type: Date, default: new Date().toUTCString() }
});

mongoose.model('Game', GameSchema);
