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
    newchatbot = gest.getChatBotByName(req.body.name);

    console.log("ajout d'un nouveaux chatbot")
    //console.log(req.params);
    console.log(req.body);


    //Si il s'agit du première accès à la page de tchat, le bot ne dit rien
    if(req.body.isFirstAccess=='yes'){
        res.render('chat_box.ejs', { chatbot_name: req.body.name , userLogin: req.body.login, botReply: undefined});
    }

    //Si au contraire un message est envoyé par l'utilisateur, on le traite et on renvoie une réponse
    if (req.body.isFirstAccess == 'no') {
        console.log("generating bot reply")

        try {
            
            let gest = Gestionnaire.getInstance();
            chatbot = gest.addNewChatBot(req.body.name, req.body.userChatting);
            console.log(gest.getChatBotInfos(req.body.name));
            console.log(chatbot.getInfos());

            let botReply = undefined;
            gest.getChatBotByName(req.body.name).bot.sortReplies();
            gest.getChatBotByName(req.body.name).getReply(req.body.userChatting, req.body.userMessage).then((reply) => console.log("generated reply :" + reply));
            //console.log("generated chatbot reply :" + botReply);

            //res.render('chat_box.ejs', { chatbot_name: req.params.nom, userLogin: req.body.login, botReply: "dummy reply" });
            res.send(JSON.stringify({ 'chatbot_name': req.body.name, 'userLogin': req.body.login, 'botReply': "dummy reply" }));
            
        } catch (err) {
            console.error(err);
            res.send(JSON.stringify({ 'chatbot_name': req.body.name, 'userLogin': req.body.login, 'botReply': err }));
        }
    }

});

module.exports = router;