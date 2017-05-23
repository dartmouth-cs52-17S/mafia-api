import jwt from 'jwt-simple';
import User from '../models/user_model';

export const signUp = (req, res, next) => {
  const username = req.body.username;

  // If the username field is blank, return a 422 error
  if (!username) {
    res.status(422).send('You must provide a username');
    return;
  }

  // If the username is taken, return a 409 error
  User.findOne({ username }, (err, data) => {
    if (err) {
      res.status(500).json({ err });
      return;
    } else if (data) {
      res.status(409).send('This username is already registered');
      return;
    }

    const user = new User();
    user.username = req.body.username;
    user.wins = 0;
    user.losses = 0;
    user.pic = '';
    user.badges = [];
    user.roundsAsMafia = 0;
    user.roundsAsVillager = 0;
    user.roundsAsPolice = 0;
    user.roundsAsDoctor = 0;
    user.isAlive = true;
    user.currentRole = '';
    user.save()
    .then((result) => {
      res.send({ token: tokenForUser(result) });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
  });
};

export const signin = (req, res, next) => {
  console.log(req.user);
  res.send({ token: tokenForUser(req.user) });
};


// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET);
}

export const getUsers = (req, res) => {
  User.find({}).then((data) => {
    res.send(data);
  });
};

export const getUser = (req, res) => {
  User.findById(req.params.id).then((data) => {
    res.send(data);
  });
};
