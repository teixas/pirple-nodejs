'use strict';

// Dependencies
var _data = require('../data'),
    helpers = require('../helpers'),
    _tokens = require('./tokens'),

    // Container for all the users methods
    _users  = {};

// Users - post
// Required data: firstName, lastName, email, streetAddress, password
// Optional data: none
_users.post = function (data, callback) {
  // Check that all required fields are filled out
    var firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false,
        lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false,
        email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false,
        streetAddress = typeof (data.payload.streetAddress) === 'string' && data.payload.streetAddress.trim().length > 0 ? data.payload.streetAddress.trim() : false,
        password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (firstName && lastName && email && streetAddress && password) {
        // Make sure the user doesnt already exist
        _data.read('users', email, function (err, data) {
            if (err) {
                // Hash the password
                var hashedPassword = helpers.hash(password),
                    userObject;

                // Create the user object
                if (hashedPassword) {
                    userObject = {
                        'firstName' : firstName,
                        'lastName' : lastName,
                        'email' : email,
                        'streetAddress' : streetAddress,
                        'hashedPassword' : hashedPassword,
                        'shoppingCart': []
                    };

                    // Store the user
                    _data.create('users', email, userObject, function (err) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(
                                500,
                                {'Error' : 'Could not create the new user'}
                            );
                        }
                    });
                } else {
                    callback(
                        500,
                        {'Error' : 'Could not hash the user\'s password.'}
                    );
                }
            } else {
                // User alread exists
                callback(
                    400,
                    {'Error' : 'A user with that email already exists'}
                );
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required fields'});
    }
};

// Required data: email
// Optional data: none
_users.get = function (data, callback) {
    // Check that email is valid
    var email = typeof (data.queryStringObject.email) === 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false,
        token;

    if (email) {

        // Get token from headers
        token = typeof (data.headers.token) === 'string' ? data.headers.token : false;
        // Verify that the given token is valid for the email
        _tokens.verifyToken(token, email, function (tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the user
                _data.read('users', email, function (err, data) {
                    if (!err && data) {
                        // Remove the hashed password from the user user object before returning it to the requester
                        delete data.hashedPassword;
                        callback(200, data);
                    } else {
                        callback(404);
                    }
                });
            } else {
                callback(
                    403,
                    {"Error" : "Missing required token in header, or token is invalid."}
                );
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required field'});
    }
};

// Required data: email
// Optional data: firstName, lastName, password, streetAddress (at least one must be specified)
_users.put = function (data, callback) {
    // Check for required field
    var email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false,
        // Check for optional fields
        firstName = typeof (data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false,
        lastName = typeof (data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false,
        streetAddress = typeof (data.payload.streetAddress) === 'string' && data.payload.streetAddress.trim().length > 0 ? data.payload.streetAddress.trim() : false,
        password = typeof (data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false,
        // Get token from headers
        token = typeof (data.headers.token) === 'string' ? data.headers.token : false;

    // Error if email is invalid
    if (email) {
    // Error if nothing is sent to update
        if (firstName || lastName || streetAddress || password) {
            // Verify that the given token is valid for the email
            _tokens.verifyToken(token, email, function (tokenIsValid) {
                if (tokenIsValid) {

                    // Lookup the user
                    _data.read('users', email, function (err, userData) {
                        if (!err && userData) {
                            // Update the fields if necessary
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (streetAddress) {
                                userData.streetAddress = streetAddress;
                            }
                            if (password) {
                                userData.hashedPassword = helpers.hash(password);
                            }
                            // Store the new updates
                            _data.update(
                                'users',
                                email,
                                userData,
                                function (err) {
                                    if (!err) {
                                        callback(200);
                                    } else {
                                        callback(500, {'Error' : 'Could not update the user.'});
                                    }
                                }
                            );
                        } else {
                            callback(400, {'Error' : 'Specified user does not exist.'});
                        }
                    });
                } else {
                    callback(
                        403,
                        {"Error" : "Missing required token in header, or token is invalid."}
                    );
                }
            });
        } else {
            callback(400, {'Error' : 'Missing fields to update.'});
        }
    } else {
        callback(400, {'Error' : 'Missing required field.'});
    }
};

// Required data: email
// Cleanup old checks associated with the user
_users.delete = function (data, callback) {
    // Check that email is valid
    var email = typeof (data.queryStringObject.email) === 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false,
        // Get token from headers
        token = typeof (data.headers.token) === 'string' ? data.headers.token : false;

    if (email) {
        // Verify that the given token is valid for the email
        _tokens.verifyToken(token, email, function (tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the user
                _data.read('users', email, function (err, userData) {
                    if (!err && userData) {
                        // Delete the user's data
                        _data.delete('users', email, function (err) {
                            if (!err) {
                                callback(200);
                            } else {
                                callback(500, {'Error' : 'Could not delete the specified user'});
                            }
                        });
                    } else {
                        callback(400, {'Error' : 'Could not find the specified user.'});
                    }
                });
            } else {
                callback(403, {"Error" : "Missing required token in header, or token is invalid."});
            }
        });
    } else {
        callback(400, {'Error' : 'Missing required field'});
    }
};

// Export the handlers
module.exports = _users;
