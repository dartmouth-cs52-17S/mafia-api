import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
  stage: Number,
  players: [String],
  mafia: [String],
  villagers: [String],
  doctor: String,
  police: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

const GameModel = mongoose.model('Game', GameSchema);

export default GameModel;
