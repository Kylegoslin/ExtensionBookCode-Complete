var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

router.get("/", function (req, res, next) {
  res.send("The API was called!");
});

// -----------------------------------------------------------
//
//    Register
// -----------------------------------------------------------
router.get("/register", function (req, res, next) {
  console.log("/register call success");

  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const email = req.query.email;
  const password = req.query.password;

  // Perform validation here

  // bcrypt
  const saltRounds = 10;

  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      // Store hash in your password DB.
      console.log(hash);

      const { MongoClient } = require("mongodb");
      const uri = "mongodb://root:example@127.0.0.1:27017/";
      const client = new MongoClient(uri);

      async function run() {
        try {
          const database = client.db("extension_password_test");
          const collection = database.collection("users");

          const cursor = await collection.insertOne({
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: hash, // saving the hash not the password
          });
          res.json({ status: "registered" });
        } catch {
          res.json({ status: "error" });
        } finally {
          await client.close();
        }
      }
      run();
    }); // genSalt
  }); // insert
}); // route

router.get("/login", function (req, res, next) {
  console.log("/login call success");
  const useremail = req.query.email;
  const pass = req.query.password;

  const { MongoClient, ObjectId } = require("mongodb");
  const uri = "mongodb://root:example@127.0.0.1:27017/";
  const client = new MongoClient(uri);

  async function run() {
    try {
      const database = client.db("extension_password_test");
      const collection = database.collection("users");
      const results = await collection.findOne({ email: useremail });
      console.log(results);



      if (results) {
        const hash = results.password;
        console.log("found record, comparing....");

        bcrypt.compare(pass, hash, function (err, result) {
          if (result == true) {
            res.json({ status: "valid" });
          } else {
            res.json({ status: "invalid" });
          }
        });
      } else {
        res.json({ status: "error" });
      }
    } catch {
      res.json({ status: "error" });
    } finally {
        await client.close()
    }
  } /// run
  run();
}); // route

module.exports = router;
