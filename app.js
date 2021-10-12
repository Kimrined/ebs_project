var fs = require('fs');
var express = require('express');
var multipart = require('connect-multiparty');
var multer = require('multer');
const crypto = require('crypto');

var key = 'auto'; // 암호화 키
var app = express();

app.use(multipart({uploadDir: __dirname + '/multipart'}));

var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/multipart')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});

console.log('okay');
var upload = multer({ storage: _storage })

app.get('/', function(request, response) { 
    fs.readFile('HTMLPage.html', function(error, data){
        response.send(data.toString());
    });
});

app.post('/', function(request, response){
    var comment = request.body.comment;
    var imageFile = request.files.image;

    if (imageFile && imageFile.size > 0) {
        var name = imageFile.name;
        var path = imageFile.path;
        var type = imageFile.type;



        if(type.indexOf('zip') != -1) { // zip 파일만 올리게 하기
            var cipher = crypto.createCipher('aes192', key);
            cipher.update(name, 'utf8', 'base64');
            var outputPath = __dirname + '/multipart/' + cipher.final('base64') /*+'.zip'*/; //암호화할 경우 파일 형식까지 사라지는 경우가 있어서 .zip 임시 첨부.
            fs.rename(path, outputPath, function(error) {
                response.redirect('/');
            })
        } else {
            fs.unlink(path, function (error) {
                response.sendStatus(400);
            });
        }
    } else {
        response.sendStatus(404);
    }

    //console.log(request.body);
    //console.log(request.files);

});

app.listen(52273, function(){
    console.log('Server running at http://127.0.0.1:52273');
});
