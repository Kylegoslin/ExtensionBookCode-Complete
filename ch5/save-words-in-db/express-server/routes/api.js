var express = require('express');
var router = express.Router();

// default / page
router.get('/', function(req, res, next) {


  res.send('The API was called!');
});




// saveData
router.get('/saveData', function(req, res, next) {


  console.log("Saving new data to the database")
  let new_name = req.query.name;
  let new_word = req.query.word;



  const { MongoClient } = require("mongodb");
  const uri = "mongodb://root:example@localhost:27017";
  const client = new MongoClient(uri);



  async function runSaveToDb() {
    try {
      const database = client.db('word_storage');
      const col = database.collection('words');

      const doc = {
        name: new_name,
        word: new_word,
      }

      const result = await col.insertOne(doc);
      console.log(result)
     

    }catch(error){
          res.json({"status": "error saving to db"})
          console.log("error inserting new record to db")


    } finally {

      await client.close();
      
    }

  }

  runSaveToDb()
  
  res.json({"status": "saved"})
});







// getData
router.get('/getData', function(req, res, next) {

    console.log("/getData call success");
  
  
    const { MongoClient } = require("mongodb");
    const uri = "mongodb://root:example@localhost:27017";
    const client = new MongoClient(uri);



    async function runDBcall() {

      try {
          const database = client.db('word_storage');
          const records = database.collection('words');
          const cursor = records.find({});
          const results = await cursor.toArray();
          console.log(results)
        
          // send back the JSON to the browser
          res.json(results);
        
      } catch (error) {
          // if an error occurs, send back an error message
          res.send({"status": "error"});
          console.log(error);

      } finally {

        await client.close();
      }

    }
    
    
    runDBcall()

   
});


// deleteAll
router.get('/deleteAll', function(req, res, next) {

  console.log("/deleteAll call success");


  const { MongoClient } = require("mongodb");
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);



  async function runDBdelete() {

    try {
        const db = client.db('word_storage');
        await db.collection('words').deleteMany({});

        console.log("all records deleted")
        // send back the JSON to the browser
        res.json({"status": "all records deleted"});
      
    } catch (error) {
        // if an error occurs, send back an error message
        res.send({"status": "error occurred deleting all records"});
        console.log(error);

    } finally {

      await client.close();
    }

  }
  
  
  runDBdelete()

 
});


module.exports = router;
