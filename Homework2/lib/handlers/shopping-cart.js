'use strict';

// Dependencies
var _data = require('../data'),
    _tokens = require('./tokens'),

    // Container for all the users methods
    _shoppingCart  = {};

// Users - post
// Required data: email, array of itemId, quantity
// Optional data: none
_shoppingCart.post = function (data, callback) {
    // Check that all required fields are filled out
    var email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false,
        shoppingCart = typeof (data.payload.shoppingCart) === 'object' ? data.payload.shoppingCart : false,
        token;

    if (email && shoppingCart) {
        // Get token from headers
        token = typeof (data.headers.token) === 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the email
        _tokens.verifyToken(token, email, function (tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the user
                _data.read('users', email, function (err, userData) {
                    if (!err && userData) {
                        // Update existing shopping cart
                        userData.shoppingCart = shoppingCart;
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
        callback(400, {'Error' : 'Missing required field.'});
    }
};

// Export the handlers
module.exports = _shoppingCart;
