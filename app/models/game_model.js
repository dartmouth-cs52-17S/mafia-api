import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
  currentGameStage: Number,
  currentStageStartTime: Date,
  isOver: { type: Boolean, default: false },
  creator: String,
  players: [{ type: Schema.Types.ObjectId, ref: 'User' }], // [ user1,  user2, user3 ]
}, {
  toJSON: {
    virtuals: true,
  },
});

const GameModel = mongoose.model('Game', GameSchema);

export default GameModel;
