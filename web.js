var fs = require('fs');
var express = require('express');

var app = express.createServer(express.logger())
app.get('/', function(request, response) {
    console.log('About to read in index.html');
    var str = fs.readFileSync('index.html', 'utf8');
    
    var buff = new Buffer(str, 'utf-8');
    response.send(buff.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});