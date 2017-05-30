import Game from '../models/game_model';
import Player from '../models/player_model';

export const createGame = (req, res, next) => {
  const game = new Game();
  game.currentGameStage = 0;
  game.players = [req.user._id];
  game.creator = req.user._id;
  game.isOver = false;
  game.save()
  .then((response) => {
    res.send(response);
  })
  .catch((err) => {
    if (err) res.sendStatus(500);
  });
};

export const fetchGames = (req, res) => {
  Game.find({})
  .populate('players')
  .exec((err, data) => {
    if (err) console.log(err);
    else if (data) {
      res.json(data);
    }
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
  Game.findById(req.params.id)
  .populate('players')
  .exec((err, game) => {
    if (err) {
      console.log(err);
    } else if (game) {
      res.send({
        isOver: game.isOver,
        id: game._id,
        players: game.players,
        creator: game.creator,
        stage: game.currentGameStage,
      });
    }
  });
};

export const deleteGame = (req, res) => {
  Game.findByIdAndRemove({ _id: req.params.id })
  .then((result) => {
    res.json({ message: 'Deleted game.' });
  })
  .catch((error) => {
    res.status(500).json({ error });
  });
};

export const getPlayers = (req, res) => {
  Game.find({}).then((data) => {
    res.send(data);
  }).catch((err) => { console.log(err); });
};


export const endGame = (req, res) => {
  return Game.findById(req.params.id).then((game) => {
    game.isOver = true;
    game.save().then((response) => {
      res.json(response);
    }).catch((err) => {
      console.log(err);
    });
  });
};

export const updateStage = (id, stage) => {
  return Game.findById(id).then((game) => {
    if (stage) {
      game.currentGameStage = stage;
    } else {
      game.currentGameStage += 1;
    }
    return game.save();
  });
};

export const checkSelection = (req, res) => {
  return Game.findById(req.params.id).then((game) => {
    console.log(`MAFIA SELECTION IS ${game.mafiaSelection}`);
    console.log(`DOCTOR SELECTION IS ${game.doctorSelection}`);
    if (game.mafiaSelection !== game.doctorSelection) {
      console.log(`MAFIA SELECTION IS ${game.mafiaSelection}`);
      Player.findByIdAndUpdate(game.mafiaSelection, { status: false }, { new: true })
      .then((response) => {
        console.log(JSON.stringify(response));
        res.json(response);
      })
      .catch((error) => {
        res.status(500).json({ error });
      });
    }
  });
};

export const tempSelection = (req, res) => {
  Game.findById(req.params.id).then((game) => {
    if (req.body.type === 'mafiaSelection') {
      game.mafiaSelection = req.body.selection;
    } else {
      game.doctorSelection = req.body.selection;
    }
    game.save().then((response) => {
      res.json(response);
    }).catch((error) => {
      res.status(500).json({ error });
    });
  })
.catch((error) => {
  res.status(500).json({ error });
});
};
