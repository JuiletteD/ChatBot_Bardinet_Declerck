var RiveScript = require("rivescript")

class ChatBot {
  constructor(name) {
    this.bot = new RiveScript({ utf8: true });
    this.name = name;
    this.login = [];
    this.etat = "idle"
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
    return { 'name': this.name, 'login': this.login, 'etat': this.etat, 'brains': this.brains, 
  'uservars': uservars };
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
    //console.log(vars);
    return vars;
  }
  async getUservars(username) {
    var vars = await this.bot.getUservars(username);
    console.log(vars);
    return vars;
  }
  disconnectDiscord(){
    if(this.worker!==null){
      console.log('disconnected of discord');
      this.worker.terminate();
      this.worker =  null;
      this.etat = 'idle';
    }
  }
}

module.exports = ChatBot;