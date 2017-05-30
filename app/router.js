import { Router } from 'express';
import * as Users from './controllers/user_controller';
import * as Player from './controllers/player_controller';
import * as Games from './controllers/game_controller';
import { requireAuth } from './services/passport';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our mafia game api!' });
});

router.post('/getNameFromFBID', Users.getNameFromFBID);

router.get('/users', Users.getUsers);

router.get('/user/:id', Users.getUser);

router.post('/signin', Users.authUser);


router.post('/games', requireAuth, Games.createGame);

router.get('/games', Games.fetchGames);


router.put('/game/stage/:id', Games.updateStage);

router.put('/game/end/:id', Games.endGame);

router.put('/game/:id', requireAuth, Games.updatePlayers);

router.get('/game/:id', Games.getGame);

router.delete('/game/delete/:id', Games.deleteGame);

router.put('/game/selection/:id', Games.tempSelection);

router.put('/game/check/:id', Games.checkSelection);


router.get('/players/:gameID', Player.getPlayers);

router.post('/players/:gameID', Player.createPlayers);

router.get('/player/:id', Player.getPlayer);

router.put('/players/kill/:id', Player.killPlayer);

router.put('/players/heal/:id', Player.healPlayer);

router.put('/player/vote/:id', Player.voteKill);


export default router;
