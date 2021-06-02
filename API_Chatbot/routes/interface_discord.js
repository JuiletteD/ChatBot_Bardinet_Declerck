var express = require('express');
var Worker = require("tiny-worker");
var path = require('path');
const Gestionnaire = require("../classes/Gestionnaire_ChatBot.js")
var router = express.Router();

/* POST connecter à discord. */
router.post('/connect', async function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    connectChatbot = gest.getChatBotByName(req.body.name);
    var ready = 'discord charge';


    if (connectChatbot.etat !== 'idle') {
        await connectChatbot.reloadBrain();
        var workerPath = path.join(__dirname, '..', '/classes/worker.js');

        connectChatbot.worker = new Worker(workerPath,
            [req.body.name, req.body.token], { esm: true, execArgv: [] });
        connectChatbot.etat = ready;

        connectChatbot.worker.onmessage = async function (ev) {
            try {
                message = JSON.parse(ev.data);

                if (message.error === 'An invalid token was provided.') {
                    console.log(message.error);
                    connectChatbot.disconnectDiscord();
                } else if(message.ready === 'discord actif'){
                    connectChatbot.etat = 'discord actif';
                }else{
                    var reply = await connectChatbot.getReply(message.author, message.mess.content);
                    connectChatbot.worker.postMessage(JSON.stringify({ 'message': message.mess, 'resp': reply }));
                    
                }
            } catch (error) {
                console.log("not a json received-- normal at the beginning of the worker");
            }
        };
        
        connectChatbot.etat = waitForDiscordReady(connectChatbot);


    }

    var infos = JSON.stringify(connectChatbot.getInfos());
    console.log(infos)

    res.json(infos);

});


/* POST déconnecter discord. */
router.delete('/disconnect', async function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    var disconnectChatbot = gest.getChatBotByName(req.body.name);
    disconnectChatbot.disconnectDiscord();

    var infos = JSON.stringify(disconnectChatbot.getInfos());
    console.log(infos)

    res.json(infos);
});


function waitForDiscordReady(connectChatbot) {
    if (connectChatbot.etat === 'discord charge') { // not set yet
        setImmediate(waitForDiscordReady(connectChatbot)); // try again on the next event loop cycle
        return; //stop this attempt
    }else if (connectChatbot.etat === 'discord actif') {
        return connectChatbot.etat;
    }else if (connectChatbot.etat === 'idle'){
        return 'connection failed'        
    }
}


module.exports = router;