import Player from '../models/player_model';

// from stackoverflow: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffle = (roles) => {
  let currentIndex = roles.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // swap
    const temp = roles[currentIndex];
    roles[currentIndex] = roles[randomIndex];
    roles[randomIndex] = temp;
  }
  return roles;
};

const createPlayer = (userId, gameId, role) => {
  return new Promise((resolve, reject) => {
    const player = new Player({ user: userId, game: gameId, role });
    player.save((err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const createPlayers = (req, res) => {
  const roles = ['mafia', 'doctor', 'police', 'villager', 'villager', 'villager'];
  const shuffledRoles = shuffle(roles);
  Promise.all(shuffledRoles.map((role, idx) => { return createPlayer(req.body.userIds[idx], req.body.gameId, role); }))
  .then((players) => {
    res.send(players);
  })
  .catch((err) => {
    console.log(err);
  });
};

export const getPlayers = (req, res) => {
  Player.find({}).then((data) => {
    res.send(data);
  });
};

export const getPlayer = (req, res) => {
  Player.findById(req.params.id).then((data) => {
    res.send(data);
  });
};

export const healPlayer = (req, res) => {
  Player.findByIdAndUpdate(req.params.id, { status: true })
  .then((result) => {
    res.send(result);
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
};

export const killPlayer = (req, res) => {
  Player.findByIdAndUpdate(req.params.id, { status: false })
  .then((result) => {
    res.send(result);
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
