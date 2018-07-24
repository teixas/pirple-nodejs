'use strict'
/*
 * Primary file for API
 *
 */

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');
var fs = require('fs');

// Define all the handlers
var handlers = {};

// hello handler
handlers.hello = function (data, callback) {
    callback(200, {'message': "You're welcome!"});
};

// Not-Found handler
handlers.notFound = function (data, callback) {
    callback(404);
};

// Define the request router
var router = {
    'hello' : handlers.hello
};

// All the server logic for both the http and https server
var unifiedServer = function (req, res) {

    // Parse the url
    var parsedUrl = url.parse(req.url, true),

        // Get the path
        path = parsedUrl.pathname,
        trimmedPath = path.replace(/^\/+|\/+$/g, ''),

        // Get the query string as an object
        queryStringObject = parsedUrl.query,

        // Get the HTTP method
        method = req.method.toLowerCase(),

        //Get the headers as an object
        headers = req.headers,

        // Get the payload,if any
        decoder = new StringDecoder('utf-8'),
        buffer = '';

    req.on('data', function (data) {
        buffer += decoder.write(data);
    });

    req.on('end', function () {
        buffer += decoder.end();

        // Check the router for a matching path for a handler.
        // If one is not found, use the notFound handler instead.
        var chosenHandler = router[trimmedPath] ||  handlers.notFound,

            // Construct the data object to send to the handler
            data = {
                'trimmedPath' : trimmedPath,
                'queryStringObject' : queryStringObject,
                'method' : method,
                'headers' : headers,
                'payload' : buffer
            };

        // Route the request to the handler specified in the router
        chosenHandler(data, function (statusCode, payload) {
            var payloadString;

            // Use the status code returned from the handler,
            // or set the default status code to 200
            statusCode = typeof statusCode === 'number' ? statusCode : 200;

            // Use the payload returned from the handler, or set the
            // default payload to an empty object
            payload = typeof payload === 'object' ? payload : {};

            // Convert the payload to a string
            payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log(trimmedPath, statusCode);
        });
    });
};


// Instantiate the HTTP server
var httpServer = http.createServer(function (req, res) {
    unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, function () {
    console.log('The HTTP server is running on port ' + config.httpPort);
});

// Instantiate the HTTPS server
var httpsServerOptions = {
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
};

var httpsServer = https.createServer(httpsServerOptions, function (req, res) {
    unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, function () {
    console.log('The HTTPS server is running on port ' + config.httpsPort);
});
