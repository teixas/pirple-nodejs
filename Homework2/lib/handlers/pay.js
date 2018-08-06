'use strict';

// Dependencies
var _data = require('../data'),
    helpers = require('../helpers'),
    _tokens = require('./tokens'),

    // Container for all the pay methods
    _pay  = {};

// Pay - post
// Required data: email, orderId, payToken
// Optional data: None
_pay.post = function (data, callback) {
    // Check that all required fields are filled out
    var email = typeof (data.payload.email) === 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false,
        orderId = typeof (data.payload.orderId) === 'string' && data.payload.orderId.trim().length === 20 ? data.payload.orderId.trim() : false,
        payToken = typeof (data.payload.payToken) === 'string' && data.payload.payToken.trim().length > 0 ? data.payload.payToken.trim() : false,
        token;

    if (email && orderId && payToken) {
        // Get token from headers
        token = typeof (data.headers.token) === 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the email
        _tokens.verifyToken(token, email, function (tokenIsValid) {
            if (tokenIsValid) {
                // Lookup the order
                _data.read('orders', orderId, function (err, orderData) {
                    if (!err && orderData) {
                        var amount = parseInt(orderData.total, 10);
                        helpers.sendStripePayment(payToken, orderId, amount, function (error, charge) {
                            if (!error && charge.paid) {
                                orderData.status = 'payment accepted';
                                _data.update('orders', orderId, orderData, function (err) {
                                    if (!err) {
                                        callback(200);
                                    } else {
                                        callback(500, {'Error' : 'Could not update order status.'});
                                    }
                                });
                            } else {
                                callback(400, {'Error' : 'Payment failed.'});
                            }
                        });
                    } else {
                        callback(400, {'Error' : 'Could not find the specified order.'});
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
module.exports = _pay;
