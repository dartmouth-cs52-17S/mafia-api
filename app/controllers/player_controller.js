import Player from '../models/player_model';
import User from '../models/user_model';

// From stackoverflow: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffle = (roles) => {
  let currentIndex = roles.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // Swap
    const temp = roles[currentIndex];
    roles[currentIndex] = roles[randomIndex];
    roles[randomIndex] = temp;
  }
  return roles;
};

// Thanks to Ben Packer for help on the following two functions
const createPlayer = (userId, gameId, role) => {
  return new Promise((resolve, reject) => {
    Player.findOne({ user: userId, game: gameId }, (err, res) => {
      console.log(res);
      if (!res) {
        User.findById(userId).then((user) => {
          console.log(user);
          const player = new Player({ user: userId, game: gameId, name: user.name, role });
          player.save().then((result) => {
            console.log(result);
            return resolve(result);
          });
        }).catch((err) => { return reject(err); });
      } else {
        return resolve(res);
      }
    });
  });
};

export const createPlayers = (req, res) => {
  const roles = ['mafia', 'doctor', 'police', 'villager', 'villager', 'villager'];
  const shuffledRoles = shuffle(roles);
  Promise.all(req.body.userIds.map((userId, idx) => { return createPlayer(userId, req.body.gameId, shuffledRoles[idx]); }))
  .then((players) => {
    res.json(players);
  })
  .catch((err) => {
    console.log(err);
  });
};

export const getPlayers = (req, res) => {
  Player.find({ game: req.params.gameID }).then((data) => {
    res.json(data);
  });
};

export const getPlayer = (req, res) => {
  Player.findById(req.params.id).then((data) => {
    res.json(data);
  });
};

export const healPlayer = (req, res) => {
  Player.findByIdAndUpdate(req.params.id, { status: true })
  .then((result) => {
    res.json(result);
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
};

export const killPlayer = (req, res) => {
  Player.findByIdAndUpdate(req.params.id, { status: false })
  .then((result) => {
    res.json(result);
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
};

export const voteKill = (req, res) => {
  Player.findById(req.params.id).then((player) => {
    player.voteCount += 1;
    player.save().then((response) => {
      res.json(response);
    }).catch((error) => {
      res.status(500).json({ error });
    });
  })
.catch((error) => {
  res.status(500).json({ error });
});
};

export const updatePlayer = (req, res) => {
  Player.findByIdAndUpdate(req.body.userId, req.body)
  .then((result) => {
    res.send(result);
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
};

export const clearVotes = (req, res) => {
  Player.find({ game: req.params.id }).then((players) => {
    players.forEach((player) => {
      player.voteCount = 0;
      player.save().then((response) => {
        res.send(response);
      }).catch((err) => {
        res.sendStatus(500);
      });
    });
  });
};
