import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
  currentGameStage: Number,
  currentStageStartTime: Date,
  creator: String,
  players: [String], // [ user1,  user2, user3 ]
}, {
  toJSON: {
    virtuals: true,
  },
});

const GameModel = mongoose.model('Game', GameSchema);

export default GameModel;

// action (heal, vote, kill, detect, )
