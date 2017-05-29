import FB from 'fb';
import jwt from 'jwt-simple';
import dotenv from 'dotenv';
import User from '../models/user_model';

dotenv.config({ silent: true });

export const authUser = (req, res) => {
  // res.send({ token: tokenForUser(req.body.token) });
  FB.api('/me', { access_token: req.body.authData.accessToken }, (response) => {
    User.findOne({ name: response.name }, (err, data) => {
      if (!err && !data) {
        const user = new User();
        user.name = response.name;
        user.facebookID = response.id;
        user.wins = 0;
        user.losses = 0;
        user.pic = '';
        user.badges = [];
        user.roundsAsMafia = 0;
        user.roundsAsVillager = 0;
        user.roundsAsPolice = 0;
        user.roundsAsDoctor = 0;
        user.save()
          .then((result) => {
            res.send({ token: tokenForUser(user._id), user });
          })
          .catch((error) => {
            console.log(error);
          });
      } else if (data) {
        res.send({ token: tokenForUser(data._id), user: data });
      }
    });
  });
};

export const getNameFromFBID = (req, res) => {
  User.findOne({ facebookID: req.body.fbid })
    .then((data) => {
      res.send(data);
    });
};

export const getUsers = (req, res) => {
  User.find({}).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
};

export const getUser = (req, res) => {
  User.findById(req.params.id).then((data) => {
    res.send(data);
  }).catch((err) => {
    res.send(err);
  });
};

// export const assignRoles = (req, res) => {
//   res.done();
// };

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user, iat: timestamp }, process.env.AUTH_SECRET);
}
