var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.send("The API was called!");
});




// ------------------------------------------------------
// Generate the data based on each months total hours
//
// ------------------------------------------------------
router.get("/getHoursByMonth", function (req, res, next) {
  console.log("/getHoursByMonth call success");

  const { MongoClient } = require("mongodb");
  const uri = "mongodb://root:example@localhost:27017/";
  const client = new MongoClient(uri);
  async function run() {
    try {
      const database = client.db("extension_time_manager");
      const collection = database.collection("times_logged");

      const cursor = collection.find();
      const results = await cursor.toArray();

      let hoursEachMonth = [];

      hoursEachMonth[0] = 0;
      hoursEachMonth[1] = 0;
      hoursEachMonth[2] = 0;
      hoursEachMonth[3] = 0;
      hoursEachMonth[4] = 0;
      hoursEachMonth[5] = 0;
      hoursEachMonth[6] = 0;
      hoursEachMonth[7] = 0;
      hoursEachMonth[8] = 0;
      hoursEachMonth[9] = 0;
      hoursEachMonth[10] = 0;
      hoursEachMonth[11] = 0;


      for (let i = 0; i < results.length; i++) {
        let startTime = results[i].startTime;
        let endTime = results[i].endTime;
        let totalHours = endTime - startTime;
        let dateLogged = results[i].dateLogged;
        const [day, month, year] = dateLogged.split("-").map(Number);

        hoursEachMonth[month-1] = hoursEachMonth[month-1] + totalHours;
      }

      // print to the console to review hours
      for (let i = 0; i < 12; i++) {
        console.log("Month " + i + " total" + hoursEachMonth[i]);
      }

      res.json({
        months: ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6", "Month 7", "Month 8", "Month 9", "Month 10", "Month 11", "Month 12"],
        hours: hoursEachMonth,
      });
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});


// --------------------------------------
// Get hours by day
// -----------------------------------------
//
router.get("/getHoursByDay", function (req, res, next) {
  console.log("/getHoursByDay call success");


  let start = req.query.start;
  let end = req.query.end



  const { MongoClient } = require("mongodb");
  const uri = "mongodb://root:example@127.0.0.1:27017/";
  const client = new MongoClient(uri);
  async function run() {
    try {
      const database = client.db("extension_time_manager");
      const collection = database.collection("times_logged");



      const cursor = collection.find({dateLogged: { $gt: new Date(start).toISOString(),$lt:  new Date(end).toISOString()}}).sort({ dateLogged: 1 });
      const results = await cursor.toArray();

      let hours = [];
      let dates = [];

      for (let i = 0; i < results.length; i++) {
        let startTime = results[i].startTime;
        let endTime = results[i].endTime;
        let dateLogged = results[i].dateLogged;
        
        const cleanDate = dateLogged.split('T')[0];


        let total = endTime - startTime;
        hours.push(total);
        dates.push(cleanDate);
      }
      res.json({ hours: hours, dates: dates });
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});

//
// Insert a new time record into the database
//
router.get("/saveNewTimeRecord", function (req, res, next) {
  console.log("/saveNewTimeRecord");

  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  const dateLogged = req.query.dateLogged;
  const workType = req.query.workType;

  const { MongoClient } = require("mongodb");
  const uri = "mongodb://root:example@127.0.0.1:27017/";
  const client = new MongoClient(uri);

  async function run() {
    try {
      const database = client.db("extension_time_manager");
      const collection = database.collection("times_logged");

     const event = new Date(dateLogged);



      const cursor = await collection.insertOne({
        startTime: startTime,
        endTime: endTime,
        dateLogged: event.toISOString(),
        workType: workType,
      });
      res.json({ status: "ok" });
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
});







module.exports = router;
