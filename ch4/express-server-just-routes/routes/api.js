var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {


  res.send('The API was called!');
});


// test 1
router.get('/test1', function(req, res, next) {


  res.send('The test 1 API was called!');
});


//test2
router.get('/test2', function(req, res, next) {


  res.send('The test 2 API was called!');
});


module.exports = router;
