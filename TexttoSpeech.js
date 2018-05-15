//==============================================================================================================================================================
//Arguments: Text to be synthesizied in string format
//Returns: Creates a .wav file in the root filesystem.
//Preconditions: Must be connected to the internet. Need to have file write access in directory. Must have adequete space for output file.
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

<<<<<<< HEAD
module.exports = function (Words,callback){
=======
//==============================================================================================================================================================
//Logging Initialization (From Week 10 Lab Notes)
//==============================================================================================================================================================
var winston = require('winston');

const env = process.env.NODE_ENV || 'development'; // if the env is not specified, then it is development
const logDir = 'log'; // to create a log folder
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) { // if the folder is not exist
    fs.mkdirSync(logDir); // create one
}

const tsFormat = function () { // get the current time
    return (new Date()).toLocaleTimeString();
};

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: tsFormat, // print out the time
            colorize : true, // colorize the output
            level : env === 'development' ? 'debug' : 'info' //dynamic level
        }),
        new (winston.transports.File)({
            filename : logDir + "/ Text_to_Speech.log", // file name
            timestamp: tsFormat, // print out the time
            level : env === 'development' ? 'debug' : 'info' //dynamic level
        })
    ]
});

//==============================================================================================================================================================
//Text2Speech function Definition
//==============================================================================================================================================================
module.exports = function Text2Speech(Words,callback){
    logger.info('Entered Text2Speech with string: ' + Words);
>>>>>>> e37e30a1f13103674edb27970b3ca168af0c9f53
    var params = {
    text: Words,
    voice: 'en-GB_KateVoice',
    accept: 'audio/wav'
    };

    // Pipe the synthesized text to a file.
    var Datafile=text_to_speech.synthesize(params).on('error', function(error) {
        logger.error('Error:', error);
    }).pipe(fs.createWriteStream('TextToSpeechOutput.wav')).on('finish',function(){
        logger.debug('Successfully created .wav file');
        callback('TextToSpeechOutput.wav');
    });
}