# K9 Partners for Patriots Inventory Management System
Deployed Site:
https://k9partners.herokuapp.com/

Credit to:
MEAN.JS
Quagga.JS



## How-to run locally:
Install npm/node
In command prompt type npm start, go to http://localhost:3000 to see site.

## How-to update database and server connections
1. To change the mongo db uri for development, go to config/env/development.js and change the link
2. To change the mongo db uri for deployment, go to heroku. Click on the k9partners app click settings and change the config variable. Next reveal config variable button and then paste in your uri.

## Functionality and Screenshots
User Features
Provide a screenshot of the major features you developed and a brief description of what the feature does.

![alt text](https://imgur.com/056w9ci)

The above page is the move inventory that uses a live barcode scanning to move items out of the inventory into the client or out of the client into the inventory. This is the only feature that is included within the user implementation; thus, the main menu is not needed to be included.

Admin Features
Provide a screenshot of the major admin features you developed and a brief description. Especially, the admin dashboards you may have developed. This is one of the clients most need to use the web application you created for them.

![alt text](https://imgur.com/RdWeeD7)

Above can be shown the client management list view. From here, the admin can organize and sort the clients from the database on the page. The admin can also manage the view based on inactive clients, too.

![alt text](https://imgur.com/qT2S9pM)

The above page is where admins can create new clients to add to the database. If the veteran checkbox is clicked, then the branch checkboxes and rank field appears, as shown above. An appropriate edit page exists that is quite similar to this one.

![alt text](https://imgur.com/7HQEepV)

The above page shows the details page when a client is selected. It shows the fields and roles associated with each client, as well as the inventory the client has.

![alt text](https://imgur.com/qT2S9pM)

The above page is where admins can manage their inventory and see the list they currently have. They have the option to create, receive, and move items through the inventory.

![alt text](https://imgur.com/TKTPnOZ)

The above page is the receive inventory that uses a live barcode scanning to move items out of the inventory into the client or out of the client into the inventory.

![alt text](https://imgur.com/WLmeger)

The above page shows the details page for an inventory item. It displays the UPC, description, and quantity of each respective item.

![alt text](https://imgur.com/WLmeger)

The above page shows the list of users that exist in the application.

![alt text](https://imgur.com/xqXtNNX)

The above page shows the user creation page where different fields are inserted to create new users. An appropriate edit page is associated with a similar view, as well.

![alt text](https://imgur.com/hji3OFi)

The above page shows the details page for a user. It describes the name, email, provider, and roles of each respective user in the system.

![alt text](https://imgur.com/j6DzbqB)

The above page shows the user log of the users in the system. This is a list of interactions users did between clients and inventory. The view also shows which direction items went (to and fro).
