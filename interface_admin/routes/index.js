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

/* POST voir les infos login. */
router.post('/login',loginSanitize, async function (req, res, next) {
  const errors = validationResult(req);
	if (!errors.isEmpty()) {
    throw new Error(errors);
	}
  const response = await fetch('http://localhost:3000/admin/chatbots');
  const data = await response.json();
  console.log("Chatbots received :" + data);

  res.render('login', { title: 'Chatbot', chatbots: xssFilters.inHTMLData(data), 
  login: xssFilters.inHTMLData(req.body.login) });
});

module.exports = router;
