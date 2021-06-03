var RiveScript = require("rivescript")

class ChatBot {
  constructor(name) {
    this.bot = new RiveScript({ utf8: true });
    this.name = name;
    this.login = [];
    this.etatDiscord = 0 //etat de discord : 0 pas de connection; -1 erreur de connection;
    // 1 en tentative de connection; 2 connecté
    this.brains = ["/brain/rs-standard.rive"];
    this.worker = null;
  }
  async addBrains(brain) {
    this.brains.push(brain);
    console.log(this.brains);
    await this.reloadBrain();
  }
  addLogin(login) {
    this.login.push(login);
  }
  getInfos() {
    var uservars = JSON.stringify(this.getAllUservars());
    console.log(uservars);
    return { 'name': this.name, 'login': this.login, 'etatDiscord': this.etatDiscord, 'brains': this.brains, 
  'uservars': uservars };
  }
  loading_done() {
    console.log("Bot has finished loading!");

    // Now the replies must be sorted!
    this.bot.sortReplies();

  }
  loading_error(error, filename, lineno) {
    console.log("Error when loading files: " + error);
  }
  async reloadBrain() {
    this.etatDiscord = "loading"
    var arr = []
    for (var i = 0; i < this.brains.length; i++) {
      arr.push(__dirname.concat(this.brains[i]));
    }

    await this.bot.loadFile(arr);
    this.loading_done();
  }

  async getReply(username, message) {
    //add user to list if not exists
    //maybe change to higher up to not check every time like here
    if (this.login.indexOf(username) === -1) {
      this.addLogin(username);
    }

    var reply = await this.bot.reply(username, message);
    console.log("Bot>", reply);
    return reply;
  }
  async getAllUservars() {
    var vars = [];
    for(var i=0;i<this.login.length;i++){
      vars.push(await this.bot.getUservars(this.login[i]));
    }
    return vars;
  }
  async getUservars(username) {
    var vars = await this.bot.getUservars(username);
    return vars;
  }
  disconnectDiscord(){
    if(this.worker!==null){
      console.log('disconnected of discord');
      this.worker.terminate();
      this.worker =  null;
      this.etatDiscord = 0;
    }
  }
}

module.exports = ChatBot;