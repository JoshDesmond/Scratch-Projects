const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

// Configure Express
const app = express();
const port = 3000;

// Configure sqlite3
const db = new sqlite3.Database('quotes.sqlite');


// app.use appears to be a standard method for defining express middleware, of which this is a lot
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (request, response) => {
	response.send("Hello, World!");
});

app.get('/quotes', (request, response) => {
	if (request.query.year) {
		console.log(`Get quotes with year === ${request.query.year}`);
	    db.all('SELECT * FROM quotes WHERE year = ?',
			[request.query.year], (err, rows) => {
	    		if (err) response.send(err.message);
				else response.json(rows);
			});
	} else {
	    console.log("Get all quotes, since no year was specified");
	    db.all('SELECT * FROM quotes', (err, rows) => {
	    	if (err) response.send(err.message);
	    	else response.json(rows);
		});
	}
});

app.get('/quotes/:id', (request, response) => {
	console.log(`View a quote with the id ${request.params.id}`);
	db.get('SELECT * FROM quotes WHERE ROWID = ?',
		[request.params.id], (err, row) => {
			if (err) response.send(err.message);
			else response.json(row);
		});
});

app.post('/quotes', (request, response) => {
	console.log(`Insert a new quote: ${request.body.quote}`);
	db.run('INSERT INTO Quotes VALUES (?, ?, ?)',
		[request.body.quote, request.body.author, request.body.year],
		(err) => {
			if (err) response.send(err);
			else {
			    // this is referring to the database?
				response.send('Inserted quote with id: ' + this.lastID);
			}
		});
	response.json(request.body);
});

app.listen(port, () => {
	console.log("Express app listening on port " + port);
});

/**
 * Prints out all the quotes into the console.
 */
function printQuotes() {
	db.serialize(() => {
		db.each('SELECT * FROM Quotes', (err, row) => {
			if (err) {
				console.log(err);
			} else {
				console.log(row);
			}
		});
	});
}