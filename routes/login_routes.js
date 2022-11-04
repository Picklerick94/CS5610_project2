//Chun-Wei Tseng
import express from "express";
import myDB from "../db/usersDB.js";

const loginrouter = express.Router();

loginrouter.post("/login", async (req, res) => {
  const user = req.body;
  const ret = await myDB.authenticate(user);
  if (ret === true) {
    req.session.user = user.loginName;
  }
  res.json({ user: user.loginName, isLoggedIn: ret });
});

loginrouter.get("/login", (req, res) => {
  res.redirect("/login.html");
});

loginrouter.get("/register", (req, res) => {
  res.redirect("/login.html");
});

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
});

loginrouter.get("/getusers", function (req, res) {
  console.log("getusers get session", req.session.user);
  res.json({ user: req.session.user });
});

loginrouter.get("/logout", function (req, res) {
  req.session.user = undefined;
  console.log("logout session", req.session.user);
  if (req.session.user === undefined) {
    res.json({ isLoggedOut: true });
  } else {
    res.json({ isLoggedOut: false });
  }
});

export default loginrouter;
