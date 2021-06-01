var express = require('express');
const fetch = require('node-fetch');
var router = express.Router();


/* POST creer un nouveau ChatBot. */
router.post('/creer', async function(req, res, next) {

  const response = await fetch('http://localhost:3000/admin/creer', {
			method: "POST",
			body: JSON.stringify({
				name: req.body.name
			}),
			headers: {
				"Content-type": "application/json",
			},
		});
		const data = await response.json();
		console.log("data received:" + data);

		res.redirect(302, '/');
});
/* POST acceder ChatBot. */
router.post('/chatbot', async function(req, res, next) {

	const response = await fetch('http://localhost:3000/admin/chatbot', {
			  method: "POST",
			  body: JSON.stringify({
				  name: req.body.name
			  }),
			  headers: {
				  "Content-type": "application/json",
			  },
		  });
		  const data = await response.json();
		  console.log("data received:" + data);
		  var parsed = JSON.parse(data)

		  res.render('chatbot',{title: 'Chatbot', chatbot: parsed.chatbot, files: parsed.files})
  });

/* POST ajouter cerveau. */
router.post('/addBrain', async function(req, res, next) {
console.log(req.body.brain)
console.log(req.body.name)

	const response = await fetch('http://localhost:3000/admin/addBrain', {
			  method: "PUT",
			  body: JSON.stringify({
				  name: req.body.name,
				  brain: req.body.brain
			  }),
			  headers: {
				  "Content-type": "application/json",
			  },
		  });
		  const data = await response.json();
		  console.log("data received:" + data);
		  var parsed = JSON.parse(data)

		  res.render('chatbot',{title: 'Chatbot', chatbot: parsed.chatbot, files: parsed.files})
  });

/* POST supprimer chatbot. */
router.post('/delete', async function(req, res, next) {
	console.log(req.body.name)
	
		const response = await fetch('http://localhost:3000/admin/delete', {
				  method: "DELETE",
				  body: JSON.stringify({
					  name: req.body.name
				  }),
				  headers: {
					  "Content-type": "application/json",
				  },
			  });
			  const data = await response.json();
			  console.log("data received:" + data);
	
			  res.redirect(302,"/")
	  });
module.exports = router;
