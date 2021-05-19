const ChatBot = require("./ChatBot.js");

class PrivateGestionnaire { // un singleton qui est censé rester le même
    constructor() {
        this.chatBots = [];
    }
    getAllChatBots() {
        return this.chatBots;
    }
    addNewChatBot(name, login) {
        var newChatbot = new ChatBot(name, login);
        this.chatBots.push(newChatbot);
        return newChatbot;
    }
    getChatBotByName(name) {
        var i;
        for (i = 0; i < this.chatBots.length; i++) {
            if(this.chatBots[i].getName()=== name){
                return this.chatBots[i];
            }
        }
    }
    getChatBotInfos(name){
         return this.getChatBotByName(name).getInfos();
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