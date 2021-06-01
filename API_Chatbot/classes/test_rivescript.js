var RiveScript = require("rivescript");
//var bot = new RiveScript();
var ChatBot = require('./ChatBot.js');
const Gestionnaire = require("../classes/Gestionnaire_ChatBot.js")


async function chatty() {

    var chatbot = new ChatBot();
 //   var chatbot = new ChatBot()
//await chatbot.addBrains("brain/begin-getUserVar.rive" );
//console.log(chatbot.getInfos());
    console.log(chatbot.getInfos());
    await chatbot.reloadBrain();
    await chatbot.getReply("me", "hello");
    await chatbot.getReply("me", "how do you do?");
    await chatbot.getReply("me", "what time is it?");

    await chatbot.addBrains("brain/begin-getUserVar.rive");
    await chatbot.getReply("me", "hello");
    await chatbot.getReply("me", "I'm Alan.");
    await chatbot.getReply("me", "what time is it?");
    await chatbot.getUservarsBot("me");
    console.log(chatbot.getInfos());

}

//chatty()
