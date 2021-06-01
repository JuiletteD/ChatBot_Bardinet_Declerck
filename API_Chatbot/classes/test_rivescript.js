var RiveScript = require("rivescript");
//var bot = new RiveScript();
var ChatBot = require('./ChatBot.js');
const Gestionnaire = require("../classes/Gestionnaire_ChatBot.js")
var DiscordCom = require('./discord_com');

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

    await chatbot.addBrains("/brain/begin-getUserVar.rive");
    await chatbot.getReply("me", "i like blue");
    await chatbot.getReply("me", "my name is Alan.");
    await chatbot.getReply("me", "i'm 2 years old");
    await chatbot.getUservarsBot("me");
    console.log(chatbot.getInfos());
    
}
var disc = new DiscordCom("rédé", "me", "it");
disc.run();
//chatty()
