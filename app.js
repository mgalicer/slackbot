'use strict';

var botkit = require('botkit');
var controller = botkit.slackbot();

var env = require('dotenv');
require('dotenv').config();

var Firebase = require("firebase");
var ref = new Firebase("https://slackbot1.firebaseio.com/");
var usersRef = ref.child("users");

var fridaySayings = ["Happy Friday!", "TGIF.", "Almost time for the weekend!"];

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

controller.hears([/./], ['direct_message'], function(bot, message){
    bot.startConversation(message, function(err, convo){
        convo.say("Hey there! Let's get started.")
        askQuestions(convo, message);
    })
})

function askQuestions(convo, message){
    questions.forEach(function(question){
        convo.ask(question, function(response, convo){
            var timestamp = new Date();
            responses[response.question] = response.text;
            saveToFirebase(message.user, timestamp, responses)
            convo.next();
        })
    })
    if(new Date().getDay === 5){
        analyzeWeek(convo)
    }
}

function saveToFirebase(user, timestamp, responses){
    usersRef.set({
      user: {
        timestamp: responses
      }
    });
}

function analyzeWeek(convo){
    var greeting = fridaySayings[Math.floor(Math.random() * fridaySayings.length)];
    convo.say(greeting);
}