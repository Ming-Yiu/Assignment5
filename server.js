var faceDetection = require("./FaceDetection.js");
var textToSpeech = require("./TexttoSpeech.js");
var fs = require("fs");
var app = require("express")(); //initialise express app
var server = require('http').Server(app); //create server
var io = require("socket.io")(server); //create socket

//initalise server to listen on port 3000
server.listen(3000, function(){
  console.log("Server listening on port 3000");
});

//send index.html
app.get('/', function(req, res){
  res.sendfile(__dirname + "/index.html");
  console.log(req);
});

//listen for connection
io.on('connection', function(socket){
  console.log("Client " + socket.id + " has connected");
});
