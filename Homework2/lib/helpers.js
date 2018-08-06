'use strict';
/*
 * Helpers for various tasks
 *
 */

// Dependencies
var crypto = require('crypto'),
    https = require('https'),
    querystring = require('querystring'),

    config = require('./config'),

    // Container for all the helpers
    helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function (str) {
    try {
        var obj = JSON.parse(str);
        return obj;
    } catch (error) {
        return {};
    }
};

// Create a SHA256 hash
helpers.hash = function (str) {
    if (typeof str === 'string' && str.length > 0) {
        return crypto.createHmac(
            'sha256',
            config.hashingSecret
        ).update(str).digest('hex');
    }
    return false;
};

helpers.sendStripePayment = function (token, orderId, amount, callback) {
    var stripe = require('stripe')(token);
    stripe.charges.create({
        amount: amount,
        currency: 'usd',
        source: 'tok_visa',
        metadata: {'order_id': orderId}
    }, callback);
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function (strLength) {
    strLength = typeof strLength  === 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters that could go into a string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789',
            str,
            i,
            randomCharacter;

        // Start the final string
        str = '';
        for (i = 1; i <= strLength; i += 1) {
        // Get a random charactert from the possibleCharacters string
            randomCharacter = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );
        // Append this character to the string
            str += randomCharacter;
        }
        // Return the final string
        return str;
    }
    return false;
};

// Export the module
module.exports = helpers;
