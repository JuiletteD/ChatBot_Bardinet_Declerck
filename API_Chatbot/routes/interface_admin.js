var express = require('express');
const ChatBot = require("../classes/ChatBot.js");
const Gestionnaire = require("../classes/Gestionnaire_ChatBot.js")
var router = express.Router();

/* GET recuperer tous les chatbots. */
router.get('/chatbots', function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    chatbots = gest.getAllChatBotsInfos();
    console.log(chatbots)

    res.json(JSON.stringify(chatbots));
});


/* POST creer chatbot. */
router.post('/creer', function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    newchatbot = gest.addNewChatBot(req.body.name, req.body.login);

    var infos = JSON.stringify(newchatbot.getInfos());
    console.log(infos)

    res.json(infos);
});

/* POST acceder chatbot. */
router.post('/chatbot', function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    var chatbotInfos = gest.getChatBotInfos(req.body.name);
    var files = gest.getRivescriptFile();

    var resp = []
    var isin = false;
    for (var i = 0; i < files.length; i++) {
        for (var j = 0; j < chatbotInfos.brains.length; j++) {
            if (files[i] === chatbotInfos.brains[j]) {
                isin = true
            }
        }
        if (isin === false) {
            resp.push(files[i])
        } else {
            isin = false
        }
    }
    res.json(JSON.stringify({ 'files': JSON.stringify(resp), 'chatbot': JSON.stringify(chatbotInfos) }));
});

/* POST ajouter un cerveau. */
router.post('/addBrain', async function (req, res, next) {
    console.log("add :",req.body.brain," to :",req.body.name);

    let gest = Gestionnaire.getInstance();
    var chatbot = gest.getChatBotByName(req.body.name);

    var hasBrain = false;
    for (var j = 0; j < chatbot.brains.length; j++) {
        if (req.body.brain === chatbot.brains[j]) {
            hasBrain = true;
        }
    }

    if (req.body.brain === undefined) {
        console.log("undefined !");
    } else if (hasBrain) {
        console.log("hasBrain !");
    } else {
        await chatbot.addBrains(req.body.brain);
    }

    var chatbotnewInfos = chatbot.getInfos()
    var files = gest.getRivescriptFile();

    var resp = []
    var isin = false;
    for (var i = 0; i < files.length; i++) {
        for (var j = 0; j < chatbotnewInfos.brains.length; j++) {
            if (files[i] === chatbotnewInfos.brains[j]) {
                isin = true
            }
        }
        if (isin === false) {
            resp.push(files[i])
        } else {
            isin = false
        }
    }


    res.json(JSON.stringify({ 'files': JSON.stringify(resp), 'chatbot': JSON.stringify(chatbotnewInfos) }));
});

/* DELETE un chatbot. */
router.post('/suppChatbot', async function (req, res, next) {
    console.log("delete : ",req.body.name)
    let gest = Gestionnaire.getInstance();
    var deletedChatbot = gest.removeChatBot(req.body.name);
    var deletedInfos =""
   if(deletedChatbot!== null){
    deletedInfos = JSON.stringify(deletedChatbot.getInfos());
    res.json(JSON.stringify({ 'succes': "true", 'chatbot':deletedInfos }));
   }else{
       deletedInfos("Chatbot not found !");
       res.json(JSON.stringify({ 'succes': "false", 'chatbot':null }));
   }
});


module.exports = router;
