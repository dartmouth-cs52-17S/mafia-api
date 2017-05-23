import { Router } from 'express';
import * as Users from './controllers/user_controller';
import * as Player from './controllers/player_controller';


const router = Router();

router.post('/signin', Users.signin);
router.post('/signup', Users.signUp);
router.post('/makeplayers', Player.createPlayer);

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our mafia game api!' });
});

router.get('/users', (req, res) => {
  Users.getUsers(req, res);
});

router.get('/players', (req, res) => {
  Player.getPlayers(req, res);
});

router.put('/users', Users.assignRoles);

router.get('/user/:id', (req, res) => {
  Users.getUser(req, res);
});

router.get('/players/:id', (req, res) => {
  Player.getPlayer(req, res);
});

export default router;
