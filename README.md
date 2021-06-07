# ChatBot_Bardinet_Declerck
Projet Service Web

Service d’administration de ChatBot utilisant Rivescript

## Fonctionnalités
Depuis l'interface d'aministration qui appelle les fonctionnalités de l'API Chatbot :
- Créer un bot avec un nom et un fichier rivescript standard.
- Ajouter un fichier rivescript à un bot (pour stocker le nom de l'utillisateur par exemple).
- Accéder à l'interface de discussion propre au bot de l'API en rentrant son login.
- Se connecter à un bot discord en rentrant le token du bot et un prefix.
- Se déconnecter de discord.
- Voir les informations des utilisateurs enregistrées par un bot.
- Voir les informations d'un utilisateur enregistrées par tous les bots.
- Supprimer un bot et ses informations utilisateurs et connections avec.
- Récupérer les informations de la BDD à l'ouverture du service.
- Enregistrer un bot et ses informations dans la BDD.
- Mettre à jour toutes les informations de la BDD en ligne à partir de celle en locale.


## Discord
Creer un bot avec accès à au moins un channel : https://discordjs.guide/.

Entrer le token associé dans l'interface d'administration.

Entrer un prefix si souhaité.

## Base de donnée Mongodb
A l'ouverture du service, les données sont chargées depuis la base de donnée en ligne.

On peut en suite la mettre à jour en enregistrant l'état des bots individullement ou en rechargeant tout l'état local, ce qui permet de tout mettre à jour en une fois, et de supprimer des bots.

## Fichiers Rivescript
Les fichiers rivescript ajoutables sont ceux présents dans /API_Chatbot/classes/brain, tous les fichier rive de ce dossier peuvent être ajoutés aux bot, le fichier rs-standard.rive est les fichier de ce dossier ajouté par défaut à tous les bots créés.


## Contenu
#### API Chatbot (API_Chatbot)
Addresse : localhost:3000

#### Interface administration (interface_admin)
L'API doit être lancée pour que ce service fontcionne.

Addresse : localhost:1234

#### Lancement
MacOS or Linux:

> DEBUG=myapp:* npm start

Windows Command Prompt:

> set DEBUG=myapp:* & npm start

Windows PowerShell:

> $env:DEBUG='myapp:*'; npm start
