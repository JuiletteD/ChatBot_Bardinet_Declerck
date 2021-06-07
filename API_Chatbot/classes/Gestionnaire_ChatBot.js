const ChatBot = require("./ChatBot.js");
const fs = require('fs');

class PrivateGestionnaire { // un singleton qui est censé rester le même
    constructor() {
        this.chatBots = []; // les chatbots crées
    }
    async getAllChatBotsInfos() {
        var resp = []
        for (var i = 0; i < this.chatBots.length; i++) {
            var temp = await this.chatBots[i].getInfos();
            resp.push(temp);
        }
        return resp;
    }
    addNewChatBot(name) { // ajout d'un chatbot
        var newChatbot = new ChatBot(name);
        console.log("name :",name,newChatbot)
        this.chatBots.push(newChatbot);
        return newChatbot;
    }
    removeChatBot(name) {  //suppression d'un chatbot
        var deletedObj = null;
        for (var i = 0; i < this.chatBots.length; i++) {
            if (this.chatBots[i].name === name) {
                deletedObj = this.chatBots[i];
                this.chatBots.splice(i, 1);
                if (deletedObj.worker !== null) {
                    deletedObj.disconnectDiscord();
                }
            }
        }
        return deletedObj;
    }
    getChatBotByName(name) {  // récupérer un chatbot
        var i;
        for (i = 0; i < this.chatBots.length; i++) {
            if (this.chatBots[i].name === name) {
                return this.chatBots[i];
            }
        }
    }
    async getChatBotInfos(name) {
        var chatbot = this.getChatBotByName(name);
        var temp = await chatbot.getInfos();
        return temp;
    }
    getRivescriptFile() {  // récupérer la liste des fichier rives disponible (on suppose que tous les fichiers de brain sont des fichiers rive)
        var chaine = "/brain/"
        // charge tous les fichier de brain
        var resp = []
        try {
            const files = fs.readdirSync(__dirname.concat("/brain"));
            files.forEach(file => {
                resp.push(chaine.concat(file))
            });
        } catch (err) {
            console.log(err);
        }

        return resp;
    }
}

class Gestionnaire {  // de l'exterieur : récupération d'une seule et même instance
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