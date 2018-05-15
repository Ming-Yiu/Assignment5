//==============================================================================================================================================================
//Arguments: Text to be synthesizied in string format
//Returns: Creates a .wav file in the root filesystem.
//
//Since synthesising voices is assyncronous, A callback needs to be used like below:
//  Text2Speech('hello',function(){ *DO SOMETHING WITH THE VOICE FILE*});
//
//==============================================================================================================================================================

//Using IBM example: https://www.ibm.com/watson/developercloud/text-to-speech/api/v1/#synthesize_audio

var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');

var text_to_speech = new TextToSpeechV1 ({
  username: '108713f1-318c-47a9-bb83-59d41e39adbb',
  password: 'GLEZyvT34MEb'
});

module.exports = function (Words,callback){
    var params = {
    text: Words,
    voice: 'en-GB_KateVoice',
    accept: 'audio/wav'
    };

    // Pipe the synthesized text to a file.
    var Datafile=text_to_speech.synthesize(params).on('error', function(error) {
    console.log('Error:', error);
    }).pipe(fs.createWriteStream('TextToSpeechOutput.wav')).on('finish',function(){callback('TextToSpeechOutput.wav');});
}
