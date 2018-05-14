var faceDetection = require("./FaceDetection.js");
var textToSpeech = require("./TexttoSpeech.js");
var fs = require("fs");
var SocketIOFile = require('socket.io-file');
var app = require("express")(); //initialise express app
var server = require('http').Server(app); //create server
var io = require("socket.io")(server); //create socket
var formidable = require("formidable");
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
app.post('/fileupload', function(req, res){
  console.log("Uploading file");
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files){
    console.log(files.filetoupload.path);
    var oldPath = files.filetoupload.path;
    var newPath = __dirname + '/files/' + files.filetoupload.name;
    fs.rename(oldPath, newPath, function(err){
      if (err) throw err;
      console.log("Upload complete");
      res.send("File upload complete");
      faceDetection(newPath, function(data){
        console.log(data);
      })
    })
  })
})

//listen for connection
io.on('connection', function(socket){
  console.log("Client " + socket.id + " has connected");
  /*var uploader = new SocketIOFile(socket, {
    uploadDir: './files',
    transmissionDelay: 0,
    overwrite: true
  });
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
});
