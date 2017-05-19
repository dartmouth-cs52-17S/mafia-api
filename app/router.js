import { Router } from 'express';
import * as Users from './controllers/user_controller';

const router = Router();

router.post('/signup', Users.signUp);

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our mafia game api!' });
});

router.get('/users', (req, res) => {
  Users.getUsers(req, res);
});

export default router;
