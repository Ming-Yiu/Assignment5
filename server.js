//==============================================================================================================================================================
//Nodejs Server code
//Usage: Run by calling 'node server.js' in console
//Prerequisites: Need to be connected to the internet. Need to have correct modules installed (under require below). Need to have correct admin privlidges and firewall access.
//==============================================================================================================================================================
//Dependencies
var faceDetection = require("./FaceDetection.js");
var textToSpeech = require("./TexttoSpeech.js");
var fs = require("fs");
var siofu = require("socketio-file-upload");
var path = require("path");
var ss = require('socket.io-stream');

//==============================================================================================================================================================
//Server Initialization
//==============================================================================================================================================================

var app = require("express")().use(siofu.router); //initialise express app
var server = require('http').Server(app); //create server
var io = require("socket.io")(server); //create socket
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
            level :  'info'
        }),
        new (winston.transports.File)({
            filename : logDir + "/ Server.log", // file name
            timestamp: tsFormat, // print out the time
            level : env === 'development' ? 'debug' : 'info' //dynamic level
        })
    ]
});

//Create upload folder if it doesn't exist
if (!fs.existsSync('files')) {
    fs.mkdirSync('files');
}

//initalise server to listen on port 3000
server.listen(3000, function(){
    logger.info('Listening on Port 3000')
});

//send index.html
app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

//==============================================================================================================================================================
//ProcessImage function Definition
//==============================================================================================================================================================
//listen for connection
io.listen(server).on('connection', function(socket){

    logger.info("Client " + socket.id + " has connected");

    var uploader = new siofu();
    uploader.dir = path.join(__dirname, '/files');
    uploader.listen(socket);

    uploader.on('start', function(event){
        logger.debug('Upload Started');
    });

    uploader.on('error', function(err){
        logger.error(err);
    })

    uploader.on("complete", function(event){
        var filePath = path.join(uploader.dir, event.file.name);
        faceDetection(filePath, function(data){
            logger.debug('Image Processed: \n' + data);
            logger.info('Sending input and output image');
            var imageStream = ss.createStream();
            fs.createReadStream(filePath).pipe(imageStream); //stream image
            ss(socket).emit('image', imageStream);
            socket.on("faceposition", function(){
                socket.emit("faceposition", data.FacePosition);
            });
            var words = "";
            if (data.NumFaces>0){
                words = "The image has " + data.NumFaces + " faces. "; //combine text to get one long sentence
                for (var i = 1; i <= data.NumFaces; i++){
                    words = words + "Face number " + i + " is a " + data.Gender[i-1] + " and the average age is " + data.AverageAge[i-1] + ". ";
                }
            }
            else {
                words = "There are no faces in this image.";
            }
            logger.debug(words);

            socket.emit('Info',words);
            //Text to speech
            textToSpeech(words, function(datafile){
                logger.info('Finished audio synthesis');
                //Using https://github.com/zoutepopcorn/audio_socket/tree/master example
                var myStream = ss.createStream();
                fs.createReadStream('./TextToSpeechOutput.wav').pipe(myStream); //Stream .wav file
                socket.emit("Finish processing");
                ss(socket).emit('audiostream',myStream);
                logger.info('Streaming audio');
            });

        });
    });
});
