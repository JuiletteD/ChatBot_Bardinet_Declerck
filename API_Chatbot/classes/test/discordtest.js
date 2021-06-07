var Worker = require("tiny-worker");
var ChatBot = require('../../ChatBot.js');
var path = require('path');

var chatbot = new ChatBot("rferfe", "refrefe");
var botname = "my bot is so cool";
var token =  "r";
var workerPath = path.join(__dirname, '..', '/worker.js');
var worker = new Worker(workerPath,[botname,token], { esm: true, execArgv: []});


async function init(){
    await chatbot.reloadBrain();
}

init();

worker.onmessage = async function (ev) {
    try{
    message = JSON.parse(ev.data);
    if(message.error!==undefined){
        console.log(JSON.stringify(message.error));
        if(message.error === 'An invalid token was provided.'){
            console.log('bad token');
        }
    }else{

    var reply = await chatbot.getReply(message.author, message.mess.content);
    //console.log(JSON.stringify({ 'message': message.mess, 'resp': reply }))
    worker.postMessage(JSON.stringify({ 'message': message.mess, 'resp': reply }));
    //worker.terminate();
    }
    }catch(error){
        console.log(error);
       
    }
};
