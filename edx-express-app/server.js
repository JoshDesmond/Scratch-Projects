const express = require('express');

var app = express();

const port = 3000;

app.listen(port, function() {
	console.log("Express app listening on port " + port);
});

app.get('/', function(request, response) {
	response.send("Hello, Word!");
});
