// Kuan Tsa Chen
import express from "express";
import myDB from "../db/cardsDB.js";

const cardrouter = express.Router();

cardrouter.post("/createCard", async (req, res) => {
  const card = req.body;
  // req.session.user = "jason";
  console.log("current user in createcard", req.session.user);
  const ret = await myDB.createCard(req.session.user, card);
  if (ret) {
    res.redirect("/?msg=creart card sucessfully");
  } else {
    res.redirect("/?msg=creart card failure");
  }
});

cardrouter.get("/getCards", async (req, res) => {
  const current = req.session.user;
  if (current !== undefined) {
    const ret = await myDB.fetchingCards(current);
    res.send(ret);
  } else {
    res.send({});
  }
});

cardrouter.get("/deleteCard/:id", async (req, res) => {
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
});

cardrouter.post("/updateCard/:id", async (req, res) => {
  const currentUser = req.session.user;
  const id = req.params.id;
  const card = req.body;
  console.log("CU", currentUser);
  console.log("ID", id);
  console.log("CARD", card);

  if (currentUser !== undefined) {
    // console.log("router card", card);
    const ret = await myDB.updateCard(currentUser, id, card);
    if (ret) {
      res.redirect("/?msg=update card sucessfully");
    } else {
      console.log("update fetch failure");
      res.json({});
    }
  } else {
    console.log("User undefined");
    res.json({});
  }
});
export default cardrouter;
