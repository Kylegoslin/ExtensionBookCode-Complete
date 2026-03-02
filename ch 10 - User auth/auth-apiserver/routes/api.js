var express = require("express");
var router = express.Router();

const jwt = require("jsonwebtoken");
router.get("/", function (req, res, next) {
  res.send("The API was called!");
});



// -----------------------------------------------------------
//
//    Register
// -----------------------------------------------------------
router.get("/register", function (req, res, next) {
  console.log("/register call success");
  const email = req.query.email;
  const pass = req.query.pass;

  const { MongoClient } = require("mongodb");
  const uri = "mongodb://root:example@127.0.0.1:27017/";
  const client = new MongoClient(uri);
  async function run() {
    try {
      const database = client.db("extension_auth");
      const collection = database.collection("users");
      const cursor = await collection.insertOne({ email: email, pass: pass });
      res.json({ status: "registered" });
    } finally {
      res.json({ status: "error" });
      await client.close();
    }
  }
  run().catch(console.dir);
});


// -----------------------------------------------------------
//
//    Login
// -----------------------------------------------------------
router.get("/login", function (req, res, next) {
  console.log("/login call success");
  const email = req.query.email;
  const pass = req.query.pass;

  const { MongoClient, ObjectId } = require("mongodb");
  const uri = "mongodb://root:example@127.0.0.1:27017/";
  const client = new MongoClient(uri);

  async function run() {
    try {
      const database = client.db("extension_auth");
      const collection = database.collection("users");
      const results = await collection.findOne({ email: email });
      console.log(results);

      if (results) {
        console.log("found record");

        if (pass == results.pass) {
          console.log("password valid");

          console.log("inserting session record");
          const database = client.db("extension_auth");
          const collection = database.collection("sessions");

          let newToken = jwt.sign(
            {
              data: email,
            },
            "secretCode",
            { expiresIn: "1h" }
          );

          await collection.insertOne({ token: newToken });

          res.json({ token: newToken });
        } else {
          res.json({ token: 0 });
        }
      } else {
        res.json({ token: 0 });
      }
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});




// -----------------------------------------------------------
//
//    Validate
// -----------------------------------------------------------
router.get("/validate", function (req, res, next) {
  console.log("/login call success");

  const token = req.headers.authorization;

  const { MongoClient, ObjectId } = require("mongodb");
  const uri = "mongodb://root:example@127.0.0.1:27017/";
  const client = new MongoClient(uri);

  async function run() {
    const database = client.db("extension_auth");
    const collection = database.collection("sessions");

    const record = await collection.findOne({ token: token });

    if (record) {
      console.log("token exists in db");

      jwt.verify(token, "secretCode", function (err, decoded) {
        if (err) {
          res.json({ result: "invalid" });
        } else {
          res.json({ result: decoded.data, exp: decoded.exp });
        }
      });
    } else {
      res.json({ result: "invalid" });
    }
  }

  run();
});


// -----------------------------------------------------------
//
//    Logout
// -----------------------------------------------------------
router.get("/logout", function (req, res, next) {
  console.log("/login call success");
  //const token = req.query.token;

  const auth = req.headers.authorization;

  console.log("Token" + auth);

  async function run() {
    const { MongoClient, ObjectId } = require("mongodb");
    const uri = "mongodb://root:example@127.0.0.1:27017/";
    const client = new MongoClient(uri);

    const database = client.db("extension_auth");
    const collection = database.collection("sessions");

    const record = await collection.deleteOne({ token: auth });

    res.json({ result: "loggedout" });
  }

  run();
});


module.exports = router;
