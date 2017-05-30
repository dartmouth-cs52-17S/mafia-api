import mongoose, { Schema } from 'mongoose';

const GameSchema = new Schema({
  currentGameStage: Number,
  currentStageStartTime: Date,

  isOver: Boolean,
  creator: String,
  players: [{ type: Schema.Types.ObjectId, ref: 'User' }], // [ user1,  user2, user3 ]
  mafiaSelection: String,
  doctorSelction: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

const GameModel = mongoose.model('Game', GameSchema);

export default GameModel;
