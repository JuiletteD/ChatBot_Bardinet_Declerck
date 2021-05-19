var express = require('express');
const ChatBot = require("./classes/ChatBot.js");
const Gestionnaire = require("./classes/Gestionnaire_ChatBot.js")
var router = express.Router();

/* POST creer chatbot. */
router.post('/creer', function(req, res, next) {
    let gest = Gestionnaire.getInstance();
    newchatbot = gest.addNewChatBot(req.name, req.login);
    res.render(JSON.stringify(newchatbot.getInfos()));
});


module.exports = router;
