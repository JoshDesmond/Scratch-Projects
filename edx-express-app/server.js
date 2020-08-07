const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// app.use appears to be a standard method for defining express middleware, of which this is a lot
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
	response.send("Hello, World!");
});

app.get('/quotes', (request, response) => {
	if (request.query.year) {
		response.send(`Get quotes with year === ${request.query.year}`);
	} else {
	    response.send("Get all quotes, since no year was specified");
	}
});

app.get('/quotes/:id', (request, response) => {
	response.send(`View a quote with the id ${request.params.id}`);
});

app.post('/quotes', (request, response) => {
	console.log(`Insert a new quote: ${request.body.quote}`);
	response.json(request.body);
});

app.listen(port, () => {
	console.log("Express app listening on port " + port);
});
