var express = require('express');
var router = express.Router();


/* POST creer un nouveau ChatBot. */
router.post('/creer', function(req, res, next) {
  const response = await fetch('http://localhost:3000/creer', {
			method: "POST",
			body: JSON.stringify({
				name: req.name,
        login: req.login
			}),
			headers: {
				"Content-type": "application/json",
			},
		});
		const data = await response.json();
		console.log("data received:" + data);

    res.send(data);
});

module.exports = router;
