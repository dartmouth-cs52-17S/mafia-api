import Game from '../models/game_model';

export const createGame = (req, res, next) => {
  const game = new Game();
  game.currentGameStage = 0;
  game.players = [req.users];
  game.creator = req.user.creator;
  game.save((err) => {
    if (err) res.sendStatus(500);
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
