var express = require('express');
var Worker = require("tiny-worker");
var path = require('path');
const Gestionnaire = require("../classes/Gestionnaire_ChatBot.js")
var router = express.Router();

/* POST connecter à discord. */
router.post('/connect', async function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    connectChatbot = gest.getChatBotByName(req.body.name);
    await connectChatbot.reloadBrain();
    var workerPath = path.join(__dirname, '..', '/classes/worker.js');

    connectChatbot.worker = new Worker(workerPath,
        [req.body.name, req.body.token], { esm: true, execArgv: [] });
    connectChatbot.etat = "discord actif";

    connectChatbot.worker.onmessage = async function (ev) {
        try {
            message = JSON.parse(ev.data);
            var reply = await connectChatbot.getReply(message.author, message.mess.content);
            connectChatbot.worker.postMessage(JSON.stringify({ 'message': message.mess, 'resp': reply }));
        } catch (error) {
            console.log("not a json received-- normal at the beginning of the worker")
        }
    };

    var infos = JSON.stringify(connectChatbot.getInfos());
    console.log(infos)

    res.json(infos);
});


/* POST déconnecter discord. */
router.delete('/disconnect', async function (req, res, next) {
    let gest = Gestionnaire.getInstance();
    var disconnectChatbot = gest.getChatBotByName(req.body.name);

    disconnectChatbot.worker.terminate();
    disconnectChatbot.etat = "idle";

    var infos = JSON.stringify(disconnectChatbot.getInfos());
    console.log(infos)

    res.json(infos);
});



module.exports = router;