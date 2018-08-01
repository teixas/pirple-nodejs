'use strict';

// Dependencies
var _data = require('./data'),
    helpers = require('./helpers'),

    // Container for all the tokens methods
    _tokens  = {};

// Tokens - post
// Required data: email, password
// Optional data: none
_tokens.post = function (data, callback) {
    var email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false,
        password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if (email && password) {
        // Lookup the user who matches that email
        _data.read('users', email, function (err, userData) {
            if (!err && userData) {
                // Hash the sent password, and compare it to the password stored in the user object
                var hashedPassword = helpers.hash(password),
                    tokenId,
                    expires,
                    tokenObject;
                if (hashedPassword === userData.hashedPassword) {
                    // If valid, create a new token with a random name. Set an expiration date 1 hour in the future.
                    tokenId = helpers.createRandomString(20);
                    expires = Date.now() + 1000 * 60 * 60;
                    tokenObject = {
                        'email' : email,
                        'id' : tokenId,
                        'expires' : expires
                    };

                    // Store the token
                    _data.create('tokens', tokenId, tokenObject, function (err) {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {'Error' : 'Could not create the new token'});
                        }
                    });
                } else {
                    callback(400, {'Error' : 'Password did not match the specified user\'s stored password'});
                }
            } else {
                callback(400, {'Error' : 'Could not find the specified user.'});
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required field(s).'});
    }
};

// Tokens - get
// Required data: id
// Optional data: none
_tokens.get = function (data, callback) {
    // Check that id is valid
    var id = typeof (data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the token
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                callback(200, tokenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required field, or field invalid'});
    }
};

// Tokens - put
// Required data: id, extend
// Optional data: none
_tokens.put = function (data, callback) {
    var id = typeof (data.payload.id) === 'string' && data.payload.id.trim().length === 20 ? data.payload.id.trim() : false,
        extend = typeof (data.payload.extend) === 'boolean' && data.payload.extend === true ? true : false;
    if (id && extend) {
      // Lookup the existing token
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                // Check to make sure the token isn't already expired
                if (tokenData.expires > Date.now()) {
                    // Set the expiration an hour from now
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    // Store the new updates
                    _data.update('tokens', id, tokenData, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {'Error' : 'Could not update the token\'s expiration.'});
                        }
                    });
                } else {
                    callback(400, {"Error" : "The token has already expired, and cannot be extended."});
                }
            } else {
                callback(400, {'Error' : 'Specified user does not exist.'});
            }
        });
    } else {
        callback(400, {"Error": "Missing required field(s) or field(s) are invalid."});
    }
};


// Tokens - delete
// Required data: id
// Optional data: none
_tokens.delete = function (data, callback) {
    // Check that id is valid
    var id = typeof (data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        // Lookup the token
        _data.read('tokens', id, function (err, tokenData) {
            if (!err && tokenData) {
                // Delete the token
                _data.delete('tokens', id, function (err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, {'Error' : 'Could not delete the specified token'});
                    }
                });
            } else {
                callback(400, {'Error' : 'Could not find the specified token.'});
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required field'});
    }
};

// Verify if a given token id is currently valid for a given user
_tokens.verifyToken = function (id, email, callback) {
    // Lookup the token
    _data.read('tokens', id, function(err, tokenData) {
        if (!err && tokenData) {
            // Check that the token is for the given user and has not expired
            if (tokenData.email === email && tokenData.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

// Export the handlers
module.exports = _tokens;
