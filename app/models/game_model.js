import mongoose, { Schema } from 'mongoose';
import User from './user_model';

const GameSchema = new Schema({
  currentGameStage: Number,
  currentStageStartTime: Date,
  creator: String,
  players: [User.types.objectID], // [ user1,  user2, user3 ]
  roles: [String],    // [ mafia, detective, villager ]
  playerStatus: [Boolean], // true is alive, false is dead
}, {
  toJSON: {
    virtuals: true,
  },
});

const GameModel = mongoose.model('Game', GameSchema);

export default GameModel;

// action (heal, vote, kill, detect, )
