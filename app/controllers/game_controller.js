import Game from '../models/game_model';

export const createGame = (req, res, next) => {
  console.log('createGame');
  const game = new Game();
  game.currentGameStage = 0;
  game.players = [req.user._id];
  game.creator = req.user._id;
  game.save()
  .then((response) => {
    console.log(response);
    res.send(response);
  })
  .catch((err) => {
    if (err) res.sendStatus(500);
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

export const updatePlayers = (req, res) => {
  console.log('updatePlayers');
  Game.findById(req.params.id).then((game) => {
    console.log(`${req.user._id}`);
    if (game.creator === `${req.user._id}`) {
      console.log('user was creator');
      res.send(game.players);
    } else {
      game.players = [...game.players, req.user._id];
      console.log(`players array is ${game.players}`);
      game.save()
      .then((response) => {
        console.log(`the response is ${response}`);
        res.send(`${response}`);
      })
      .catch((err) => {
        res.sendStatus(500);
      });
    }
  }).catch((error) => { console.log(error); });
};

export const getGame = (req, res) => {
  console.log('getGame');
  console.log('here?');
  console.log(req.params.id);
  Game.findById(req.params.id)
  .populate('players')
  .exec((err, game) => {
    if (err) {
      console.log(err);
    } else if (game) {
      res.send({ id: game.id, players: game.players, creator: game.creator });
    }
  });
};

export const getPlayers = (req, res) => {
  Game.find({}).then((data) => {
    res.send(data);
  }).catch((err) => { console.log(err); });
};

export const updateStage = (req, res) => {
  console.log('updateStage');
  Game.findById(req.params.id).then((game) => {
    if (req.body.stage) {
      game.currentGameStage = req.body.stage;
    } else {
      game.currentGameStage += 1;
    }
    game.save().then((result) => {
      res.json(result);
    }).catch((err) => { console.log(err); });
  }).catch((err) => { console.log(err); });
};
