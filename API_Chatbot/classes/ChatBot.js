class ChatBot{
  constructor(name, login){
    this.bot = new RiveScript();
    this.name = name;
    this.login = login;
    this.etat = "idle"
    this.brains = ["brain/rs-standard.rive"];
  }
  get brains(){
    return this.brains;
  }
  get etat(){
    return this.brains;
  }
  set etat(etat){
      this.etat = etat;
  }
  reloadBrain(){
    this.bot.loadFile(this.brains).then(loading_done).catch(loading_error);
  }
  addBrains(brain){
      this.brains.push(brain);
      this.reloadBrain();

  }
  getInfos(){
      return {'name':this.name, 'login':this.login, 'etat':this.etat, 'brains':this.brains};
  }
}



function loading_done() {
    console.log("Bot has finished loading!");
  
    // Now the replies must be sorted!
    bot.sortReplies();
  
    // And now we're free to get a reply from the brain!
  
    // RiveScript remembers user data by their username and can tell
    // multiple users apart.
    let username = this.login;
  
    // NOTE: the API has changed in v2.0.0 and returns a Promise now.
    bot.reply(username, "Hello, bot!").then(function(reply) {
      console.log("The bot says: " + reply);
    });
  }
  
  // It's good to catch errors too!
  function loading_error(error, filename, lineno) {
    console.log("Error when loading files: " + error);
  }

module.exports = ChatBot;