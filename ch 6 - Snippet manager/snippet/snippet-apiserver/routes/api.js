var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.send('The API was called!');
});




router.get('/getOneSnippet', function(req, res, next) {
    console.log("/getOneSnippet call success");
    const id = req.query.id;
    const { MongoClient, ObjectId } = require("mongodb");
    const uri = "mongodb://root:example@127.0.0.1:27017/";
    const client = new MongoClient(uri);
    async function run() {
      try {
        const database = client.db('extension_snip');
        const collection = database.collection('snippets');
        const results = await collection.findOne({ _id: new ObjectId(id) });
        console.log(results);
        res.json(results);
      } finally {
        await client.close();
      }
    }
    run().catch(console.dir);
});






//  getListNames
router.get('/getListNames', function(req, res, next) {
    console.log("/getListNames call success");
    const { MongoClient } = require("mongodb");
    const uri = "mongodb://root:example@127.0.0.1:27017/";
    const client = new MongoClient(uri);
    async function run() {
      try {
        const database = client.db('extension_snip');
        const collection = database.collection('myLists');
        const cursor = collection.find();
        const results = await cursor.toArray()
        console.log(results);
        res.json(results);
      } finally {
        await client.close();
      }
    }
    run().catch(console.dir);
});

//
// Get a list of snippets based on the list name.
//
router.get('/getAllByListName', function(req, res, next) {
    console.log("/getAllByListName call success");
    const listname = req.query.listname;
    const { MongoClient } = require("mongodb");
    const uri = "mongodb://root:example@127.0.0.1:27017/";
    const client = new MongoClient(uri);
    async function run() {
      try {
        const database = client.db('extension_snip');
        const collection = database.collection('snippets');
        const cursor = collection.find({"listname": listname});
        const results = await cursor.toArray()
        console.log(results);
        res.json(results);
       
      } finally {
        await client.close();
      }
    }
    run().catch(console.dir);

});



router.get('/saveSnippet', function(req, res, next) {
    console.log("/saveSnippet call success");
    const content = req.query.content;
    const selectedList = req.query.selectedList;
    const { MongoClient } = require("mongodb");
    const uri = "mongodb://root:example@127.0.0.1:27017/";
    const client = new MongoClient(uri);

    async function run() {
      try {
        const database = client.db('extension_snip');
        const collection = database.collection('snippets');
        const cursor = await collection.insertOne({"listname": selectedList, "snippet": content});
        res.json({"status": "ok"});
       
      } finally {

        await client.close();
      }
    }
    run().catch(console.dir);
});


router.get('/addNewList', function(req, res, next) {
    console.log("/addNewList call success");
    const newlistname = req.query.newlistname;
    const { MongoClient } = require("mongodb");
    const uri = "mongodb://root:example@127.0.0.1:27017/";
    const client = new MongoClient(uri);
    async function run() {
      try {
   
        const database = client.db('extension_snip');
        const collection = database.collection('myLists');
        const cursor = await collection.insertOne({"listname": newlistname});
        res.json({"status": "ok"});
      } finally {

        await client.close();
      }
    }
    run().catch(console.dir);

});

module.exports = router;
