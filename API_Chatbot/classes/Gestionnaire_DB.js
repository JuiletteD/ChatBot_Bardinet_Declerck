const ChatBot = require("./ChatBot.js");
const Gestionnaire_ChatBot = require("./Gestionnaire_ChatBot.js");
var DbConnection = require("./connect-mongodb");
const CollectionChatbot = "ChatbotDB";

class DBGestionnaire {
    constructor(data) {

    }
    async addItem(collection, data) {
        try {
            let db = await DbConnection.Get();
            var dbo = db.db(CollectionChatbot);

            var result = await dbo.collection(collection).insertOne(data);
            console.log("item cree :" + JSON.stringify(result.ops));
            return result.result.ok;
        } catch (e) {
            return e;
        }
    }

    async getAllItem(collection) {
        let db = await DbConnection.Get();
        var dbo = db.db(CollectionChatbot);

        var tabItems = await dbo.collection(collection).find({}).toArray();
        return tabItems;
    }


    async getJoueur(pseudoT) {
        let db = await DbConnection.Get();
        var dbo = db.db(CollectionChatbot);

        var query = { pseudo: pseudoT };
        var joueur = await dbo.collection("joueurs").findOne(query);
        console.log("joueur selectionné : " + JSON.stringify(joueur));
        return joueur;
    }

    async getItem(collection, query) {
        let db = await DbConnection.Get();
        var dbo = db.db(CollectionChatbot);

        var item = await dbo.collection(collection).findOne(query);
        console.log("item selectionné : " + JSON.stringify(item));
        return item;
    }

    async connectWithPseudo(password, Reqpseudo) {
        let db = await DbConnection.Get();
        var dbo = db.db(CollectionChatbot);

        var query = { pseudo: Reqpseudo };
        var joueur = await dbo.collection("joueurs").findOne(query);
        var j = JSON.stringify(joueur);

        return JSON.parse(j).password === password;
    }

    async connectWithEmail(password, Reqemail) {
        let db = await DbConnection.Get();
        var dbo = db.db(CollectionChatbot);

        var query = { email: Reqemail };
        var joueur = await dbo.collection("joueurs").findOne(query);
        var j = JSON.stringify(joueur);

        return JSON.parse(j).password === password;
    }

    async deleteItem(collection, query) {
        let db = await DbConnection.Get();
        var dbo = db.db(CollectionChatbot);

        var item = await dbo.collection(collection).deleteOne(query);
        console.log("item supprimé : " + JSON.stringify(item));
        return JSON.stringify(item);
    }
    async deleteItemMany(collection, query) {
        let db = await DbConnection.Get();
        var dbo = db.db(CollectionChatbot);

        var item = await dbo.collection(collection).deleteOne(query);
        console.log("item supprimé : " + JSON.stringify(item));
        return JSON.stringify(item);
    }

    async updateItem(collection, query, newvalues, create) {
        let db = await DbConnection.Get();
        var dbo = db.db(CollectionChatbot);

        //    var newvalues = { $set: { pseudo: joueur.pseudo, password: joueur.password, email: joueur.email } };
        var upitem = await dbo.collection(collection).updateOne(query, newvalues, { upsert: create });
        console.log("update : " + JSON.stringify(upitem));
        return upitem.result.ok;
    }

    async deleteAll(collection) {
        let db = await DbConnection.Get();
        var dbo = db.db(CollectionChatbot);

        var res = await dbo.collection(collection).deleteMany({});
        return res.result.ok;
    }

}

module.exports = DBGestionnaire;