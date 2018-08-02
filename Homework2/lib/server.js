'use strict';
/*
 * Server-related tasks
 *
 */

 // Dependencies
var http = require('http'),
    https = require('https'),
    url = require('url'),
    StringDecoder = require('string_decoder').StringDecoder,
    config = require('./config'),
    fs = require('fs'),
    handlers = require('./handlers'),
    helpers = require('./helpers'),
    path = require('path'),
    util = require('util'),
    debug = util.debuglog('server'),

// Instantiate the server module object
    server = {};

 // Instantiate the HTTP server
server.httpServer = http.createServer(function (request, response) {
    server.unifiedServer(request, response);
});

 // Instantiate the HTTPS server
server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

server.httpsServer = https.createServer(
    server.httpsServerOptions,
    function (request, response) {
        server.unifiedServer(request, response);
    }
);

 // All the server logic for both the http and https server
server.unifiedServer = function (request, response) {

    // Parse the url
    var parsedUrl = url.parse(request.url, true),

        // Get the path
        path = parsedUrl.pathname,
        trimmedPath = path.replace(/^\/+|\/+$/g, ''),

        // Get the query string as an object
        queryStringObject = parsedUrl.query,

        // Get the HTTP method
        method = request.method.toLowerCase(),

        //Get the headers as an object
        headers = request.headers,

        // Get the payload,if any
        decoder = new StringDecoder('utf-8'),
        buffer = '';

    request.on('data', function (data) {
        buffer += decoder.write(data);
    });

    request.on('end', function () {
        buffer += decoder.end();

        // Check the router for a matching path for a handler.
        // If one is not found, use the notFound handler instead.
        var chosenHandler = server.router[trimmedPath] || handlers.notFound,

            // Construct the data object to send to the handler
            data = {
                'trimmedPath' : trimmedPath,
                'queryStringObject' : queryStringObject,
                'method' : method,
                'headers' : headers,
                'payload' : helpers.parseJsonToObject(buffer)
            };

        // Route the request to the handler specified in the router
        chosenHandler(data, function (statusCode, payload) {
            var payloadString, message;

            // Use the status code returned from the handler,
            // or set the default status code to 200
            statusCode = typeof statusCode === 'number' ? statusCode : 200;

            // Use the payload returned from the handler,
            // or set the default payload to an empty object
            payload = typeof payload === 'object' ? payload : {};

            // Convert the payload to a string
            payloadString = JSON.stringify(payload);

            // Return the response
            response.setHeader('Content-Type', 'application/json');
            response.writeHead(statusCode);
            response.end(payloadString);

            // If the response is 200, print green, otherwise print red
            message = method.toUpperCase() + ' /' + trimmedPath +
                ' ' + statusCode;
            if (statusCode === 200) {
                debug('\x1b[32m%s\x1b[0m', message);
            } else {
                debug('\x1b[31m%s\x1b[0m', message);
            }
        });
    });
};

// Define the request router
server.router = {
    'users' : handlers.users,
    'tokens' : handlers.tokens,
    'menu' : handlers.menu,
    'shopping-cart' : handlers.shoppingCart
};

// Init script
server.init = function () {
    // Start the HTTP server
    server.httpServer.listen(config.httpPort, function () {
        console.log('\x1b[36m%s\x1b[0m',
                    'The HTTP server is running on port ' + config.httpPort);
    });

    // Start the HTTPS server
    server.httpsServer.listen(config.httpsPort, function () {
        console.log('\x1b[35m%s\x1b[0m',
                    'The HTTPS server is running on port ' + config.httpsPort);
    });
};


// Export the module
module.exports = server;
