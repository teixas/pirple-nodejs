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

// Users
handlers.users = function (data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        _users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Tokens
handlers.tokens = function (data, callback){
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        _tokens[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Export the handlers
module.exports = handlers;
