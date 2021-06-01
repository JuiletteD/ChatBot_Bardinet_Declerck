const ChatBot = require("./ChatBot.js");
const fs = require('fs');

class PrivateGestionnaire { // un singleton qui est censé rester le même
    constructor() {
        this.chatBots = [];
    }
    getAllChatBotsInfos() {
        var resp = []
        for (var i = 0; i < this.chatBots.length; i++) {
            resp.push(this.chatBots[i].getInfos());
        }
        return resp;
    }
    addNewChatBot(name) {
        var newChatbot = new ChatBot(name);
        this.chatBots.push(newChatbot);
        return newChatbot;
    }
    removeChatBot(name) {
        var deletedObj = null;
        for (var i = 0; i < this.chatBots.length; i++) {
            if (this.chatBots[i].name === name) {
                deletedObj = this.chatBots[i];
                this.chatBots.splice(i, 1);
            }
        }
        return deletedObj;
    }
    getChatBotByName(name) {
        var i;
        for (i = 0; i < this.chatBots.length; i++) {
            if (this.chatBots[i].name === name) {
                return this.chatBots[i];
            }
        }
    }
    getChatBotInfos(name) {
        return this.getChatBotByName(name).getInfos();
    }
    getRivescriptFile() {
        var chaine = "/brain/"
        // charge tous les fichier de brain
        var resp = []
        // list all files in the directory
        try {
            const files = fs.readdirSync(__dirname.concat("/brain"));
            // files object contains all files names
            // log them on console
            files.forEach(file => {
                resp.push(chaine.concat(file))
            });
        } catch (err) {
            console.log(err);
        }

        return resp;
    }

}

class Gestionnaire {
    constructor() {
        throw new Error('Use Gestionnaire.getInstance()');
    }
    static getInstance() {
        if (!Gestionnaire.instance) {
            Gestionnaire.instance = new PrivateGestionnaire();
        }
        return Gestionnaire.instance;
    }
}

module.exports = Gestionnaire;