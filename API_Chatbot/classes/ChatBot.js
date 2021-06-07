var RiveScript = require("rivescript")

// classe qui stocke l'utilisation de rivescript, l'accès à discord et les informations
// des utilisateurs pour un bot, représente ce bot
class ChatBot {
  constructor(name) {
    this.bot = new RiveScript({ utf8: true });
    // nom du bot
    this.name = name;
    // tableau des noms des utilisateurs
    this.login = [];

    this.loginInfo = [];
    // cerveaux du bot
    this.brains = ["/brain/rs-standard.rive"];

    //etat de discord : 0 pas de connection; -1 erreur de connection;
    // 1 en tentative de connection; 2 connecté
    this.etatDiscord = 0 
    // worker qui communique avec discord si connecté
    this.worker = null;
  }
  // ajout d'un fichier rivescript
  async addBrains(brain) {
    this.brains.push(brain);
    console.log("Ajout du cerveau "+this.brains+" à "+this.name);
    await this.reloadBrain();
  }
  // ajout d'un utilisateur dans les utilisateurs du bot
  addLogin(login) {
    console.log("Ajout de l'utilisateur "+login+" à "+this.name);
    this.login.push(login);
    this.loginInfo.push({'login':login, 'name': 'unknown', 'age': -1, 'like': 'unknown'});
  }
  // renvoie les informations du bot en json
  async getInfos() {
    await this.getAllUservars();
  
    return { 'name': this.name, 'login': this.login, 'etatDiscord': this.etatDiscord, 'brains': this.brains, 
  'loginInfo': this.loginInfo };
  }

  // Quand le fichier rivescript a fini de charger
  loading_done() {
    console.log("Bot has finished loading!");

    // Now the replies must be sorted!
    this.bot.sortReplies();

  }
  loading_error(error, filename, lineno) {
    console.log("Error when loading files: " + error);
  }

  // recharge les fichiers rivescript
  async reloadBrain() {
    var arr = []
    for (var i = 0; i < this.brains.length; i++) {
      arr.push(__dirname.concat(this.brains[i]));
    }
    await this.bot.loadFile(arr);
    this.loading_done();
  }

  // Renvoie la réponse du bot à un message
  async getReply(username, message) {
    //add user to list if not exists
    //maybe change to higher up to not check every time like here
    if (this.login.indexOf(username) === -1) {
      this.addLogin(username);
    }

    var reply = await this.bot.reply(username, message);
    console.log("Bot ",this.name,"> ", reply);
    return reply;
  }

  // renvoie toutes les informations de tous les utilisateurs du bot
  async getAllUservars() {
    var vars = [];
    for(var i=0;i < this.login.length;i++){
      var temp = await this.getUservars(this.login[i]);
      vars.push(temp);
    }
    //stocke les nouvelles informations dans loginInfos
    this.loginInfo = vars;
    return this.loginInfo;
  }

  // renvoie les informations d'un utilisateur
  async getUservars(username) {
    var vars = await this.bot.getUservars(username);

    var name = 'unknown';
    if(vars.name !== undefined){
      name = vars.name;
    }
    var age = 0;
    if(vars.age !== undefined){
      age = vars.age;
    }
    var like ='unknown';
    if(vars.like !== undefined){
      like = vars.like;
    }

    return {'login':username, 'name': name, 'age': age, 'like': like};
  }

  
  async setUservars(username,userVars2Add) {
    this.bot.setUservar(username,'name',userVars2Add.name);
    this.bot.setUservar(username,'age',userVars2Add.age);
    this.bot.setUservar(username,'like',userVars2Add.like);
    //console.log('ajout des uservars '+JSON.stringify(userVars2Add)+' à '+username)
  }



// déconnecte le chatbot de discord
  disconnectDiscord(){
    if(this.worker!==null){
      console.log("Disconnection de ",this.name," de discord");
      this.worker.terminate();
      this.worker =  null;
      this.etatDiscord = 0;
    }
  }
}

module.exports = ChatBot;