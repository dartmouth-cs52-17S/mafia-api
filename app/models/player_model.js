import mongoose, { Schema } from 'mongoose';


const PlayerSchema = new Schema({
  game: String,
  user: String,
  status: { type: Boolean, default: true },
  role: String,
  name: String,
  voteCount: { type: Number, default: 0 },
}, {
  toJSON: {
    virtuals: true,
  },
});

const PlayerModel = mongoose.model('Player', PlayerSchema);

export default PlayerModel;
