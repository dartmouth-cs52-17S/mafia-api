import mongoose, { Schema } from 'mongoose';


const PlayerSchema = new Schema({
  // game: { type: Schema.Types.ObjectId, ref: 'Game' },
  // user: { type: Schema.Types.ObjectId, ref: 'User' },
  game: String,
  user: String,
  status: { type: Boolean, default: true },
  role: String,
  name: String,
  voteCount: Number,
}, {
  toJSON: {
    virtuals: true,
  },
});

const PlayerModel = mongoose.model('Player', PlayerSchema);

export default PlayerModel;
