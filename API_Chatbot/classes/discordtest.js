var Worker = require("tiny-worker");
var ChatBot = require('./ChatBot.js');
var path = require('path');

var chatbot = new ChatBot("rferfe", "refrefe");
var botname = "my bot is so cool";
var token =  "ODQ3MDgxOTI0NDA5Mjk0ODQ4.YK44hA.tGfRawfQY_xErHkei8cAlkoq_fo";
init();

var worker = new Worker(__dirname + "/worker.js",[botname,token], { esm: true, execArgv: []});


async function init(){
    await chatbot.reloadBrain();
}


worker.onmessage = async function (ev) {
    try{
    message = JSON.parse(ev.data);
    /*console.log(message.mess)
    console.log(message.mess.content)
    console.log(message.author)*/

    var reply = await chatbot.getReply(message.author, message.mess.content);
    //console.log(JSON.stringify({ 'message': message.mess, 'resp': reply }))
    worker.postMessage(JSON.stringify({ 'message': message.mess, 'resp': reply }));
    //worker.terminate();
    }catch(error){
        console.log("not a json received-- normal at the beginning of the worker")   
    }
};
