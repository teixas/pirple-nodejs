'use strict';

// Dependencies
var _menu  = {};

// Menu - GET
// Required data: none
// Optional data: none
_menu.get = function (data, callback) {
    var menu = [
        {
            'id': 'margherita',
            'description': 'Margherita pizza is made with basil, mozzarella cheese and tomatoes in imitation of the colors of the Italian flag.',
            'sizes' : [
                {'name': 'mini', 'price': 5},
                {'name': 'medium', 'price': 9},
                {'name': 'large', 'price': 12}
            ]
        },
        {
            'id': 'marinara',
            'description': 'This is a traditional Neapolitan pizza that is made with lots of garlic, anchovies and oregano.',
            'sizes' : [
                {'name': 'mini', 'price': 6},
                {'name': 'medium', 'price': 10},
                {'name': 'large', 'price': 13}
            ]
        },
        {
            'id': 'napolitana',
            'description': 'This pizza is created using anchovies, mozzarella and tomatoes.',
            'sizes' : [
                {'name': 'mini', 'price': 7},
                {'name': 'medium', 'price': 11},
                {'name': 'large', 'price': 15}
            ]
        },
    ];
    callback(200, menu);
};

// Export the handlers
module.exports = _menu;
