const ChatBot = require("./ChatBot.js");
const Gestionnaire_ChatBot = require("./Gestionnaire_ChatBot.js");
const mongoose = require('mongoose');
const BotNameLogin = require('./models/BotNameLogin.js');

class DBGestionnaire {
    constructor() {
        this.url = "mongodb+srv://rbardinet:chatbot2021@chatbotcluster.dxxc0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
        console.log("call DBGestionnaire.init() next");
    }

    testPrint() {
        console.log("testprint from gestionnaire_DB")
    }

    init() {
        console.log("DBGestionnaire.init() is being called");
        mongoose
            .connect(this.url, { useNewUrlParser: true })
        const db = mongoose.connection
        db.once('open', _ => {
            console.log('Database connected:', this.url)
        })
        db.on('error', err => {
            console.error('connection error:', err)
        })

        return db;
    }

    async findBotNameLogins() {
        const docs = await BotNameLogin.find();
        return docs
    }

    async createBotNameLogins(name, logins) {
        const newdoc = new BotNameLogin({
            name: name,
            login: logins,
        })
        await newdoc.save()
    }
        

    initChatbotShortSchema() {
        const Schema = mongoose.Schema
        const schema = new Schema({
            name: { type: String, unique: true },
            login: Array
        })
        return mongoose.model('Chatbot_Short', schema)
    }

    initChatbotConvoSchema() {
        const Schema = mongoose.Schema
        const schema = new Schema({
            name: { type: String, unique: true },
            login: { type: String, unique: true },
            messages: Array
        })
        return mongoose.model('Chatbot_Convos', schema)
    }

    createChatbotConvo(ChatbotConvoSchema, name, login, message) {

        const ChatbotShort = new ChatbotConvoSchema({
            name: name,
            login: login,
            messages: messages
        })

        return ChatbotShort
    }

    async updateChatbotConvo(ChatbotConvoSchema, name, login, message) {
        targetDocument = await ChatbotConvoSchema.findOne({ name: name , login: login});

        targetDocument.messages.push(message);
        await targetDocument.save();
        
    }

    initChatbotInfosSchema() {
        const Schema = mongoose.Schema
        const schema = new Schema({
            bot : "lol",
            name: { type: String, unique: true },
            login: { type: String, unique: true },
            messages: Array
        })
        return mongoose.model('Chatbot_Infos', schema)
    }

    initChatbotBrainSchema() {
        const Schema = mongoose.Schema
        const schema = new Schema({
            name: { type: String, unique: true },
            file: { type: String }
        })
        return mongoose.model('Brains', schema)
    }

    createChatbotShort(ChatbotShortSchema,name,login) {

        const ChatbotShort = new ChatbotShortSchema({
            name: name,
            login: login
        })

        return ChatbotShort
    }

    createChatbotBrain(ChatbotBrainSchema, name, file) {

        const ChatbotBrain = new ChatbotBrainSchema({
            name: name,
            file: file
        })

        return ChatbotBrain
    }

    async saveChatbotShort(shortChatBot) {
        await shortChatBot.save(function (error, document) {
            if (error) console.error(error)
            console.log(document)
        })
    }

    //login doit être un ARRAY
    async editChatbotShort(shortChatBot,name,login) {
        const targetChatBot = await shortChatBot.findOne({ name: name });
        targetChatBot.login = login;

        const doc = await targetChatBot.save();
        console.log(doc);
    }


}

module.exports = DBGestionnaire;