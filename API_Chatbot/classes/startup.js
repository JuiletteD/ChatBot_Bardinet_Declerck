if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
const fetch = require('node-fetch');

class Startup {

    constructor(){

    }

    //Suppression des données actuellement sur le serveur
    async supLocal (){
        
        try {
            console.log('erasing local database');
            await fetch('http://localhost:'+process.env.PORT+'/chat', {
            method: "POST",
            body: JSON.stringify({
            action: 'eraseLDB'
            }),
            headers: {
            "Content-type": "application/json",
            },
        });
        } catch(e){
            console.log('Error while deleting local files = '+e)
        }
        
        
    }
    
    
    //Telechargement des données de MongoDB
    async loadMongoData() {
        
        try {
            console.log('downloading from MongoDB');
            await fetch('http://localhost:'+process.env.PORT+'/chat', {
            method: "POST",
            body: JSON.stringify({
            action: 'loadBdd'
            }),
            headers: {
            "Content-type": "application/json",
            },
        });
        } catch(e){
            console.log('Error while loading MongoDB files = '+e)
        }
        
    }

    async starting(){
        if(process.env.ERASE_LOCAL_DB_ON_STARTUP == 1){
            this.supLocal();
        }
        if(process.env.AUTO_MONGODB_DOWNLOAD == 1){
           this.loadMongoData(); 
        }
    }
}

module.exports = Startup;