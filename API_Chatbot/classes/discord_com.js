const ChatBot = require("./ChatBot.js");
var chatbot = new ChatBot();

const Discord = require('discord.js');
class DiscordCom {
	constructor(botname, token) {
		this.botname = botname;
		this.token = "ODQ3MDgxOTI0NDA5Mjk0ODQ4.YK44hA.tGfRawfQY_xErHkei8cAlkoq_fo";
		this.chatbot = new ChatBot();
		this.client = new Discord.Client();
		this.init();
		
	}
	async init() {
		console.log(chatbot.getInfos());
		await chatbot.reloadBrain();
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
