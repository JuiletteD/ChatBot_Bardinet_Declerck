var express = require('express');
const fetch = require('node-fetch');
const { check, validationResult } = require('express-validator');
var xssFilters = require('xss-filters');
var loginSanitize = [check('login').trim().escape()]

var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  const response = await fetch('http://localhost:3000/admin/chatbots');
  const data = await response.json();
  console.log("Chatbots received :" + data);


  res.render('index', { title: 'Chatbot', chatbots: data, msg : '' });
});

/* Met les données en local dans la bdd en ligne */
router.post('/synchroniser',async function (req, res, next) {
  const response1 = await fetch('http://localhost:3000/chat', {
		method: "POST",
		body: JSON.stringify({
			action: "local2mongoDB"
		}),
		headers: {
			"Content-type": "application/json",
		},
	});
	const data1 = await response1.text();

 const response = await fetch('http://localhost:3000/admin/chatbots');
  const data = await response.json();
  console.log("Chatbots received :" + data);


  res.render('index', { title: 'Chatbot', chatbots: data, msg : '' });
});



/* POST voir les infos login. */
router.post('/login',loginSanitize, async function (req, res, next) {
  console.log("in login")
  const errors = validationResult(req);
	if (!errors.isEmpty()) {
    next(new Error(errors.errors[0].msg));
	}
  const response = await fetch('http://localhost:3000/admin/chatbots');
  const data = await response.json();
  console.log("Chatbots received :" + data);

  console.log("next is rendering : ",req.body.login)
  res.render('login', { title: 'Chatbot', chatbots: data, 
login: req.body.login });
});

module.exports = router;
