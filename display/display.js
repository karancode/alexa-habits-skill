//display.js

module.exports = {
    supportDisplay : (handlerInput) => {
        var hasDisplay = 
            handlerInput.requestEnvelope.context &&
            handlerInput.requestEnvelope.context.System &&
            handlerInput.requestEnvelope.context.System.device &&
            handlerInput.requestEnvelope.context.System.device.supportedInterface &&
            handlerInput.requestEnvelope.context.System.device.supportedInterface.Display;
        
        return hasDisplay;
    } 
};