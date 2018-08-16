This API is based on implementation available at course's Section 3 with
sligthly refactoring on handlers that are splitted on several dedicated files.
With the available API methods we can:

- get, add, edit and delete users;
- create new tokens, extend unexpired tokens, delete tokens;
- obtain menu list;
- add menu items to shopping cart;
- create order from items on shopping cart and list user orders;
- pay for our orders

Payments are done using Stripe sandbox and receipts are sent through Maingun
services. These receipts are sent by an worker that runs in background.

This project has some dependencies defined in *package.json*:

- async
- mailgun-js
- stripe

**API**

All methods marked with **(*)** expects a token value on header.

**Users**

*GET* **(*)**

Get information of an user

URL: */users?email=foo@bar.com*

Returns:

    {
          "firstName": "Foo",
          "lastName": "Bar",
          "email": "foo@bar.com",
          "streetAddress": "Sesame Street",
          "shoppingCart": []
    }
    
*POST*

Add a new user

URL: */users*

Body:

    {
          "firstName": "Foo",
          "lastName": "Bar",
          "email": "foo@bar.com",
          "streetAddress": "Sesame Street",
          "password": "my_password"
    }

Returns: Empty body with status code

*PUT* **(*)**

Edit user information

URL: */users*

Body:

    {
          "email": "foo@bar.com",
          "streetAddress": "New Sesame Street",
          "password": "my_password_modified"
    }

Returns: Empty body with status code

*DELETE* **(*)**

Delete an user account

URL: */users?email=foo@bar.com*

Returns: Empty body with status code

**Tokens**

*GET*

Get information from a token

URL: */tokens?id=na4ctflv0a29c2sob7sf*

Returns:

    {
      "email": "foo@bar.com",
      "id": "na4ctflv0a29c2sob7sf",
      "expires": 1533237620707
    }


*POST*

Create a new token

URL: */tokens*

Body:

    {
          "email": "foo@bar.com",
          "password": "my_password"
    }

Returns:

    {
      "email": "foo@bar.com",
      "id": "3s163aalfajzuis0b7ns",
      "expires": 1533237654321
    }


*PUT*

Extend token expiration an hour (if not expired)

URL: */tokens*

Body:

    {
      "id": "3s163aalfajzuis0b7ns",
      "extend": true
    }

Returns: Empty body with status code

*DELETE*

Delete a token

URL: */tokens?id=na4ctflv0a29c2sob7sf*

Returns: Empty body with status code

**Menu**

*GET*

Return menu list

URL: */menu*

Returns:

    [
        {
            "description": "Margherita pizza is made with basil, mozzarella cheese and tomatoes in imitation of the colors of the Italian flag.",
            "sizes": [
                {
                    "id": "margherita-mini",
                    "name": "Mini",
                    "price": 5
                },
                {
                    "id": "margherita-medium",
                    "name": "Medium",
                    "price": 9
                },
                {
                    "id": "margherita-large",
                    "name": "Large",
                    "price": 12
                }
            ]
        },
    (...)
    ]

**Shopping cart**

*POST* **(*)**

Add items to shopping cart

URL: */shopping-cart*

Body:

    {
      "email": "foo@bar.com",
      "shoppingCart": [
          {
              "itemId": "margherita-medium",
              "quantity": 2
          },
          {
              "itemId": "margherita-large",
              "quantity": 1
          }
      ]
    }

Returns: Empty body with status code

**Orders**

*POST* **(*)**

Creates an order from items on shopping cart

URL: */orders?email=foo@bar.com*

Returns:

    {
      "email": "foo@bar.com",
      "id": "cunhqtj3ezsjtjj4u2m1",
      "items": [
          {
              "itemId": "margherita-medium",
              "quantity": 2
          },
          {
              "itemId": "margherita-large",
              "quantity": 1
          }
      ],
      "total": 30,
      "status": "waiting payment"
    }

*GET* **(*)**

Get all orders from user

URL: */orders?email=foo@bar.com*

Returns:

    [
    {
      "email": "foo@bar.com",
      "id": "cunhqtj3ezsjtjj4u2m1",
      "items": [
          {
              "itemId": "margherita-medium",
              "quantity": 2
          },
          {
              "itemId": "margherita-large",
              "quantity": 1
          }
      ],
      "total": 30,
      "status": "payment accepted"
    },
    (...)
    ]

**Pay**

*POST* **(*)**

Pay an order

URL: */pay*

Body:

    {
      "email": "foo@bar.com",
      "orderId": "cunhqtj3ezsjtjj4u2m1",
      "payToken": "sk_test_BQokikJOvBiI2HlWgH4olfQ2",
    },

Returns: Empty body with status code
