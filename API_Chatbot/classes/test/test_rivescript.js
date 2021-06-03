var RiveScript = require("rivescript");
//var bot = new RiveScript();
var ChatBot = require('../ChatBot.js');
const Gestionnaire = require("../Gestionnaire_ChatBot.js")

async function chatty() {

    var chatbot = new ChatBot("bob");
 //   var chatbot = new ChatBot()
//await chatbot.addBrains("brain/begin-getUserVar.rive" );
//console.log(chatbot.getInfos());
    console.log(chatbot.getInfos());
    await chatbot.addBrains("/brain/begin-getUserVar.rive");

    await chatbot.reloadBrain();

    await chatbot.getReply("me", "hello");
    await chatbot.getReply("me", "my name is me");
    await chatbot.getReply("me", "i like chocolat");

    await chatbot.getReply("you", "i like blue");
    await chatbot.getReply("you", "my name is Alan.");
    await chatbot.getReply("you", "i'm 2 years old");
   // console.log(await chatbot.getUservars("you"));
    //console.log(await chatbot.getUservars("me"));
   await chatbot.getAllUservars();
console.log(chatbot.loginInfo);
await chatbot.getInfos();
}

chatty()
