const mongoose = require("mongoose")

const schema = mongoose.Schema({
    name: { type: String, unique: true },
    login: Array,
});

module.exports = mongoose.model("BotNameLogin", schema)