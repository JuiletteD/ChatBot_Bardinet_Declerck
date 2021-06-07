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
- Enregistrer les informations des bots dans la base de donnée et les récupérer.


## Discord
Creer un bot avec accès à au moins un channel : https://discordjs.guide/
Entrer le token associé dans l'interface d'administration.
Entrer un prefix si souhaité.

## Base de donnée Mongodb


## Contenu
#### API Chatbot (API_Chatbot)
Addresse : localhost:3000

#### Interface administration (interface_admin)
L'API doit être lancée pour que ce service fontcionne.
Addresse : localhost:1234

#### Lancement
MacOS or Linux:
$ DEBUG=myapp:* npm start

Windows Command Prompt:

> set DEBUG=myapp:* & npm start

Windows PowerShell:
PS> $env:DEBUG='myapp:*'; npm start
