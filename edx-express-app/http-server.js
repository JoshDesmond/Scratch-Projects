/*
 * This is an HTTP server made using without Express, but just the vanilla node module http
 */

const http = require('http');

const port = 3000;

const requestHandler = function(request, response) {
	console.log("New request to: " + request.url);
	response.end("Hello, World!");
}

const server = http.createServer(requestHandler);
server.listen(port, function() {
	console.log("Listening on port " + port);
});

console.log("Hello from Node.js");

