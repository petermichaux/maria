Open src/index.html in a web browser. Scroll down the div and watch more elements load.

This example is a rough start at an endless scrollable list of products. This isn't finished but it shows the division of labor between the model, view, template, and controller.

Notes:

The ProductsModel instance can load data in chunks. There is a _nextOffset field in the model. It is used to tell the server which chunk (pagination page) is desired.

It isn't "endless" as there are only 100 products. When the list gets to the end, it stops asking the server for data. The ProductsModel has a _isComplete field that is set when the server sends back an empty products array meaning that there are no more products to fetch.

The model has a _isLoading field that the view can use to show a throbber when more products are being fetched. I described this approach in detail in my MVC article on my website down the page in a section called "Controller".

http://peter.michaux.ca/articles/mvc-architecture-for-javascript-applications

The ProductsView is particularly dumb (as views usually are.) All it can do related to this endless scroll business is recognize a scroll event and forward it to the controller and also answer isScrolledToBottom. (This is a naive implementation of isScrolledToBottom but it works in Firefox and IE6.)

The ProductsController isn't so genius either. That seems good to me.

ProductsTemplate and the Products.css file are worth looking at.

The myth.js file is worth reading if you want to know how I faked out the server.
