'use strict';

var debug = require('util').debuglog('workers'),

    _data = require('./data'),
    helpers = require('./helpers'),
    workers = {};

// Process all orders that were payed and send respective receipt to the user
workers.sendReceiptEmails = function () {
  // List all the order files
    _data.list('orders', function (error, orders) {
        if (!error && orders && orders.length > 0) {
            orders.forEach(function (order) {
                var orderId = order.replace('.json', '');
                // Lookup the order
                _data.read('orders', orderId, function (err, orderData) {
                    if (!err && orderData && orderData.status === 'payment accepted') {
                        helpers.sendEmail(
                            orderData.email,
                            'Order #' + orderId + ' receipt',
                            'Thanks! Payment with value of ' + orderData.total + ' accepted',
                            function (error) {
                                if (!error) {
                                    orderData.status = 'receipt sent';
                                    _data.update('orders', orderId, orderData, function (err) {
                                        if (err) {
                                            debug('Could not update order status of' + orderId);
                                        }
                                    });
                                }
                            }
                        );
                    } else {
                        debug('Could not find order ' + orderId);
                    }
                });
            });
        }
    });
};


// Timer to execute the worker-process once per minute
workers.loop = function () {
    setInterval(function () {
        workers.sendReceiptEmails();
    }, 1000 * 60);
};

// Init
workers.init = function () {
    // Send email receipts immediately
    workers.sendReceiptEmails();

    // Call email receipts in loop
    workers.loop();
};

module.exports = workers;
