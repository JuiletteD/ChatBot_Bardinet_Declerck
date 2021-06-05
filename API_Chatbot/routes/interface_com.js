var express = require('express');
var router = express.Router();
var methodOverride = require('method-override');
router.use(methodOverride('_method'));
const Gestionnaire = require("../classes/Gestionnaire_ChatBot.js");
const DBGestionnaire = require("../classes/Gestionnaire_DB.js");
const BotNameLoginVar4DB = require("../classes/models/BotNameLoginVar.js");
const MongoDBCollection = "chatbot_logins_uservar"

var fs = require('fs');

let gestDB = new DBGestionnaire;

/* GET liste de chatbots avec lesquels communiquer */
router.get('/', async function (req, res, next) {
     
    let gest = Gestionnaire.getInstance();
    chatbotlist = await gest.getAllChatBotsInfos();
    console.log('chatbotlist =',JSON.stringify(chatbotlist));

    res.render('chatbotlist.ejs', { chatbotlist: chatbotlist })
});

router.post('/', async function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    if (req.body.action == "eraseDB") {
        console.log("ERASING DBBDBDBDBBDBDDBDB");
        try {
            var chatbot2db = await gestDB.deleteAll(MongoDBCollection);
            if (!chatbot2db) {
                console.log("error! ");
                throw new Error('MAJ echouee');
            } else {
                console.log("erased db");
            }

        } catch (e) {
            console.log("error :" + e.message);
            res.json(JSON.stringify({ error: e.message }));
        }

        
    } else if (req.body.action == "createBot") {
        let infos = await gest.getChatBotInfos("nuv");
        console.log("infos collected = " + JSON.stringify(infos));
        let bot4db = {};
        bot4db.name = infos.name;
        bot4db.loginInfo = infos.loginInfo;
        try {
            var chatnot2db = await gestDB.addItem(MongoDBCollection, bot4db);
            if (!chatnot2db) {
                console.log("error! ");
                throw new Error('MAJ echouee');
            } else {
                console.log("data sent");
            }

        } catch (e) {
            console.log("error :" + e.message);
            res.json(JSON.stringify({ error: e.message }));
        }
        
    } else if (req.body.action == "editBot") {

        var chatbot = await gestDB.updateItem(MongoDBCollection, { name: "nuv" }, { $set: { loginInfo: [{ "login": "nuvgan" }]  } }, false);
        if (!chatbot) {
            console.log("error! ");
            throw new Error('MAJ echouee');
        }

    } else if (req.body.action == "printBrain") {
    
    }
    
    chatbotlist = await gest.getAllChatBotsInfos();
    console.log('chatbotlist =', JSON.stringify(chatbotlist));

    res.render('chatbotlist.ejs', { chatbotlist: chatbotlist })

});


router.post('/:nom', async function (req, res, next) {

    console.log("req = "+JSON.stringify(req.body)+JSON.stringify(req.params))

    //Si il s'agit du première accès à la page de tchat, le bot ne dit rien
    if(req.body.isFirstAccess == 'yes'){
        res.render('chat_box.ejs', { chatbot_name: req.body.name , userLogin: req.body.login, botReply: undefined});
    }

    //Si au contraire un message est envoyé par l'utilisateur, on le traite et on renvoie une réponse
    if (req.body.isFirstAccess == 'no') {
        console.log("generating bot reply for bot = " + req.params.nom)
        

        try {
            
            let gest = Gestionnaire.getInstance();
            let chatbot = gest.getChatBotByName(req.params.nom);
            
            await chatbot.reloadBrain();
            var reply = await chatbot.getReply(req.body.userChatting, req.body.userMessage);
            console.log("generated reply :" + reply);
            res.send(JSON.stringify({ 'chatbot_name': req.params.nom, 'userLogin': req.body.login, 'botReply': reply }));
        
        } catch (err) {
            console.error(err);
        }
    }

});

module.exports = router;