var express = require('express');
var Worker = require("tiny-worker");
var path = require('path');
const Gestionnaire = require("../classes/Gestionnaire_ChatBot.js")
var router = express.Router();
let gest = Gestionnaire.getInstance();

/* POST connecter à discord. */
router.post('/connect', async function (req, res, next) {
    var botname = req.body.name
    var connectChatbot = gest.getChatBotByName(botname);
    var ready = 1;

    await connectChatbot.reloadBrain();
    var workerPath = path.join(__dirname, '..', '/classes/worker.js');

    // Création du worker
    connectChatbot.worker = new Worker(workerPath,
        [req.body.name, req.body.token], { esm: true, execArgv: [] });
    connectChatbot.etatDiscord = ready;

    // si recoit un message du worker
    connectChatbot.worker.onmessage = async function (ev) {
        try {
            message = JSON.parse(ev.data);
            console.log("MESSAGE" + ev.data);
            // si la connection a échouée en raison du token
            if (message.error === 'An invalid token was provided.') {
                //console.log(message.error);
                connectChatbot.disconnectDiscord();
                connectChatbot.etatDiscord = -1;
            //si le bot signale qu'il est pret
            } else if (message.ready === 2) {
                connectChatbot.etatDiscord = 2;
            // sinon s'il retransmet un message depuis discord
            } else {
                var reply = await connectChatbot.getReply(message.author, message.mess.content);
                //on lui renvoie la réponse du bot
                connectChatbot.worker.postMessage(JSON.stringify({ 'message': message.mess, 'resp': reply }));

            }
        } catch (error) {
            console.log("not a json received-- normal at the beginning of the worker");
        }
    };

// on attend d'essayer de faire la connection, et on retourne un état différent
// selon si réussite ou échec
    waitForDiscordReady(botname, function (err) {
        throw new Error(err); // error handling function callback

    }, function (botname) { // whenDone 
        var Chatbot1 = gest.getChatBotByName(botname);
        var infos = JSON.stringify(Chatbot1.getInfos());
        console.log("Envoie de : "+infos)

        res.json(infos);
    })
});


/* POST déconnecter discord. */
router.delete('/disconnect', async function (req, res, next) {
    var disconnectChatbot = gest.getChatBotByName(req.body.name);
    disconnectChatbot.disconnectDiscord();

    var infos = JSON.stringify(disconnectChatbot.getInfos());
    console.log(infos)

    res.json(infos);
});


// Attend que la connection se fasse ou échoue
function waitForDiscordReady(botname, err, whenDone) {
    //console.log(botname);
    var Chatbot = gest.getChatBotByName(botname);
    //console.log("in wait for disc ready"+Chatbot.etatDiscord);

    if (Chatbot.etatDiscord === 1) { // not set yet
        setTimeout(waitForDiscordReady.bind(this,botname, null, whenDone), 100); // try again in 100ms
        return; //stop this attempt
    }else if (Chatbot.etatDiscord === -1) {
        console.log("Token does not permit valid.connection");
        whenDone(botname);
        return;
    } else {
        console.log("Else of wait for discord :" + Chatbot.etatDiscord)
        whenDone(botname);
        return;
    }
}


module.exports = router;