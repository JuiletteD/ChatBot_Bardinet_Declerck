var express = require('express');
var router = express.Router();
const Gestionnaire = require("../classes/Gestionnaire_ChatBot.js")

/* GET liste de chatbots avec lesquels communiquer */
router.get('/', function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    newchatbot1 = gest.addNewChatBot('steeve', 'juliette');
    newchatbot2 = gest.addNewChatBot('max', 'romain');
    chatbotlist = gest.getAllChatBotsInfos();
    console.log('chatbotlist =',JSON.stringify(chatbotlist));

    res.render('chatbotlist.ejs', { chatbotlist: chatbotlist });
});


router.post('/:nom', function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    newchatbot = gest.addNewChatBot(req.body.name, req.body.login);

    console.log("ajout d'un nouveaux chatbot")
    console.log(req.params);
    console.log(JSON.stringify(req.body));


    //Si il s'agit du première accès à la page de tchat, le bot ne dit rien
    if(req.body.status=='firstAccess'){
        res.render('chat_box.ejs', { chatbot_name: req.params.nom , userLogin: req.body.login});
    }

});

module.exports = router;