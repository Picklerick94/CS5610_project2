import express from "express";
import myDB from "../db/MyMongoDB.js";

const router = express.Router();

router.post("/createNewCard", async (req, res) => {
  const user = req.body;
  if (await myDB.authenticate(user)) {
    req.session.user = user.username;
    await myDB.createCard(user);
    res.redirect("/?msg=authenticated");
    console.log("successful rediect");
  } else {
    res.redirect("/?msg=error authenticated");
    console.log("rediect failure");
  }
});

// router.get("/users", (req, res) => {
//   res.send("hello ");
// });

router.get("/getUsers", (req, res) => {
  res.json({ user: req.session.user });
});

router.get("/getCards", async (req, res) => {
  const current = req.session.user;
  if (current !== undefined) {
    const ret = await myDB.fetchingCards(current);
    res.send(ret);
  } else {
    res.send({});
  }
});

router.get("/deleteCard/:id", async (req, res) => {
  const id = req.params.id;
  console.log("router delete");
  if (id !== undefined) {
    console.log("router id", id);
    await myDB.deleteCard(id);
    res.json({ id: id });
  } else {
    console.log("undefined");
    res.json({});
  }
  // res.send("delete id fail");
  // if (id !== undefined) {
  //   const ret = await myDB.deleteCard(id);
  //   res.send(ret);
  // } else {
  //   res.send({});
  // }
});

export default router;
