var express = require('express');
var router = express.Router();
let ChatbotService = require("../public/classes/ChatbotService.js");

/* GET home page. */
router.get('/', function (req, res, next) {
    chatbotService = new ChatbotService;
    //console.log(chatbotService.getBots());

    res.render('chatbotlist', { chatbotlist: chatbotService.getBots() });
});


router.post('/:nom', function (req, res, next) {
    chatbotService = new ChatbotService;
    console.log("accessing chat page")
    console.log(req.params);

    res.render('chat_box.ejs', { chatbot_id: req.params.nom });

});

module.exports = router;