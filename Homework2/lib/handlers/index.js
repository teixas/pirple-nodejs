'use strict';
/*
 * Request Handlers
 *
 */

// Dependencies
var _tokens = require('./tokens'),
    _users = require('./users'),

    // Define all the handlers
    handlers = {};

// Not-Found
handlers.notFound = function (data, callback) {
    callback(404);
};

handlers._callSubHandler = function (data, callback, handler, methods) {
    if (methods.indexOf(data.method) > -1) {
        handler[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Users
handlers.users = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    handlers._callSubHandler(data, callback, _users, acceptableMethods);
};

// Tokens
handlers.tokens = function (data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    handlers._callSubHandler(data, callback, _tokens, acceptableMethods);
};

// Export the handlers
module.exports = handlers;