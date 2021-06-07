var express = require('express');
const fetch = require('node-fetch');
var methodOverride = require('method-override');

const { check, validationResult } = require('express-validator');
var xssFilters = require('xss-filters');
var loginSanitize = [check('name').trim().escape().isAlpha()];
var router = express.Router();


// override with POST having ?_method=DELETE
router.use(methodOverride('_method'));

/* POST creer un nouveau ChatBot. */
router.post('/creer', loginSanitize, async function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.errors[0].msg)
		if (errors.errors[0].msg == 'Invalid value') {
			const response = await fetch('http://localhost:3000/admin/chatbots');
			const data = await response.json();
			res.render('index', {
				title: 'Chatbot', chatbots: data,
				msg: 'Invalid value, only alphanumeric character allowed'
			});
		} else {
			next(new Error(errors.errors[0].msg));
		}
	} else {
		if (req.body.name === "") {
			res.redirect(302, '/');
		} else {

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
			if(JSON.parse(data).error !== undefined){
				const response2 = await fetch('http://localhost:3000/admin/chatbots');
				const data2 = await response2.json();
				console.log("Chatbots received :" + data2);
			  
				res.render('index', { title: 'Chatbot', chatbots: data2, msg : JSON.parse(data).error });

			}else{
			console.log("Création nouveau chatbot :" + data);

			res.redirect(302, '/');
			}
		}
	}
});
/* POST acceder ChatBot. */
router.post('/chatbot', loginSanitize, async function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		next(new Error(errors.errors[0].msg));
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

	res.render('chatbot', {
		title: 'Chatbot', chatbot: xssFilters.inHTMLData(parsed.chatbot),
		files: xssFilters.inHTMLData(parsed.files)
	})
});

/* POST ajouter cerveau. */
router.put('/addBrain', loginSanitize, async function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		next(new Error(errors.errors[0].msg));
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

	res.render('chatbot', {
		title: 'Chatbot', chatbot: xssFilters.inHTMLData(parsed.chatbot),
		files: xssFilters.inHTMLData(parsed.files)
	})
});

/* DELETE supprimer chatbot. */
router.delete('/delete', loginSanitize, async function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		next(new Error(errors.errors[0].msg));
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
