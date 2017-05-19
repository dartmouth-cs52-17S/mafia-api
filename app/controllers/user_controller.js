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
      res.status(409).send('This email address is already registered');
      return;
    }

    const user = new User();
    user.username = req.body.username;
    user.wins = 0;
    user.losses = 0;
    user.save((err) => {
      if (err) res.sendStatus(500);
    });
  });
};

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
