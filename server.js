var faceDetection = require("./FaceDetection.js");
var textToSpeech = require("./TexttoSpeech.js");
var fs = require("fs");
var SocketIOFile = require('socket.io-file');
var siofu = require("socketio-file-upload");
var app = require("express")().use(siofu.router); //initialise express app
var server = require('http').Server(app); //create server
var io = require("socket.io")(server); //create socket
var formidable = require("formidable");
var path = require("path");
var play = require("play");
var player = require("play-sound")(opts = {});

//initalise server to listen on port 3000
server.listen(3000, function(){
  console.log("Server listening on port 3000");
});

//send index.html
app.get('/', function(req, res){
  res.sendFile(__dirname + "/index.html");
  console.log("Accessing index page");
});

//Upload file
/*app.post('/fileupload', function(req, res){
  console.log("Uploading file");
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    console.log(files.filetoupload.path);
    var oldPath = files.filetoupload.path;
    var newPath = __dirname + '/files/' + files.filetoupload.name;
    fs.rename(oldPath, newPath, function(err){
      if (err) throw err;
      console.log("Upload complete");
      res.sendFile(__dirname + "/confirmation.html");
      faceDetection(newPath, function(data){
        console.log(data);
        if (data.NumFaces>0)
        {
          //combine text
          words = "The image has " + data.NumFaces + " faces. ";
          for (var i = 1; i <= data.NumFaces; i++)
          {
            words = words + "Face number " + i + " is a " + data.Gender[i-1] + " and the average age is " + data.AverageAge[i-1] + ". ";
          }
          console.log(words);
          //Text to speech
          textToSpeech(words, function(datafile){
            console.log(datafile);
          })
        }
      })
    })
  })
})*/

//listen for connection
io.on('connection', function(socket){
  console.log("Client " + socket.id + " has connected");
  /*var uploader = new SocketIOFile(socket, {
    uploadDir: __dirname + '/files',
    transmissionDelay: 0,
    overwrite: true
  });
  console.log(uploader);
  uploader.on('start', (fileInfo) => {
    console.log("Client started uploading file");
    console.log(fileInfo);
  })
  uploader.on('stream', (fileInfo) => {
    var percent = fileInfo.wrote/fileInfo.size * 100;
    console.log(percent + "% completed");
    console.log(fileInfo);
  })
  uploader.on('complete', (fileInfo) => {
    console.log("Transmission complete");
    console.log(event);
  })
  uploader.on('error', (err) => {
    console.log("Error in upload");
    console.log(err);
  })*/
  var uploader = new siofu();
  uploader.dir = path.join(__dirname, '/files');
  console.log(uploader);
  uploader.listen(socket);
  uploader.on('start', function(event){
    console.log(event);
  });
  uploader.on('error', function(err){
    console.log(err);
  })
  uploader.on("complete", function(event){
    console.log(event);
    var filePath = path.join(uploader.dir, event.file.name);
    faceDetection(filePath, function(data){
      console.log(data);
      var words = "";
      if (data.NumFaces>0)
      {
        //combine text
        words = "The image has " + data.NumFaces + " faces. ";
        for (var i = 1; i <= data.NumFaces; i++)
        {
          words = words + "Face number " + i + " is a " + data.Gender[i-1] + " and the average age is " + data.AverageAge[i-1] + ". ";
        }
        console.log(words);
      }
      else {
        words = "There are no faces in this image";
      }
      //Text to speech
      textToSpeech(words, function(datafile){
        console.log(datafile);
        socket.emit("Finish processing");
      })
    })
  })
  socket.on("upload", function(file){
    console.log(file);
  })
  socket.on("play", function(){
    console.log("listen");
    console.log(player);
    player.play("./TextToSpeechOutput.wav");
  })
});
