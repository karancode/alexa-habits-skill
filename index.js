//index.js

const Alexa = require('ask-sdk-core');
const Habits = require('./habits');
const Display = require('./display/display');

//constants
const WELCOME_MESSAGE = 'Welcome to Habits skill.';
const HELP_MESSAGE = 'You can say, ask habits for something good. Or, tell me a good habit!';
const GOODBYE_MESSAGE = 'Learn Good! ByeBye!';
const ERROR_MESSAGE = 'Some error happened, which was handled. Sorry, I don\'t understand. Please try again!';
const NO_HABIT_VALIDATION_MESSAGE = 'Please ask for a Habit first! You can say, tell me a habit!';
const REPEAT_HABIT = 'habit';
const REPEAT_REASON = 'reason';
const IMAGE_URL = 'https://s8.postimg.cc/z7m0a2mtx/0146c983c664d437b92176be1cc71a90312d69a721_00001_2.jpg';

// launch-request intent handler
const LauchRequestHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput){
        // initialize session counter
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.counter = 0;
        attributes.repeat = null;
        handlerInput.attributesManager.setSessionAttributes(attributes);
        
        var response = "";
        const speechText = WELCOME_MESSAGE;
        
        if(Display.supportDisplay(handlerInput)) {
            const display_type = 'BodyTemplate2';
            const display_habbit = null;
            const display_reason = null;
            response = Display.getDisplay(handlerInput.responseBuilder,  
                                        IMAGE_URL,
                                        display_type, 
                                        display_habbit, 
                                        display_reason);
        }else {
            response = handlerInput.responseBuilder;
        }

        //return handlerInput.responseBuilder
        return response
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// custom intent handlers
const GetHabitIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (handlerInput.requestEnvelope.request.intent.name === 'GetHabitIntent'
            || handlerInput.requestEnvelope.request.intent.name === 'GetNextHabitIntent'    // two custom intents handled by same handler
            || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'
            || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StartOverIntent');
    },
    handle(handlerInput) {

        //update repeat-attribute
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.repeat = REPEAT_HABIT;
        handlerInput.attributesManager.setSessionAttributes(attributes);

        var response = "";
        const speechText = getHabitMessage(handlerInput);

        if(Display.supportDisplay(handlerInput)) {
            const display_type = 'BodyTemplate7';
            const display_reason = null;
            response = Display.getDisplay(handlerInput.responseBuilder,  
                                        IMAGE_URL,
                                        display_type, 
                                        speechText, 
                                        display_reason);
        }else {
            response = handlerInput.responseBuilder;
        }

        return response
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// supporting functions
function getHabitMessage(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const habit_message = Habits.data[attributes.counter].habit;
    attributes.counter = attributes.counter + 1;
    handlerInput.attributesManager.setSessionAttributes(attributes);
    return habit_message;
}

const GetHabitReasonIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetHabitReasonIntent';
    },
    handle(handlerInput) {

        //update repeat-attribute
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.repeat = REPEAT_REASON;
        handlerInput.attributesManager.setSessionAttributes(attributes);

        var response = "";
        const speechText = getHabitReason(handlerInput);

        if(Display.supportDisplay(handlerInput)) {
            const display_type = 'BodyTemplate7';
            const display_habbit = null;
            response = Display.getDisplay(handlerInput.responseBuilder,  
                                        IMAGE_URL,
                                        display_type, 
                                        display_habbit, 
                                        speechText);
        }else {
            response = handlerInput.responseBuilder;
        }

        return response
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};


function getHabitReason(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    if (attributes.counter - 1 < 0){
        return NO_HABIT_VALIDATION_MESSAGE;
    }
    const habit_reason = Habits.data[(attributes.counter - 1)%Habits.data.length].reason;
    return habit_reason;
}

const GetRepeatIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'GetRepeatIntent';
    },
    handle(handlerInput) {
        const speechText = getRepeatMessage(handlerInput);

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

function getRepeatMessage(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    const repeat = attributes.repeat;
    if (attributes.counter - 1 < 0){
        return NO_HABIT_VALIDATION_MESSAGE;
    }
    switch(repeat){
        case REPEAT_HABIT : 
            return Habits.data[(attributes.counter -1)%Habits.data.length].habit;
        case REPEAT_REASON :
            return Habits.data[(attributes.counter - 1)%Habits.data.length].reason;
    }
}

//default intent handlers
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = HELP_MESSAGE;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
            || handlerInput.requestEnvelope.request.intent.name === 'GetEndIntent'      //end intent same as stop/cancel
            || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = GOODBYE_MESSAGE;

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        //cleanup logic
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`+++++ErrorHandled: ${error.message}`);

        const speechText = ERROR_MESSAGE;
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

let skill;
exports.handler = async function (event, context) {
    console.log(`+++++Request: ${JSON.stringify(event)}`);

    if(!skill) {
        skill = Alexa.SkillBuilders.custom()
            .addRequestHandlers(
                LauchRequestHandler,
                HelpIntentHandler,
                CancelAndStopIntentHandler,
                SessionEndedRequestHandler,
                GetHabitIntentHandler,
                GetHabitReasonIntentHandler,
                GetRepeatIntentHandler
            )
            .addErrorHandlers(
                ErrorHandler
            )
            .create();
    }
    const response = await skill.invoke(event, context);
    console.log(`+++++Response: ${JSON.stringify(response)}`);

    return response;
};