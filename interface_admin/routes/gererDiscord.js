var express = require('express');
const fetch = require('node-fetch');
var methodOverride = require('method-override');
const { check, validationResult } = require('express-validator');
var connectSanitize = [check('name').trim().escape()]
var router = express.Router();

// override with POST having ?_method=DELETE
router.use(methodOverride('_method'));

/* POST creer un accès au ChatBot. */
router.post('/connect',connectSanitize, async function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
    throw new Error(errors);
	}

	const response = await fetch('http://localhost:3000/discord/connect', {
		method: "POST",
		body: JSON.stringify({
			name: req.body.name,
			token: req.body.token,
			prefix: req.body.prefix
		}),
		headers: {
			"Content-type": "application/json",
		},
	});
	const data = await response.json();
	console.log("Connection à discord ::" + data);

	if (JSON.parse(data).error !== undefined) {
		console.log("error in gerediscord");
		throw new Error(JSON.parse(data).error);
	} else {
		res.redirect(307, '../gerer/chatbot');
	}
});



/* DELETE déconnecter chatbot. */
router.delete('/disconnect',connectSanitize, async function (req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
    throw new Error(errors);
	}

	const response = await fetch('http://localhost:3000/discord/disconnect', {
		method: "DELETE",
		body: JSON.stringify({
			name: req.body.name
		}),
		headers: {
			"Content-type": "application/json",
		},
	});
	const data = await response.json();
	console.log("Déconnecter de discord :" + data);

	res.redirect(307, "../gerer/chatbot")
});
module.exports = router;
