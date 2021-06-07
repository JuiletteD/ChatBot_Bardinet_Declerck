var MongoClient = require('mongodb').MongoClient;

var DbConnection = function () {
    var datab = null;
    var instance = 0;
    async function DbConnect() {
        try {
            let url = "mongodb+srv://rbardinet:chatbot2021@chatbotcluster.dxxc0.mongodb.net/chatbotDB?retryWrites=true&w=majority";
            let client = new MongoClient(url, { useUnifiedTopology: true });

            let datab = await client.connect();

            return datab;
        } catch (e) {
            throw e
        }
    }

    async function Get() {
        try {
            instance++;     // this is just to count how many times our singleton is called.
            console.log(`DbConnection called ${instance} times`);
            if (datab != null) {
                console.log(`db connection is already alive`);
                return datab;
            } else {
                console.log(`getting new db connection`);
                datab = await DbConnect();
                return datab;
            }
        } catch (e) {
            throw e;
        }
    }
    return {
        Get: Get
    }

    async function listDatabases(client) {
        databasesList = await client.db().admin().listDatabases();

        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    };
}


module.exports = DbConnection();