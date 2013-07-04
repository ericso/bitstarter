var fs = require('fs');
var express = require('express');

var app = express.createServer(express.logger())
app.get('/', function(request, response) {
    var str = '';
    fs.readFile("./index.html", 'utf8', function(err, data){
	if (err) {
	    return console.log(err);
	}
	str = data;
	console.log('read: ' + str);
    });
    
    var buff = new Buffer(str, 'utf-8');
    response.send(buff.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});