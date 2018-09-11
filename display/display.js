//display.js
const Alexa = require('ask-sdk-core');

module.exports = {
    supportDisplay : (handlerInput) => {
        var hasDisplay = 
            handlerInput.requestEnvelope.context &&
            handlerInput.requestEnvelope.context.System &&
            handlerInput.requestEnvelope.context.System.device &&
            handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
            handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display;
        
        return hasDisplay;
    },
    getDisplay : (response, image_url, display_type, display_habbit, display_reason) => {
        const image = new Alexa.ImageHelper().addImageInstance(image_url).getImage();
          
        const myLaunchTextContent = new Alexa.RichTextContentHelper()
            .withPrimaryText('Welcome to HABITS skill!<br/>')
            .withSecondaryText('You can ask me for habits and I will teach you good!')
            .withTertiaryText('You can say, \'Tell me a habit...\'')
            .getTextContent();
        
        const myHabitTextContent = new Alexa.RichTextContentHelper()
            .withPrimaryText('Habit : ' + display_habbit + '<br/>')
            .getTextContent();
        
        const myReasonTextContent = new Alexa.RichTextContentHelper()
            .withPrimaryText('Reason : ' + display_reason + '<br/>')
            .getTextContent();
        

        if(display_habbit === null && display_reason === null)
        {
            response.addRenderTemplateDirective({
                type : display_type,
                backButton : 'invisible',
                backgroundImage : image,
                title : 'HABIT Skill',
                textContent : myLaunchTextContent
            });
        }
        else if(display_habbit != null && display_reason === null)
        {
            response.addRenderTemplateDirective({
                type : display_type,
                backButton : 'visible',
                backgroundImage : image,
                title : 'Habit - HABIT Skill',
                textContent : myHabitTextContent
            });
        }
        else if(display_habbit === null && display_reason != null)
        {
            response.addRenderTemplateDirective({
                type : display_type,
                backButton : 'visible',
                backgroundImage : image,
                title : 'Reason - HABIT Skill',
                textContent : myReasonTextContent
            });
        }
        return response;
    }
};