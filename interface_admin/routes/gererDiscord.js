var express = require('express');
const fetch = require('node-fetch');
var router = express.Router();


/* POST creer un accès au ChatBot. */
router.post('/connect', async function(req, res, next) {

  const response = await fetch('http://localhost:3000/discord/connect', {
			method: "POST",
			body: JSON.stringify({
				name: req.body.name,
                token: req.body.token
			}),
			headers: {
				"Content-type": "application/json",
			},
		});
		const data = await response.json();
		console.log("data received:" + data);

		if(JSON.parse(data).error!==undefined){
			console.log("error in gerediscord");
			throw new Error(JSON.parse(data).error);
		}else{
			res.redirect(307, '../gerer/chatbot');
		}
});



/* POST déconnecter chatbot. */
router.post('/disconnect', async function(req, res, next) {
	console.log(req.body.name)
	
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
			  console.log("data received:" + data);
	
			  res.redirect(307,"../gerer/chatbot")
	  });
module.exports = router;
