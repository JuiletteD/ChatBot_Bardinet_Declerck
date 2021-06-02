const { post } = require('../../interface_admin/app');
var DiscordCom = require('./discord_com');

var myArgs = process.argv.slice(2);
//console.log('myArgs: ', myArgs);

var botname = myArgs[0];
var token = myArgs[1];

var disc = new DiscordCom(botname, token);

onmessage = async function (ev) {
    var recu =""
    try {
        recu = JSON.parse(ev.data)
        const channel = await disc.client.channels.fetch(recu.message.channelID);
        channel.send(recu.resp);
    } catch (error) {
        console.log("not a json received");
    }
};

disc.client.once('ready', () => {
    console.log('Ready!');
    disc.client.user.setUsername(disc.botname);
});

disc.client.on('message', async message => {
    //console.log(JSON.stringify(message.author.username));
    if (message.author.bot === false) {
        //console.log(JSON.stringify(message))
        postMessage(JSON.stringify({ 'mess': message, 'author': message.author.username }));
    }
});

disc.client.login(disc.token);

disc.client.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
    postMessage(JSON.stringify({'error': error}));
});

process.on('unhandledRejection', error => {
	console.log('Unhandled promise rejection:', error);
    postMessage(JSON.stringify({'error':error.message}));
});

