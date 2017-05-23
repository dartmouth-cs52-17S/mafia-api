import mongoose, { Schema } from 'mongoose';
import Player from './player_model';

const GameSchema = new Schema({
  currentGameStage: Number,
  currentStageStartTime: Date,
  creator: String,
  players: [Schema.types.objectID],

}, {
  toJSON: {
    virtuals: true,
  },
});

const GameModel = mongoose.model('Game', GameSchema);

export default GameModel;
