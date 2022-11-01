//Chun-Wei Tseng
import express from "express";
// import { MongoCursorInUseError } from 'mongodb';
export const PORT = process.env.PORT || 3000;
import myDB from "../db/usersDB.js";
const loginrouter = express.Router();

loginrouter.post("/login", async (req, res) => {
  const user = req.body;

  if (await myDB.authenticate(user)) {
    req.session.user = user.user;
    res.redirect("/?msg='authenticated'");
  }
});

loginrouter.get("/login", (req, res) => {
  res.redirect("/login.html");
});

// loginrouter.get("/register", (req, res) => {
//   res.redirect("/login.html");
// });

loginrouter.post("/register", async (req, res) => {
  const user = req.body;
  const ret = await myDB.createUser({
    name: user.registerName,
    username: user.registerUsername,
    email: user.registerEmail,
    password: user.registerPassword,
  });
  console.log("ret", ret);
  res.json({ isRegistered: ret });
  // console.log('')
  // return ret;
});

loginrouter.get("/getuser", function (req, res) {
  res.json({ user: req.session.user });
});

export default loginrouter;
