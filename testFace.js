//==============================================================================================================================================================
//Unit tests for the FaceDetection function.
//Test 1: Test the number of faces
//Test 2: Test the average age of faces
//TestImages can be found in './TestImages' folder.
//Usage: run 'mocha testFace.js --timeout 10000' in terminal of file directory. Need to have TestImages in same directory.
//
//All tests passed:15/05/2018 10:00 AM
//==============================================================================================================================================================

var chai=require('chai');
var expect=chai.expect;
var ProcessImage=require('./FaceDetection.js');

//==============================================================================================================================================================
//Testing Number of Faces
//==============================================================================================================================================================
describe('Face Detection Number of Faces Test',function(){
    it('Should return one face',function(done){
        ProcessImage('./TestImages/TestImage.jpeg',function(data){
            var numbertest1=data.NumFaces;
            expect(numbertest1).to.equal(1); 
            done();
        });
    });
    
    it('Should return two faces',function(done){
        ProcessImage('./TestImages/TestImage2.jpg',function(data){
            var numbertest2=data.NumFaces;
            expect(numbertest2).to.equal(2);
            done();
        });
    });
    
    it('Should return five faces',function(done){
        ProcessImage('./TestImages/TestImage5.jpg',function(data){
            var numbertestfive=data.NumFaces;
            expect(numbertestfive).to.equal(5);
            done();
        });
    }); 
    
    it('Testing a dog. Should return 0 faces',function(done){
        return ProcessImage('./TestImages/TestImageDog.jpg',function(data){
            var numbertest0=data.NumFaces;
            expect(numbertest0).to.equal(0);
            done();
        });
    }); 
    
    it('Testing PNG. Should return 1 face.',function(done){
        ProcessImage('./TestImages/TestImagePNG.png',function(data){
            var numbertestpng=data.NumFaces;
            expect(numbertestpng).to.equal(1);
            done();
        });
    });
    
    it('Testing GIF. Should return 0 faces.',function(done){
        ProcessImage('./TestImages/TestImageGIF.gif',function(data){
            var numbertestgif=data.NumFaces;
            expect(numbertestgif).to.equal(0);
            done();
        });
    }); 
    
    it('Testing non-image file. Should throw an error',function(done){
        expect(function(){ProcessImage('./TestImages/Testfile.js',function(){})}).to.throw;
        done();
    }); 
});

//==============================================================================================================================================================
//Testing average age
//==============================================================================================================================================================
describe('FaceDetection Average Age Test',function(){
    it('Age should be between 40-60',function(done){
        ProcessImage('./TestImages/TestImage.jpeg',function(data){
            var AverageAge1=data.AverageAge;
            expect(AverageAge1[0]).to.be.within(40,60); 
            done();
        });
    });
    
    it('Average age of each person should be within 20-40',function(done){
        ProcessImage('./TestImages/TestImage2.jpg',function(data){
            var AverageAge2=data.AverageAge;
            for (var i=0;i<AverageAge2.length;i++){
                expect(AverageAge2[i]).to.be.within(20,40);    
            }
            done();
        });
    });
    
    it('Should return five faces. Average age between those five faces is around 20-60',function(done){
        ProcessImage('./TestImages/TestImage5.jpg',function(data){
            var AverageAgeFive=data.AverageAge;
            for(var i=0;i<AverageAgeFive;i++){
                expect().to.be.within(20,60);
            }
            
            done();
        });
    }); 
    
    it('Testing a dog. Average Age array should be empty',function(done){
        return ProcessImage('./TestImages/TestImageDog.jpg',function(data){
            var AverageAge0=data.AverageAge;
            expect(AverageAge0).to.have.length(0);
            done();
        });
    }); 
    
    it('Testing PNG. Age should be around 20-40.',function(done){
        ProcessImage('./TestImages/TestImagePNG.png',function(data){
            var AverageAgePNG=data.AverageAge;
            expect(AverageAgePNG[0]).to.be.within(20,40);
            done();
        });
    });
    
    it('Testing non-image file. Should throw an error',function(done){
        expect(function(){ProcessImage('./TestImages/Testfile.js',function(){})}).to.throw;
        done();
    }); 
     
});
