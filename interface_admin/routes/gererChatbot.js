var express = require('express');
const fetch = require('node-fetch');
var router = express.Router();


/* POST creer un nouveau ChatBot. */
router.post('/creer', async function(req, res, next) {

  const response = await fetch('http://localhost:3000/admin/creer', {
			method: "POST",
			body: JSON.stringify({
				name: req.body.name,
        		login: req.body.login
			}),
			headers: {
				"Content-type": "application/json",
			},
		});
		const data = await response.json();
		console.log("data received:" + data);

		res.redirect(302, '/');
});

module.exports = router;
