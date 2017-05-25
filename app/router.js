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

router.get('/players', Player.getPlayers);

// router.put('/users', Users.assignRoles);

router.post('/games', requireAuth, Games.createGame);

router.put('/game/:id', requireAuth, Games.updatePlayers);

router.get('/game/:id', Games.getGame);

router.get('/games', Games.getGames);

router.post('/players', Player.createPlayers);

router.get('/players/:id', Player.getPlayer);

export default router;
