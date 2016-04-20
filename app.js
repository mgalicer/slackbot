'use strict';

var botkit = require('botkit');
var controller = botkit.slackbot();

var env = require('dotenv');
require('dotenv').config();

var googleSpreadsheet = require("google-spreadsheet");
var doc = new googleSpreadsheet(GOOGLE_SPREADSHEET_TOKEN);
var creds = require('./slackbot-3d0709e161bd.json')

var bot = controller.spawn({
    token: process.env.SLACK_TOKEN
})

bot.startRTM(function(err, bot, payload) {
    if (err) {
        throw new Error('Could not connect to slack')
    }
});

var questions = ["question 1?", "question 2?", "question 3?"];
var responses = {}

function askQuestions(convo){
    questions.forEach(function(question){
        convo.ask(question, function(response, convo){
            responses[response.question] = response.text;
            convo.next();
        })
    })
}

controller.hears([/./], ['direct_message'], function(bot, message){
    bot.startConversation(message, function(err, convo){
        convo.say("Hey there! Let's get this party started.")
        askQuestions(convo);
    }) 
})

