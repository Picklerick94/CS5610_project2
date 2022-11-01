import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
function MyMongoDB() {
  const myDB = {};
  const url =
    "mongodb+srv://jason:1234@cluster0.g3bcu3h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  const DB_NAME = "businessCardDB";
  const USER_COLLECTION = "users";

  //Chun-Wei Tseng
  myDB.authenticate = async (user) => {
    let client;
    try {
      client = new MongoClient(url);
      const db = client.db(DB_NAME);
      const usersCol = db.collection(USER_COLLECTION);
      console.log("searching for", user);
      const res = await usersCol.findOne({ username: user.loginName });
      console.log("res", res);

      if (res) {
        if (res.password === user.loginPassword) {
          console.log("true");
          return true;
        }
      }
      return false;
    } finally {
      console.log("Closing Connection");
      client.close();
    }
  };

  myDB.createUser = async (user) => {
    let client = new MongoClient(url);
    try {
      const db = client.db(DB_NAME);
      const usersCol = db.collection(USER_COLLECTION);
      console.log("creating user", user);
      const res = await usersCol.findOne({
        $or: [
          { name: user.name },
          { username: user.username },
          { email: user.email },
        ],
      });

      console.log("return-------------", res);
      if (res) {
        console.log("User Already Exist");
        return true;
      }
      usersCol.insertOne(user);
      console.log("User Added!");
      console.log("Insert Complete:", user);
      const d = await usersCol.findOne({ name: user.name });
      console.log("check if user added", d);
      return false;
    } finally {
      console.log("Closing Connection");
      client.close();
    }
  };

  myDB.getUser = async (_email) => {
    let client;
    try {
      client = new MongoClient(url);
      const db = client.db(DB_NAME);
      const usersCol = db.collection(USER_COLLECTION);
      const res = await usersCol.findOne({ email: _email });
      return res;
    } finally {
      client.close();
    }
  };

  return myDB;
}

export default MyMongoDB();
