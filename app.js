var fs = require('fs');
var express = require('express');
var multipart = require('connect-multiparty');
var multer = require('multer');

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
    console.log(request.body);
    console.log(request.files);

    response.redirect('/');
});

app.listen(52273, function(){
    console.log('Server running at http://127.0.0.1:52273');
});