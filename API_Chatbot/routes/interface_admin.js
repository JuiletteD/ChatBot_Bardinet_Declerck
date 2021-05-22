var express = require('express');
const ChatBot = require("../classes/ChatBot.js");
const Gestionnaire = require("../classes/Gestionnaire_ChatBot.js")
var router = express.Router();

/* GET recuperer chatbot. */
router.get('/chatbots', function(req, res, next) {
    let gest = Gestionnaire.getInstance();
    chatbots = gest.getAllChatBotsInfos();
    console.log(chatbots)

    res.json(JSON.stringify(chatbots));
});


/* POST creer chatbot. */
router.post('/creer', function(req, res, next) {
    let gest = Gestionnaire.getInstance();
    newchatbot = gest.addNewChatBot(req.body.name, req.body.login);

    var infos = JSON.stringify(newchatbot.getInfos());
    console.log(infos)

    res.json(infos);
});




module.exports = router;
