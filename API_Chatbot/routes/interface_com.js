var express = require('express');
var router = express.Router();
var methodOverride = require('method-override');
const { Collection } = require('mongoose');
router.use(methodOverride('_method'));
const Gestionnaire = require("../classes/Gestionnaire_ChatBot.js");
const DBGestionnaire = require("../classes/Gestionnaire_DB.js");
const BotNameLoginVar4DB = require("../classes/models/BotNameLoginVar.js");
const MongoDBCollection = "chatbot_logins_uservar";

let gestDB = new DBGestionnaire;

/* GET liste de chatbots avec lesquels communiquer */
router.get('/', async function (req, res, next) {
    console.log('get on /chat req.body =', JSON.stringify(req.body));
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
        console.log("ERASING MongoDB FILES");
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

    //RAZ DE LA LBDD
    } else if (req.body.action == "eraseLDB") {
        console.log("ERASING LDB");
        try {
            let cblist = await gest.getAllChatBotsInfos();

            cblist.forEach(async (bot) => {
                gest.removeChatBot(bot.name);
            })

            console.log('chatbots removed');

        } catch (e) {
            console.log("error :" + e.message);
            res.json(JSON.stringify({ error: e.message }));
        }

    //SAUVEGARDE UNITAIRE DANS BDD MONGO
    } else if (req.body.data!== undefined && req.body.data.save2db) {
        try {
            //r??cup??ration de donn??es dans le cache de l'api
            let infos = await gest.getChatBotInfos(req.body.data.botname);
            console.log("infos collected = " + JSON.stringify(infos));
            

            //verifier si bot dans db
            console.log("bot demand?? = " + req.body.data.botname);
    
            var b = await gestDB.getBot(req.body.data.botname);

            //si bot inexistant, il faut le creer
            if (!b) {
                console.log('bot inexistant : '+req.body.data.botname);

                let bot4db = {};
                bot4db.name = infos.name;
                bot4db.brains = infos.brains;
                bot4db.loginInfo = infos.loginInfo;
                bot4db.etatDiscord = infos.etatDiscord;

                var chatnot2db = await gestDB.addItem(MongoDBCollection, bot4db);
                if (!chatnot2db) {
                    console.log("error! ");
                    throw new Error('ajout bot echou??');
                } else {
                    console.log("bot ajout??");
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

    //SAUVEGARDE GENERALE DANS BDD MONGO
    } else if (req.body.action == 'local2mongoDB') {
        try {            
            //On supprime les donn??es existantes en BDD
            console.log("ERASING CLOUD DB");
            gestDB.deleteAll(MongoDBCollection) ; 

            //r??cup??ration de donn??es dans le cache de l'api
            let infos = await gest.getAllChatBotsInfos();
            console.log("infos collected = " + JSON.stringify(infos));
            
            infos.forEach(async(botInfo)=>{
                console.log("bot demand?? = " + botInfo.name);

                let bot4db = {};
                bot4db.name = botInfo.name;
                bot4db.brains = botInfo.brains;
                bot4db.loginInfo = botInfo.loginInfo;
                bot4db.etatDiscord = botInfo.etatDiscord;

                var chatnot2db = await gestDB.addItem(MongoDBCollection, bot4db);
                if (!chatnot2db) {
                    console.log("error! ");
                    throw new Error('ajout bot echou??');
                } else {
                    console.log("bot ajout??");
                }

            
            });
            //verifier si bot dans db
            
        } catch (e) {
            console.log("error :" + e.message);
            res.json(JSON.stringify({ error: e.message }));
        }    

    

    //AFFICHAGE DANS LA CONSOLE DES BOTS DANS LA BDD
    } else if (req.body.action == "printAll") {

        try {

            var bs = await gestDB.getAllBots(MongoDBCollection);

            if (!bs) {
                console.log("error! ");
                throw new Error('pas de bot en bdd');
            }

            console.log('bots retrieved from Mongo DB ='+JSON.stringify(bs));
            
        } catch (e) {
            console.log("error :" + e.message);
        }

    //AFFICHAGE DANS LA CONSOLE DES BOTS DANS LA BDD LOCAL
    } else if (req.body.action == "printLDB") {

        try {
            console.log("bot LDB demand?? =" + 'ALL');

            var bs = await gest.getAllChatBotsInfos();

            console.log('bots ='+JSON.stringify(bs));
            
        } catch (e) {
            console.log("error :" + e.message);
        }


    //LOAD ALL BOTS DEPUIS MONDODB DANS LA BDD LOCAL
    } else if (req.body.action == "loadBdd") {

        try {

            var bs = await gestDB.getAllBots(MongoDBCollection);
            var ondiskBots = await gest.getAllChatBotsInfos();
            let ondiskBotsNAMES = [];
            ondiskBots.forEach(element => {ondiskBotsNAMES.push(element.name)});


            if (!bs) {
                console.log("error! ");
                throw new Error('pas de bot en bdd');
            }
            
            console.log('retrieving bots from MongoDB');
            bs.forEach((element,index)=>{
                console.log('bot n0 '+index+' = '+JSON.stringify(element));
                console.log('||')
            })

            bs.forEach(async (element) => {

                if(ondiskBotsNAMES.includes(element.name)){
                    console.log('Bot named '+element.name+' is already in local files !');
                }else{
                    //CREATION DU BOT
                    let chatbot_ok = await gest.addNewChatBot(element.name);
                    if(chatbot_ok==0){

                        let chatbot = await gest.getChatBotByName(element.name);

                        //AJOUT LOGININFO              
                    
                        element.loginInfo.forEach(async (loginInfo1,index) => {
                            
                            //PARTIE BOT RIVESCRIPT
                            //await chatbot.setUservars(loginInfo1.login,{'name':loginInfo1.name,'age':loginInfo1.age,'like':loginInfo1.like});
                            await chatbot.setUservars(loginInfo1.login,loginInfo1);
                            
                            //PARTIE CLASS CHATBOT
                            chatbot.login.push(loginInfo1.login);
                            chatbot.loginInfo.push(loginInfo1);


                        })

                        //AJOUT ETATDISCORD
                        chatbot.etatDiscord = element.etatDiscord;

                        //AJOUT CERVEAUX
                        var hasBrain = false;

                        element.brains.forEach(async (brain) => {
                            // on v??rifie si le cerveau ?? ajouter n'existe pas d??j??
                            for (var j = 0; j < chatbot.brains.length; j++) {
                                if (brain === chatbot.brains[j]) {
                                    hasBrain = true;
                                }
                            }
                            if (brain === undefined) {
                                console.log("brain is undefined !");
                            } else if (hasBrain) {
                                console.log(element.name+" already hasBrain !"+brain);
                            } else {
                                await chatbot.addBrains(brain);
                            }
                            hasBrain = false
                        });

                        let finalbot = JSON.stringify(await chatbot.getInfos());
                        console.log('bot ajoute ='+finalbot);
                        console.log('||');

                    }else{
                        console.log('Erreur lors de la cr??ation du bot');
                    }
                }

                
                
            });


            
        } catch (e) {
            console.log("error :" + e.message);
        }

    }
    
    
    
    //AFFICHAGE DE LA PAGE EJS
    if(req.body.data==undefined) {

        chatbotlist = await gest.getAllChatBotsInfos();

        res.render('chatbotlist.ejs', { chatbotlist: chatbotlist })
    }
    
});


router.post('/:nom', async function (req, res, next) {

    console.log("req = "+JSON.stringify(req.body)+JSON.stringify(req.params))

    //Si il s'agit du premier acc??s ?? la page de tchat, le bot ne dit rien
    if(req.body.isFirstAccess == 'yes'){
        res.render('chat_box.ejs', { chatbot_name: req.body.name , userLogin: req.body.login, botReply: undefined});
    }

    //Si au contraire un message est envoy?? par l'utilisateur, on le traite et on renvoie une r??ponse
    if (req.body.isFirstAccess == 'no') {
        console.log("generating bot reply for bot = " + req.params.nom)
        

        try {
            
            let gest = Gestionnaire.getInstance();
            let chatbot = gest.getChatBotByName(req.params.nom);
            
            await chatbot.reloadBrain();
            var reply = await chatbot.getReply(req.body.userChatting, req.body.data.userMessage);
            console.log("generated reply :" + reply);
            res.send(JSON.stringify({ 'chatbot_name': req.params.nom, 'userLogin': req.body.login, 'botReply': reply }));
        
        } catch (err) {
            console.error(err);
        }
    }

});

module.exports = router;