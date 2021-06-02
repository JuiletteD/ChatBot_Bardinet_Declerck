const ChatBot = require("./ChatBot.js");
var chatbot = new ChatBot();

const Discord = require('discord.js');
class DiscordCom {
	constructor(botname, token) {
		this.botname = botname;
		this.token = token;
		this.client = new Discord.Client();
	}
	
	run() {
		client.once('ready', () => {
			console.log('Ready!');
			client.user.setUsername(this.botname);
		});

		client.on('message', async message => {
			//console.log(JSON.stringify(message.author.username));
			if (message.author.bot === false) {
				var reply = await chatbot.getReply(message.author.username, message.content);
				console.log(reply)
				message.channel.send(reply);
			}
		});
		client.login(this.token);
	}

}


module.exports = DiscordCom;
