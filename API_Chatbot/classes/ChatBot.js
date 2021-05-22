var RiveScript = require("rivescript")

class ChatBot {
  constructor(name, login) {
    this.bot = new RiveScript({ utf8: true });
    this.name = name;
    this.login = login;
    this.etat = "idle"
    this.brains = ["brain/rs-standard.rive"];
  }
  async addBrains(brain) {
    this.brains.push(brain);
    await this.reloadBrain();
  }
  getInfos() {
    return { 'name': this.name, 'login': this.login, 'etat': this.etat, 'brains': this.brains };
  }
  loading_done() {
    console.log("Bot has finished loading!");

    // Now the replies must be sorted!
    this.bot.sortReplies();
    this.etat = "idle";

  }
  loading_error(error, filename, lineno) {
    console.log("Error when loading files: " + error);
  }
  async reloadBrain() {
    this.etat = "loading"
    await this.bot.loadFile(this.brains);
    this.loading_done();
  }

  async getReply(username, message) {
    var reply = await this.bot.reply(username, message);
    console.log("Bot>", reply);
    return reply;
  }
  async getUservarsBot(username){
    var vars =await this.bot.getUservars(username);
    console.log(vars);
    return vars;
  }
}

module.exports = ChatBot;