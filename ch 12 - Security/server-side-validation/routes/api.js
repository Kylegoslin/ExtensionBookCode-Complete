var express = require("express");
var router = express.Router();
const Joi = require("joi");

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

  const schema = Joi.object({
    firstname: Joi.string().min(1).max(20),
    lastname: Joi.string().min(1).max(20),
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(10).max(20),
  });

  const { error, value } = schema.validate({ firstname: firstname, lastname:lastname, email:email, password:password });



  if (error == undefined) {
    console.log("input valid");

    res.json({ result: "valid" });
  } else {
    res.json({ result: "validation_error", message: error });
  }
});

// -----------------------------------------------------------
//
//    Register
// -----------------------------------------------------------
router.get("/register2", function (req, res, next) {
  console.log("/register2 call success");

  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const email = req.query.email;
  const password = req.query.password;
  const repeat_password = req.query.repeat_password;
  const dob = req.query.dob;

  const schema = Joi.object({
    firstname: Joi.string().min(1).max(20),
    lastname: Joi.string().min(1).max(20),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    repeat_password: Joi.ref("password"),
    dob: Joi.number().integer().min(1900).max(2013),
  });



  const { error, value } = schema.validate({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
    repeat_password: repeat_password,
    dob:dob
  });



  if (error == undefined) {
    console.log("input valid");

    res.json({ result: "valid" });
  } else {
    res.json({ result: "validation_error", message: error });
  }
});
module.exports = router;
