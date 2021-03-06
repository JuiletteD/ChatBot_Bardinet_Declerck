var express = require('express');
const Gestionnaire = require("../classes/Gestionnaire_ChatBot.js");
const { check, validationResult } = require('express-validator');
var loginSanitize = [check('name').trim().escape()];

var router = express.Router();

/* GET recuperer tous les chatbots. */
router.get('/chatbots', async function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    chatbots = await gest.getAllChatBotsInfos();

    console.log("chatbots existants :",chatbots);
    res.json(JSON.stringify(chatbots));
});

/* POST creer chatbot. */
router.post('/creer', loginSanitize, async function (req, res, next) {
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
        next(new Error(errors.errors[0].msg));
	}
    let gest = Gestionnaire.getInstance();
    réussi = gest.addNewChatBot(req.body.name);
    if(réussi === 0){
        var temp = await gest.getChatBotInfos(req.body.name);
        var infos = JSON.stringify(temp);
    console.log("infos de creees :"+infos);

    res.json(infos);
    }else{
        console.log("chatbot non crée, ce nom est déjà pris");
        res.json(JSON.stringify({error: 'Chatbot already exists !'}));
    }
});

/* POST acceder chatbot. */
router.post('/chatbot', loginSanitize, async function (req, res, next) {
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
        next(new Error(errors.errors[0].msg));
	}
    let gest = Gestionnaire.getInstance();
    var chatbotInfos = await gest.getChatBotInfos(req.body.name);
    var files = gest.getRivescriptFile();

    // vérifie si le fichier existe déjà dans le chatbot avant de le proposer aux ajouts possibles
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
router.put('/addBrain', loginSanitize, async function (req, res, next) {
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
        next(new Error(errors.errors[0].msg));
	}

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
router.delete('/delete', loginSanitize, async function (req, res, next) {
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
        next(new Error(errors.errors[0].msg));
	}
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