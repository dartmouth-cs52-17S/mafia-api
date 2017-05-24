import mongoose, { Schema } from 'mongoose';

const PlayerSchema = new Schema({
  game: { type: Schema.types.objectID, ref: 'Game' },
  user: { type: Schema.types.objectID, ref: 'User' },
  status: { type: Boolean, default: true },
  role: String,
}, {
  toJSON: {
    virtuals: true,
  },
});

const PlayerModel = mongoose.model('Player', PlayerSchema);

export default PlayerModel;


// action (heal, vote, kill, detect, )
