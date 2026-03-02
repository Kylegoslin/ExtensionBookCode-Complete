var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.send("The API was called!");
});

// -----------------------------------------------------------
//
//    Register new user
// -----------------------------------------------------------
router.get("/registerNewUser", function (req, res, next) {
  console.log("/register call success");

  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const email = req.query.email;


 // get a new api key


 
  res.json({ result: "valid" });
});



//
// Create an api key
//
// http://localhost:3000/api/createNewKey?userid=800
//
router.get("/createNewKey", function (req, res, next) {
  console.log("/createNewKey call success");

  // get the params from the request
  const userid = req.query.userid;
  const userip = req.ip;

  // check if the userid is added before proceeding
  if (userid.length == 0) {
    res.json({ status: "no user id" });
  } else {
    // call the database to check if the key is valid
    const key = generateRandomKey();

    const createTime = Math.floor(Date.now() / 1000);

    // insert into db
    async function runSaveToDb() {
      try {
        const { MongoClient } = require("mongodb");
        const uri = "mongodb://root:example@localhost:27017";
        const client = new MongoClient(uri);
        const database = client.db("keytracker");
        const col = database.collection("apikeys");

        let json = {
          apikey: key,
          create: createTime,
          userid: userid,
          ip: userip,
        };

        const result = await col.insertOne(json);
        console.log(result);
        client.close();
        res.json({ apikey: key });
      } catch (error) {
        res.json({ status: "error saving to db" });
        console.log("error inserting new record to db" + error);
      }
    }

    runSaveToDb();
  }
});

function generateRandomKey() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 40; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
}



//
// Validate an api key
//
// http://localhost:3000/api/validateKey?apikey=3f8u2npgdVvisT4d0WJPuAKfygZmVk4QeVMcHEnf
//
router.get("/validateKey", function (req, res, next) {
  console.log("/validateKey call success");

  // get the key from the request
  const apikey = req.query.apikey;

  // call the database to check if the key is valid
  async function runDbQuery() {
    try {
      const { MongoClient } = require("mongodb");
      const uri = "mongodb://root:example@localhost:27017";
      const client = new MongoClient(uri);
      const database = client.db("keytracker");
      const col = database.collection("apikeys");
      const result = await col.findOne({ apikey: apikey });
      console.log(result);
      client.close();

      let key = result.apikey;
      let createTime = result.create;

      const currentTime = Math.floor(Date.now() / 1000);
      let keyValid = false; // by default the key is not valid

        
        
        
      
      console.log("Current time" + currentTime)
      console.log("Create time " + createTime)
      
      console.log(currentTime-createTime)
      
      if ((currentTime-createTime) < 86400) {
        console.log("key valid");
        keyValid = true;
      } else {
	    console.log("key not valid");
	    keyValid = false;
      }

      res.json({ key_valid: keyValid });
    } catch (error) {
      console.log("Error getting record" + error);
    }
  }

  runDbQuery();
});


//
// http://localhost:3000/api/removeKey?apikey=IEPs35kEqCKiC1fV0DljXtcLyjWxJToLzB3ItXwS
//
//
router.get("/removeKey", function (req, res, next) {
  console.log("/removeKey call success");

  // get the params from the request
  const apikey = req.query.apikey;



    async function runRemove() {
      try {
        const { MongoClient } = require("mongodb");
        const uri = "mongodb://root:example@localhost:27017";
        const client = new MongoClient(uri);
        const database = client.db("keytracker");
        const col = database.collection("apikeys");

     
        const result = await col.deleteOne({"apikey":apikey});
    
        client.close();
        res.json({ apikey: "removed" });
      } catch (error) {
        res.json({ status: "error connecting to db" });
        console.log("error deleting record" + error);
      }
    }

    runRemove();
  
});



module.exports = router;
