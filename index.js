//index.js

const Alexa = require('ask-sdk-core');

//constants
WELCOME_MESSAGE = 'Welcome to Habits skill.';
HELP_MESSAGE = 'You can say, ask habits for something good. Or, tell me a good habit!';
GOODBYE_MESSAGE = 'Learn Good! ByeBye!';
ERROR_MESSAGE = 'Some error happened, which was handled. Sorry, I don\'t understand. Please try again!';

const LauchRequestHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput){
        const speechText = WELCOME_MESSAGE;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

//

//helper handlers
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
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
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