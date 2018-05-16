//==============================================================================================================================================================
//Arguments: file name in string format of image to be processed. Need to include file type e.g. .jpg or .png
//Returns: An object with the age and gender arrays of each image and the number of faces. The age and gender of face[i] is in AverageAge[i] and Gender[i].
//Preconditions: Must be connected to the internet
//Limitations: file only accepts image files
//
//Since .detectFaces is assyncronous, A callback needs to be used like below:
//  ProcessImage('./TestImage2.jpg',function(Data){console.log(Data)}); where Data is the data object
//If no need to use the callback, use empty function otherwise returns an error:
//  ProcessImage('./TestImage2.jpg',function(){});
//==============================================================================================================================================================

//From IBM Example https://www.ibm.com/watson/developercloud/visual-recognition/api/v3/node.html?node#detect-faces

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');

var visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  api_key: '7e34ea43e8c105224a15dd62281bc1fde0c9d6b2'
});

//==============================================================================================================================================================
//Logging Initialization (From Week 10 Lab Notes)
//==============================================================================================================================================================
/*var winston = require('winston');

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
            filename : logDir + "/ Visual Recognition.log", // file name
            timestamp: tsFormat, // print out the time
            level : env === 'development' ? 'debug' : 'info' //dynamic level
        })
    ]
});*/

//==============================================================================================================================================================
//ProcessImage function Definition
//==============================================================================================================================================================

module.exports = function (file,callback){
    //logger.info('Entered Image Recognition function with file: ' + file);
    var images_file = fs.createReadStream(file)

    var params = {
    images_file: images_file
    };

    var FaceAges=[];
    var FaceGender=[];

    visualRecognition.detectFaces(params, function(err, response) {
    //if (err)
        //logger.error(err);
    //else {
        var Data=response.images[0].faces;
        for (var i=0;i<Data.length;i++){
            FaceAges.push((Data[i].age.min+Data[i].age.max)/2); //Get the average age of each face
            FaceGender.push(Data[i].gender.gender); //Get the gender of each face
            //logger.debug('Average Age of face ' + i +' = ' + (Data[i].age.min+Data[i].age.max)/2 + '. Gender of face = ' + Data[i].gender.gender);
        }
      //}
        //logger.debug('Number of faces: ' + Data.length);
        //logger.debug('Average Face Final: [' + FaceAges + ']');
        //logger.debug('Gender Final: [' + FaceGender + ']');
        callback({AverageAge:FaceAges,Gender:FaceGender,NumFaces:Data.length});
    });
}
