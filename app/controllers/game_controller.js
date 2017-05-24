import Game from '../models/game_model';

export const createGame = (req, res, next) => {
  const game = new Game();
  game.currentGameStage = 0;
  game.players = [req.body.fbid];
  game.creator = req.body.fbid;
  game.save()
  .then((response) => {
    res.send(response);
  })
  .catch((err) => {
    if (err) res.sendStatus(500);
  });
};

export const updatePlayers = (req, res) => {
  Game.findOne({ creator: req.body.fbid }).then((game) => {
    console.log(game);
    game.players = [...game.players, req.body.fbid];
    res.send(req.body.fbid);
  });
};

export const getPlayers = (req, res) => {
  Game.find({}).then((data) => {
    res.send(data);
  });
};

// export const getPlayer = (req, res) => {
//   Game.findById(req.username).then((data) => {
//     res.send(data);
//   });
// };

// from stackoverflow: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffle = (players) => {
  let currentIndex = players.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // swap
    const temp = players[currentIndex];
    players[currentIndex] = players[randomIndex];
    players[randomIndex] = temp;
  }
  return players;
};

// static: 0th - mafia, 1st - doctor
export const assignRole = (req, res, next) => {
  Game.findById().then((game) => {
    // const shuffledArray = shuffle(game.players);
    shuffle(game.players).then((shuffledPlayers) => {
      game.players = shuffledPlayers;
      game.save();
    });
  });
};

export const getGames = (req, res) => {
  Game.find({}).then((data) => {
    res.send(data);
  });
};
