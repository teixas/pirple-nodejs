'use strict';

// Dependencies
var _menu  = {};

_menu.list = [
    {
        'description': 'Margherita pizza is made with basil, mozzarella cheese and tomatoes in imitation of the colors of the Italian flag.',
        'sizes' : [
            {'id': 'margherita-mini', 'name': 'Mini', 'price': 5},
            {'id': 'margherita-medium', 'name': 'Medium', 'price': 9},
            {'id': 'margherita-large', 'name': 'Large', 'price': 12}
        ]
    },
    {
        'description': 'This is a traditional Neapolitan pizza that is made with lots of garlic, anchovies and oregano.',
        'sizes' : [
            {'id': 'marinara-mini', 'name': 'Mini', 'price': 6},
            {'id': 'marinara-medium', 'name': 'Medium', 'price': 10},
            {'id': 'marinara-large', 'name': 'Large', 'price': 13}
        ]
    },
    {
        'description': 'This pizza is created using anchovies, mozzarella and tomatoes.',
        'sizes' : [
            {'id': 'napolitana-mini', 'name': 'Mini', 'price': 7},
            {'id': 'napolitana-medium', 'name': 'Medium', 'price': 11},
            {'id': 'napolitana-large', 'name': 'Large', 'price': 15}
        ]
    },
];

// Index prices by sizes identifiers
_menu.pricesById = {};
_menu.list.forEach(function (menuItem) {
    menuItem.sizes.forEach(function (size) {
        _menu.pricesById[size.id] = size.price;
    });
});

// Menu - GET
// Required data: none
// Optional data: none
_menu.get = function (data, callback) {
    callback(200, _menu.list);
};

// Export the handlers
module.exports = _menu;
