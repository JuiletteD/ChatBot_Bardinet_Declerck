var express = require('express');
const Gestionnaire = require("../classes/Gestionnaire_ChatBot.js")
var router = express.Router();

/* GET recuperer tous les chatbots. */
router.get('/chatbots', async function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    chatbots = await gest.getAllChatBotsInfos();

    console.log(chatbots);
    res.json(JSON.stringify(chatbots));
});


/* POST creer chatbot. */
router.post('/creer', async function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    newchatbot = gest.addNewChatBot(req.body.name);
    var temp = await newchatbot.getInfos();
    var infos = JSON.stringify(temp);
    console.log("infos de creees :"+infos);

    res.json(infos);
});

/* POST acceder chatbot. */
router.post('/chatbot', async function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    var chatbotInfos = await gest.getChatBotInfos(req.body.name);
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

/* PUT ajouter un cerveau. */
router.put('/addBrain', async function (req, res, next) {
    console.log("add :", req.body.brain, " to :", req.body.name);
    let gest = Gestionnaire.getInstance();
    var chatbot = gest.getChatBotByName(req.body.name);
    var hasBrain = false;
    // on vérifie si le cerveau à ajouter n'existe pas déjà
    for (var j = 0; j < chatbot.brains.length; j++) {
        if (req.body.brain === chatbot.brains[j]) {
            hasBrain = true;
        }
    }
    if (req.body.brain === undefined) {
        console.log("undefined !");
    } else if (hasBrain) {
        console.log("already hasBrain !"+req.body.brain);
    } else {
        await chatbot.addBrains(req.body.brain);
    }

    // on recherge les informations du bot et du dossier des fichiers rivescript
    var chatbotnewInfos = await chatbot.getInfos()
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
router.delete('/delete', async function (req, res, next) {
    console.log("delete : ", req.body.name)
    let gest = Gestionnaire.getInstance();
    var deletedChatbot = gest.removeChatBot(req.body.name);
    var deletedInfos = ""
    
    if (deletedChatbot !== null) {
        var temp = await deletedChatbot.getInfos()
        deletedInfos = JSON.stringify(temp);
        res.json(JSON.stringify({ 'succes': "true", 'chatbot': deletedInfos }));
    } else {
        deletedInfos("Chatbot not found !"+req.body.name);
        res.json(JSON.stringify({ 'succes': "false", 'chatbot': null }));
    }
});


module.exports = router;