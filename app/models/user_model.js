import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  facebookID: { type: String, unique: true, lowercase: true },
  wins: Number,
  losses: Number,
  pic: String,
  badges: [String],
  roundsAsMafia: Number,
  roundsAsVillager: Number,
  roundsAsDoctor: Number,
  roundsAsPolice: Number,
}, {
  toJSON: {
    virtuals: true,
  },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
