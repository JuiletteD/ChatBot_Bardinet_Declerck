const { post } = require('../../interface_admin/app');
var DiscordCom = require('./discord_com');

var myArgs = process.argv.slice(2);
//console.log('myArgs: ', myArgs);

var botname = myArgs[0];
var token = myArgs[1];

var disc = new DiscordCom(botname, token);

// quand recoit un message du thread principal
onmessage = async function (ev) {
    var recu =""
    try {
        // renvoie le message qui est la réponse du bot sur le canal de discord
        recu = JSON.parse(ev.data)
        const channel = await disc.client.channels.fetch(recu.message.channelID);
        channel.send(recu.resp);
    } catch (error) {
        console.log("not a json received");
    }
};

 // informe le thread principal que la connection est bonne et prête
disc.client.once('ready', () => {
    console.log(disc.botname, 'is ready!');
    postMessage(JSON.stringify({'ready':2}));
    // facultatif : change le nom du bot sur discord pour celui du bot
    disc.client.user.setUsername(disc.botname);

});

// quand recoit un message du serveur, le renvoie au thread principal
disc.client.on('message', async message => {
    //console.log(JSON.stringify(message.author.username));
    if (message.author.bot === false) {
        //console.log(JSON.stringify(message))
        postMessage(JSON.stringify({ 'mess': message, 'author': message.author.username }));
    }
});

// se connecter avec le token fournit
disc.client.login(disc.token);



// Gestion des erreurs
disc.client.on('shardError', error => {
	console.error('A websocket connection encountered an error:', error);
    postMessage(JSON.stringify({'error': error}));
});

process.on('unhandledRejection', error => {
	console.log('Unhandled promise rejection:', error);
    postMessage(JSON.stringify({'error':error.message}));
});

