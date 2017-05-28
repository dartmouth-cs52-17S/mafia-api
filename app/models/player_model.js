import mongoose, { Schema } from 'mongoose';


const PlayerSchema = new Schema({
  // game: { type: Schema.Types.ObjectId, ref: 'Game' },
  // user: { type: Schema.Types.ObjectId, ref: 'User' },
  game: String,
  user: String,
  role: String,
  name: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

const PlayerModel = mongoose.model('Player', PlayerSchema);

export default PlayerModel;
