var express = require('express');
var router = express.Router();
const Gestionnaire = require("../classes/Gestionnaire_ChatBot.js")
const DBGestionnaire = require("../classes/Gestionnaire_DB.js")

var fs = require('fs')
var Binary = require('mongodb').Binary;

let gestDB = new DBGestionnaire;
const db = gestDB.init();

//Le schéma doit être compilé une unique fois
const ChatbotShortSchema = gestDB.initChatbotShortSchema();
const ChatbotBrainSchema = gestDB.initChatbotBrainSchema();
const ChatbotConvoSchema = gestDB.initChatbotConvoSchema();


/* GET liste de chatbots avec lesquels communiquer */
router.get('/', async function (req, res, next) {
<<<<<<< HEAD
    let gest = Gestionnaire.getInstance();
    newchatbot1 = gest.addNewChatBot('steeve', 'juliette');
    newchatbot2 = gest.addNewChatBot('max', 'romain');
    chatbotlist = await gest.getAllChatBotsInfos();
=======
    
    /*
    const ChatbotShortList = await ChatbotShortSchema.find();
    console.log("liste des chatbots dans la bdd :" + ChatbotShortList);
    */
    
    let gest = Gestionnaire.getInstance();
    chatbotlist = gest.getAllChatBotsInfos();
>>>>>>> f1a76d74a338ec7f9521682c2ed119fd878b3754
    console.log('chatbotlist =',JSON.stringify(chatbotlist));

    res.render('chatbotlist.ejs', { chatbotlist: chatbotlist })
});

router.post('/', async function (req, res, next) {
    if (req.body.action == "eraseDB") {
        console.log("ERASING DBBDBDBDBBDBDDBDB")
        await ChatbotShortSchema.deleteMany({});
        await ChatbotBrainSchema.deleteMany({});

<<<<<<< HEAD
router.post('/:nom', async function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    newchatbot = gest.getChatBotByName(req.body.name);
=======
    } else if (req.body.action == "createBot") {
        const chatbotShort = gestDB.createChatbotShort(ChatbotShortSchema, 'SteeveTest2', ['Julietest']);
        await gestDB.saveChatbotShort(chatbotShort);
        
    } else if (req.body.action == "editBot") {
        const chatbotTarg = await ChatbotShortSchema.findOne({ name: 'SteeveTest2' });
        console.log("chatboTARG = " + chatbotTarg);
        await gestDB.editChatbotShort(ChatbotShortSchema, 'SteeveTest2', ['romaintest']);

    } else if (req.body.action == "printBrain") {
        let gest = Gestionnaire.getInstance();
        newchatbot1 = gest.addNewChatBot('steeve');
        console.log(gest.getAllChatBotsInfos());
        console.log(gest.getRivescriptFile());
        let filename = "./classes/" + gest.getRivescriptFile()[0];
        let data = fs.readFile(filename, 'utf8', function (err, data) {
            if (err) throw err;
            console.log('OK: ' + filename);
            console.log(JSON.stringify(data))
        });
        let insert_data = {};
        insert_data.file_data = Binary(data);

        const brain = gestDB.createChatbotBrain(ChatbotBrainSchema, gest.getRivescriptFile()[0], JSON.stringify(data));
        await gestDB.saveChatbotShort(brain);
        /*
        db.collection('Brains').insert(data, function (err, result) {
            console.log(result)
        });
        */
    }

    ChatbotBrainSchema.find().then(Brainlist => {
        console.log("brains in the DB = " + Brainlist)
    });
    ChatbotShortSchema.find().then(ChatbotShortList => {
        res.render('chatbotlist.ejs', { chatbotlist: ChatbotShortList });
        console.log("liste des chatbots dans la bdd :" + ChatbotShortList);
    });
    
    
>>>>>>> f1a76d74a338ec7f9521682c2ed119fd878b3754

});


router.post('/:nom', async function (req, res, next) {

    console.log("req = "+JSON.stringify(req.body)+JSON.stringify(req.params))

    //Si il s'agit du première accès à la page de tchat, le bot ne dit rien
    if(req.body.isFirstAccess=='yes'){
        res.render('chat_box.ejs', { chatbot_name: req.body.name , userLogin: req.body.login, botReply: undefined});
    }

    //Si au contraire un message est envoyé par l'utilisateur, on le traite et on renvoie une réponse
    if (req.body.isFirstAccess == 'no') {
        console.log("generating bot reply for bot = " + req.params.nom)
        

        try {
            
            let gest = Gestionnaire.getInstance();
<<<<<<< HEAD
            chatbot = gest.addNewChatBot(req.body.name, req.body.userChatting);
            console.log(await gest.getChatBotInfos(req.body.name));
            console.log(await chatbot.getInfos());
=======
            console.log("get chatbot info = "+JSON.stringify(gest.getChatBotInfos(req.params.nom)));
            console.log("login for chatbot = "+JSON.stringify(gest.getChatBotInfos(req.params.nom).login));
>>>>>>> f1a76d74a338ec7f9521682c2ed119fd878b3754

            //On vérifie si l'utilisateur fait parti des logins listés dans les infos du bot,
            //Si ce n'est pas le cas, on l'y ajoute.

            
            if (!(JSON.stringify(gest.getChatBotInfos(req.params.nom).login)).includes(req.body.userChatting)) {
                gest.getChatBotByName(req.params.nom).addLogin(req.body.userChatting)
                console.log("updated login for chatbot = " + JSON.stringify(gest.getChatBotInfos(req.params.nom).login))

                //On fait de même dans la BDD
                
                //const chatbotTarg = await ChatbotShortSchema.findOne({ name: req.params.nom });
                //console.log("chatboTARG = " + chatbotTarg);
                //await gestDB.editChatbotShort(ChatbotShortSchema, req.params.nom, [req.body.userChatting]);
                

            }
            
            
                
            await gest.getChatBotByName(req.params.nom).reloadBrain();
            let botReply = undefined;
            gest.getChatBotByName(req.params.nom).getReply(req.body.userChatting, req.body.userMessage).then((reply) => {
                console.log("generated reply :" + reply);
                res.send(JSON.stringify({ 'chatbot_name': req.params.nom, 'userLogin': req.body.login, 'botReply': reply }));
            });
            //console.log("generated chatbot reply :" + botReply);

            //res.send(JSON.stringify({ 'chatbot_name': req.params.nom, 'userLogin': req.body.login, 'botReply': JSON.stringify(botReply) }));
            
        } catch (err) {
            //console.error(err);
            //res.send(JSON.stringify({ 'chatbot_name': req.params.nom, 'userLogin': req.body.login, 'botReply': err }));
        }
    }

});

module.exports = router;