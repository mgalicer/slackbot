'use strict';

var botkit = require('botkit');

var controller = botkit.slackbot();

var bot = controller.spawn({
    token: process.argv[2];
})

bot.startRTM(function(err, bot, payload) {
    if (err) {
        throw new Error('Could not connect to slack')
    }
});

var questions = ["question 1?", "question 2?", "question 3?"];

function askQuestions(convo){
    questions.forEach(function(question){
        convo.ask(question, function(response, convo){
            convo.next();
        })
    })
}

controller.hears([/./], ['direct_message'], function(bot, message){
    bot.startConversation(message, function(err, convo){
        convo.say("Hey there! Let's get this party started.")
        askQuestions(convo);
        convo.say("Thanks, that's all!")

    }) 
})