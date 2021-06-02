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
    await chatbot.addBrains("/brain/begin-getUserVar.rive");

    await chatbot.reloadBrain();
    await chatbot.getAllUservars();
    await chatbot.getReply("me", "hello");
    await chatbot.getReply("me", "my name is me");
    await chatbot.getReply("me", "what time is it?");

    await chatbot.getReply("you", "i like blue");
    await chatbot.getReply("you", "my name is Alan.");
    await chatbot.getReply("you", "i'm 2 years old");
    await chatbot.getUservars("you");
    await chatbot.getUservars("me");
    await chatbot.getAllUservars();

}

chatty()
