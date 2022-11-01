import { MongoClient } from "mongodb";

function MyMongoDB() {
  const myDB = {};
  const url =
    "mongodb+srv://jason:1234@cluster0.g3bcu3h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

  const DB_name = "businessCardDB";
  const collections = "user";

  myDB.authenticate = async (user) => {
    const client = new MongoClient(url);
    try {
      const database = client.db(DB_name);
      const cardsCol = database.collection(collections);
      const query = { username: user.username };
      const cardUser = await cardsCol.findOne(query);
      return true;
      // if (cardUser !== null) ;
      // return false;
    } finally {
      // await client.close();
    }
  };

  myDB.createCard = async (user) => {
    const client = new MongoClient(url);
    try {
      const database = client.db(DB_name);
      const cardsCol = database.collection(collections);
      const query = { username: user.username };
      const cardname = user.cardname;
      const cardcontent = user.cardcontent;
      cardsCol.updateOne(
        query,
        {
          $set: { [`cards.${cardname}`]: cardcontent },
        },
        { upsert: true }
      );
      const cardUser = await cardsCol.findOne(query);
      console.log(cardUser);
    } finally {
      // await client.close();
    }
  };

  myDB.fetchingCards = async (user) => {
    const client = new MongoClient(url);
    try {
      const database = client.db(DB_name);
      const cardsCol = database.collection(collections);
      const query = { username: user };
      const cardUser = await cardsCol.findOne(query);
      const cards = cardUser.cards;
      return cards;
    } finally {
      // await client.close();
    }
  };

  myDB.deleteCard = async (id) => {
    const client = new MongoClient(url);
    try {
      const database = client.db(DB_name);
      const cardsCol = database.collection(collections);
      const query = { username: "jason" };
      const cardUser = await cardsCol.findOne(query);

      console.log(cardUser);
      console.log("middle id", id);
      const key = "cards." + id.slice(1, 3);
      console.log("key==", key);
      cardsCol.deleteOne({ key: null });
      const ncardUser = await cardsCol.findOne(query);
      console.log(ncardUser);
    } finally {
      // await client.close();
    }
  };
  return myDB;
}

export default MyMongoDB();
