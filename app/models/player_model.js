import mongoose, { Schema } from 'mongoose';
import User from './user_model';
import Game from './game_model';

const PlayerSchema = new Schema({
  game: Game.types.objectID,
  user: User.types.objectID,
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
