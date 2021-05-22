var express = require('express');
const fetch = require('node-fetch');

var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {

  const response = await fetch('http://localhost:3000/admin/chatbots');
		const data = await response.json();
		console.log("data received:" + data);


  res.render('index', { title: 'Chatbot', chatbots: data });
});

module.exports = router;
