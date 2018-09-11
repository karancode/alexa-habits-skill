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

        const myHelpTextContent = new Alexa.RichTextContentHelper()
            .withPrimaryText(display_habbit + '<br/>')
            .getTextContent();
            
        const myEndTextContent = new Alexa.RichTextContentHelper()
            .withPrimaryText(display_habbit + '<br/>')
            .withSecondaryText('Thank you for using the HABIT skill!')
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
        else if(display_habbit != null && display_reason != null){
            if(display_reason === 'EndRequest'){
                response.addRenderTemplateDirective({
                    type : display_type,
                    backButton : 'visible',
                    backgroundImage : image,
                    title : 'End - HABIT Skill',
                    textContent : myEndTextContent
                });
            }
            else if(display_reason === 'HelpRequest'){
                response.addRenderTemplateDirective({
                    type : display_type,
                    backButton : 'visible',
                    backgroundImage : image,
                    title : 'Help - HABIT Skill',
                    textContent : myHelpTextContent
                });
            }
        }
        return response;
    }
};