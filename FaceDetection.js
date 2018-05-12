//==============================================================================================================================================================
//Arguments: file of image to be processed
//Returns: An object with the age and gender arrays of each image and the number of faces. The age and gender of face[i] is in AverageAge[i] and Gender[i].
//
//Since .detectFaces is assyncronous, A callback needs to be used like below: 
//  ProcessImage('./TestImage2.jpg',function(Data){console.log(Data)}); where Data is the data object
//
//==============================================================================================================================================================

//From IBM Example https://www.ibm.com/watson/developercloud/visual-recognition/api/v3/node.html?node#detect-faces

var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');

var visualRecognition = new VisualRecognitionV3({
  version: '2018-03-19',
  api_key: '7e34ea43e8c105224a15dd62281bc1fde0c9d6b2'
});

function ProcessImage(file,callback){
    var images_file = fs.createReadStream(file)

    var params = {
    images_file: images_file
    };

    var FaceAges=[];
    var FaceGender=[];

    visualRecognition.detectFaces(params, function(err, response) {
    if (err)
        console.log(err);
    else
        var Data=response.images[0].faces;
        for (var i=0;i<Data.length;i++){
            FaceAges.push((Data[i].age.min+Data[i].age.max)/2); //Get the average age of each face
            FaceGender.push(Data[i].gender.gender); //Get the gender of each face
        }
        callback({AverageAge:FaceAges,Gender:FaceGender,NumFaces:Data.length});
    });
}

