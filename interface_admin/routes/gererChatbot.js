var express = require('express');
const fetch = require('node-fetch');
var methodOverride = require('method-override');

const { check, validationResult } = require('express-validator');
var xssFilters = require('xss-filters');
var loginSanitize = [check('name').trim().escape()];
var router = express.Router();


// override with POST having ?_method=DELETE
router.use(methodOverride('_method'));

/* POST creer un nouveau ChatBot. */
router.post('/creer',loginSanitize, async function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
    throw new Error(errors);
	}
	if(req.body.name===""){
		res.redirect(302, '/');
	}

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
router.post('/chatbot',loginSanitize, async function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
    throw new Error(errors);
	}

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

	res.render('chatbot', { title: 'Chatbot', chatbot: xssFilters.inHTMLData(parsed.chatbot),
	 files: xssFilters.inHTMLData(parsed.files) })
});

/* POST ajouter cerveau. */
router.put('/addBrain', loginSanitize,async function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
    throw new Error(errors);
	}
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

	res.render('chatbot', { title: 'Chatbot', chatbot: xssFilters.inHTMLData(parsed.chatbot), 
	files: xssFilters.inHTMLData(parsed.files) })
});

/* DELETE supprimer chatbot. */
router.delete('/delete',loginSanitize, async function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
    throw new Error(errors);
	}
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
