import { Router } from 'express';
import * as Users from './controllers/user_controller';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our mafia game api!' });
});

router.post('/getNameFromFBID', Users.getNameFromFBID);

router.get('/users', Users.getUsers);

router.get('/user/:id', Users.getUser);

router.post('/signin', Users.authUser);

router.put('/users', Users.assignRoles);

export default router;
