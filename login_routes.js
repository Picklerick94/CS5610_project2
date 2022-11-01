//Chun-Wei Tseng
import express from 'express';
import { MongoCursorInUseError } from 'mongodb';
export const PORT = process.env.PORT || 3000;
import myDB from '../db/MyMongoDB.js';
const router = express.Router();

router.post('/login', async (req, res) => {
  const user = req.body;

  if (await myDB.authenticate(user)) {
    req.session.user = user.user;
    res.redirect("/?msg='authenticated'");
  }
});

router.get('/login', (req, res) => {
  res.redirect('/login.html');
});

router.get('/register', (req, res) => {
  res.redirect('/login.html');
});

router.post('/register', async (req, res) => {
  const user = req.body;
  const ret = await myDB.createUser({
    name: user.registerName,
    username: user.registerUsername,
    email: user.registerEmail,
    password: user.registerPassword,
  });
  res.json({ isRegistered: ret });
  // console.log('')
  // return ret;
});

router.get('/getuser', function (req, res) {
  res.json({ user: req.session.user });
});

export default router;
