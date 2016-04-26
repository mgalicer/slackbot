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
var data = {}
var responses = {}

controller.hears([/./], ['direct_message'], function(bot, message){
    bot.startConversation(message, function(err, convo){
        convo.say("Hey there! Let's get started.")
        askQuestions(convo, message);
    })
})

// iterate through questions, ask each q
// save each answer in an object
// when done, send data 

function askQuestions(convo, message){
    questions.forEach(function(question){
        convo.ask(question, function(response, convo){
            responses[response.question] = response.text;
            convo.next();
        })
    })

    createAndSendData(convo, responses);

    if(new Date().getDay === 5){
        analyzeWeek(convo)
    }
}

function createAndSendData(convo, responses){
    data.user = convo.user;
    data.timestamp = new Date();
    data.responses = responses;
    usersRef.push(data);
}

function analyzeWeek(convo){
    var greeting = fridaySayings[Math.floor(Math.random() * fridaySayings.length)];
    convo.say(greeting);
}