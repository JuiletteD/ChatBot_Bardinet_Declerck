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

    res.render('chatbotlist.ejs', { chatbotlist: chatbotlist})
});

router.post('/', async function (req, res, next) {
    console.log('post on /chat req.body =', JSON.stringify(req.body));

    let gest = Gestionnaire.getInstance();
    //RAZ DE LA BDD
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

    //ENVOIE d'UN BOT EN BDD   
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

    //SAUVEGARDE DANS BDD
    } else if (req.body.data!== undefined && req.body.data.save2db) {
        try {
            //récupération de données dans le cache de l'api
            let infos = await gest.getChatBotInfos(req.body.data.botname);
            console.log("infos collected = " + JSON.stringify(infos));
            

            //verifier si bot dans db
            console.log("bot demandé = " + req.body.data.botname);
    
            var b = await gestDB.getBot(req.body.data.botname);

            //si bot inexistant, il faut le creer
            if (!b) {
                console.log('bot inexistant : '+req.body.data.botname);

                let bot4db = {};
                bot4db.name = infos.name;
                bot4db.loginInfo = infos.loginInfo;

                var chatnot2db = await gestDB.addItem(MongoDBCollection, bot4db);
                if (!chatnot2db) {
                    console.log("error! ");
                    throw new Error('ajout bot echoué');
                } else {
                    console.log("bot ajouté");
                }

            } else {
                var chatbot = await gestDB.updateItem(MongoDBCollection, { name: req.body.data.botname }, { $set: { loginInfo: infos.loginInfo  } }, false);
                    if (!chatbot) {
                        console.log("error! ");
                        throw new Error('MAJ echouee');
                    }
            }

            res.json(JSON.stringify({ 'error': 'no error' , 'mongodbstatus' :'success' }));

        } catch (e) {
            console.log("error :" + e.message);
            res.json(JSON.stringify({ error: e.message }));
        }

        
    //MODIFICATION d"UN BOT     
    } else if (req.body.action == "editBot") {

        var chatbot = await gestDB.updateItem(MongoDBCollection, { name: "nuv" }, { $set: { loginInfo: [{ "login": "nuvgan" }]  } }, false);
        if (!chatbot) {
            console.log("error! ");
            throw new Error('MAJ echouee');
        }

    //AFFICHAGE DANS LA CONSOLE DU BOT'NUV'
    } else if (req.body.action == "printBrain") {

        try {
            console.log("bot demandé =" + 'nuv');
    
            var b = await gestDB.getBot('nuv');

            if (!b) {
                console.log("error! ");
                throw new Error('joueur pas trouvÃ© : '+'nuv');
            }

            console.log('bot.loginInfo ='+JSON.stringify(b.loginInfo));
            
        } catch (e) {
            console.log("error :" + e.message);
        }
    
    

    //AFFICHAGE DANS LA CONSOLE DES BOTS DANS LA BDD
    } else if (req.body.action == "printAll") {

        try {
            console.log("bot demandé =" + 'ALL');

            var bs = await gestDB.getAllBots(MongoDBCollection);

            if (!bs) {
                console.log("error! ");
                throw new Error('pas de bot en bdd');
            }

            console.log('bots ='+JSON.stringify(bs));
            
        } catch (e) {
            console.log("error :" + e.message);
        }

    } 
    
    //AFFICHAGE DE LA PAGE EJS
    if(req.body.data==undefined) {

        chatbotlist = await gest.getAllChatBotsInfos();
        console.log('chatbotlist =', JSON.stringify(chatbotlist));

        res.render('chatbotlist.ejs', { chatbotlist: chatbotlist })


    }
    
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