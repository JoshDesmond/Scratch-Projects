This project is based off of edx's "Microsoft: DEV280x Building Functional Prototypes using Node.js"

It's a simple express server with endpoints to manage a sqlite3 database.

To execute the post endpoint, use Postman, or the REST client of your choice, and
build an API POST request with the following configuration:

request URL: localhost:3000/quotes
request method: POST
request body:
    encoding format: x-www-form-urlencoded
    quote: "Sample Quote"
    author: "Sample Author"
    year: 1940

A powershell example of such is as follows:
> $postParams = @{quote='Sample Quote';author='Sample Author';year=1940}
> $postQuoteInvocation = Invoke-WebRequest -Uri http://localhost:3000/quotes -method POST
    -Body $postParams -ContentType 'application/x-www-form-urlencoded'

(Note that the default ContentType already is 'application/x-www-form-urlencoded')