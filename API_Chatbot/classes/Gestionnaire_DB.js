const ChatBot = require("./ChatBot.js");
const Gestionnaire_ChatBot = require("./Gestionnaire_ChatBot.js");
var DbConnection = require("./connect-mongodb");
const DatabaseChatBot = "ChatbotDB";
const MongoDBCollection = "chatbot_logins_uservar"

class DBGestionnaire {
    constructor(data) {

    }
    async addItem(collection, data) {
        try {
            let db = await DbConnection.Get();
            var dbo = db.db(DatabaseChatBot);

            var result = await dbo.collection(collection).insertOne(data);
            console.log("item cree :" + JSON.stringify(result.ops));
            return result.result.ok;
        } catch (e) {
            return e;
        }
    }

    async getAllBots(collection) {
        let db = await DbConnection.Get();
        var dbo = db.db(DatabaseChatBot);

        var tabItems = await dbo.collection(collection).find({}).toArray();
        return tabItems;
    }


    async getBot(botname) {
        let db = await DbConnection.Get();
        var dbo = db.db(DatabaseChatBot);

        var query = { name: botname };
        var bot = await dbo.collection(MongoDBCollection).findOne(query);
        console.log("joueur selectionné : " + JSON.stringify(bot));
        return bot;
    }

    async deleteItem(collection, query) {
        let db = await DbConnection.Get();
        var dbo = db.db(DatabaseChatBot);

        var item = await dbo.collection(collection).deleteOne(query);
        console.log("item supprimé : " + JSON.stringify(item));
        return JSON.stringify(item);
    }
    
    async deleteItemMany(collection, query) {
        let db = await DbConnection.Get();
        var dbo = db.db(DatabaseChatBot);

        var item = await dbo.collection(collection).deleteOne(query);
        console.log("item supprimé : " + JSON.stringify(item));
        return JSON.stringify(item);
    }

    async updateItem(collection, query, newvalues, create) {
        let db = await DbConnection.Get();
        var dbo = db.db(DatabaseChatBot);

        //    var newvalues = { $set: { pseudo: joueur.pseudo, password: joueur.password, email: joueur.email } };
        var upitem = await dbo.collection(collection).updateOne(query, newvalues, { upsert: create });
        console.log("update : " + JSON.stringify(upitem));
        return upitem.result.ok;
    }

    async deleteAll(collection) {
        let db = await DbConnection.Get();
        var dbo = db.db(DatabaseChatBot);

        var res = await dbo.collection(collection).deleteMany({});
        return res.result.ok;
    }

}

module.exports = DBGestionnaire;