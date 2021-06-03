var express = require('express');
const fetch = require('node-fetch');
var methodOverride = require('method-override');
var router = express.Router();


// override with POST having ?_method=DELETE
router.use(methodOverride('_method'));

/* POST creer un nouveau ChatBot. */
router.post('/creer', async function (req, res, next) {

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
	console.log("Création nouveau chatbot :" + data);

	res.redirect(302, '/');
});
/* POST acceder ChatBot. */
router.post('/chatbot', async function (req, res, next) {

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
	console.log("Acceder au chatbot :" + data);
	var parsed = JSON.parse(data)

	res.render('chatbot', { title: 'Chatbot', chatbot: parsed.chatbot, files: parsed.files })
});

/* POST ajouter cerveau. */
router.put('/addBrain', async function (req, res, next) {
	console.log("Ajout de ", req.body.brain)
	console.log("Au chatbot ", req.body.name)

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
	console.log("Ajout cerveau :" + data);
	var parsed = JSON.parse(data)

	res.render('chatbot', { title: 'Chatbot', chatbot: parsed.chatbot, files: parsed.files })
});

/* DELETE supprimer chatbot. */
router.delete('/delete', async function (req, res, next) {
	console.log("Suppression de :", req.body.name)

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
	console.log("Suppression d'un chatbot :" + data);

	res.redirect(302, "/")
});
module.exports = router;
