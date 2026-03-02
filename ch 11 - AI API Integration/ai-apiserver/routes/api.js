
var express = require('express');
var router = express.Router();

require('dotenv').config()
const { OpenAI } = require('openai');


/* GET users listing. */
router.get('/', function(req, res, next) {


  res.send('The API was called!');
});


// Call the API
router.get('/call1', async function(req, res, next) {

    let word = req.query.word

  
    const prompt = 'Explain in simple tem what the following word means: ' + word

    let OPENAI_API_KEY = process.env.OPENAI_API_KEY
    const client = new OpenAI({ apiKey: OPENAI_API_KEY });

    const response = await client.responses.create({
        model: "gpt-4o",
        input: prompt
    });

    console.log(response.output_text);


    res.json(response)

});




module.exports = router;
