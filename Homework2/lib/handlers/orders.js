'use strict';

// Dependencies
var _data = require('../data'),
    helpers = require('../helpers'),
    _menu = require('./menu'),
    _tokens = require('./tokens'),

    // Container for all the orders methods
    _orders  = {};

_orders.calculateTotal = function (items) {
    var prices = _menu.pricesById,
        total = 0;
    items.forEach(function (item) {
        total += prices[item.id] * item.quantity;
    });
    return total;
};
// Orders - post
// Required data: email
// Optional data: none
_orders.post = function (data, callback) {
    // Check that all required fields are filled out
    var email = typeof (data.queryStringObject.email) === 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false,
        token;

    if (email) {
        // Get token from headers
        token = typeof (data.headers.token) === 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the email
        _tokens.verifyToken(token, email, function (tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the user who matches that email
                _data.read('users', email, function (err, userData) {
                    if (!err && userData) {
                        if (userData.shoppingCart.length > 0) {
                            // Generate order data
                            var orderId = helpers.createRandomString(20),
                                orderObject = {
                                    'email' : email,
                                    'id' : orderId,
                                    'items' : userData.shoppingCart,
                                    'status: 'waiting payment'
                                };
                            orderObject.total = _orders.calculateTotal(orderObject.items);
                            // Store the order
                            _data.create('orders', orderId, orderObject, function (err) {
                                if (!err) {
                                    // Clean shopping cart
                                    userData.shoppingCart = [];
                                    _data.update('users', email, userData, function (err) {
                                        if (!err) {
                                            callback(200, orderObject);
                                        } else {
                                            callback(500, {'Error' : 'Could not cleanup shopping cart.'});
                                        }
                                    });                                    
                                } else {
                                    callback(500, {'Error' : 'Could not create a new order'});
                                }
                            });
                        } else {
                            callback(400, {'Error' : 'Shopping cart is empty'});
                        }
                    } else {
                        callback(400, {'Error' : 'Could not find the specified user.'});
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
module.exports = _orders;
