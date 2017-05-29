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

export const getGames = (req, res) => {
  Game.find({}).then((data) => {
    res.send(data);
  });
};

export const updatePlayers = (req, res) => {
  console.log(`updatePlayers ${req.params.id}`);
  Game.findById(req.params.id).then((game) => {
    if (game.creator === `${req.user._id}`) {
      res.send(game.players);
    } else {
      game.players = [...game.players, req.user._id];
      game.save()
      .then((response) => {
        res.send(`${response}`);
      })
      .catch((err) => {
        res.sendStatus(500);
      });
    }
  }).catch((error) => { console.log(error); });
};

export const getGame = (req, res) => {
  console.log(`getGame ${req.params.id}`);

  Game.findById(req.params.id)
  .populate('players')
  .exec((err, game) => {
    if (err) {
      console.log(err);
    } else if (game) {
      console.log(`and the game is ${game}`);
      res.send({ id: game._id, players: game.players, creator: game.creator, stage: game.currentGameStage });
    }
  });
};

export const getPlayers = (req, res) => {
  Game.find({}).then((data) => {
    res.send(data);
  }).catch((err) => { console.log(err); });
};

export const endGame = (id) => {
  console.log('update ifOver');
  return Game.findById(id).then((game) => {
    game.isOver = true;
    return game.save();
  });
};

export const updateStage = (id, stage) => {
  console.log('updateStage');
  return Game.findById(id).then((game) => {
    if (stage) {
      game.currentGameStage = stage;
    } else {
      game.currentGameStage += 1;
    }
    return game.save();
  });
};
