import Game from '../models/game_model';

export const createGame = (req, res, next) => {
  console.log('createGame');
  const game = new Game();
  game.currentGameStage = 0;
  game.players = [req.user._id];
  game.creator = req.user._id;
  game.save()
  .then((response) => {
    res.send(response);
  })
  .catch((err) => {
    if (err) res.sendStatus(500);
  });
};

export const updatePlayers = (req, res) => {
  Game.findById(req.body.gameID).then((game) => {
    if (game.creator === `${req.user._id}`) {
      res.send();
    } else {
      game.players = game.players.push(req.user);
      game.save()
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.sendStatus(500);
      });
    }
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

export const getGames = (req, res) => {
  Game.find({}).then((data) => {
    res.send(data);
  });
};
