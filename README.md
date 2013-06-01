Maria
=====

The MVC framework for JavaScript applications. The real MVC. The Smalltalk MVC. The Gang of Four MVC. 

* A model contains domain data. When a model changes, it informs its observers.

* A view observes a model and represents its model's current state. A view has a controller. A view can have child views.

* A controller decides what happens when a user interacts with the controller's view.

The three core design patterns of MVC (observer, composite, and strategy) are embedded in Maria's Model, View, and Controller objects. Other patterns traditionally included in MVC implementations (e.g. factory method and template) make appearances too.


Downloads
---------

See http://peter.michaux.ca/downloads/maria/

`maria.js` contains all the Maria source files concatenated together. This is a good file to use during the development of your application.

`maria-min.js` contains the same code as `maria.js` but `maria-min.js` has been minified to remove whitespace and code comments. This is a good file to serve in production.

`maria-amd.js` contains the same code as `maria.js` but it is wrapped in an AMD module definition that returns the `maria` object.

Install via Bower with ```bower install maria```


Documentation
-------------

See [http://peter.michaux.ca/maria/](http://peter.michaux.ca/maria/)


Examples
--------

The `eg` directory contains several example applications.

Maria is one of the frameworks included in the [TodoMVC project](http://addyosmani.github.com/todomvc/).


Community
---------

You can report bugs, suggest features, or join general discussion at https://github.com/petermichaux/maria/issues


Status
------

Stable.


Browser Support
---------------

Tested working in IE6 and newer browsers by a variety of manufacturers.


Dependencies
------------

None. Maria combines several independent micro libraries which are all included.


Source Code
-----------

See https://github.com/petermichaux/maria


Build
-----

To build the production ready files, just type `make` at the command line and look in the `build` directory for the results. The first time you run `make`, it will download some libraries used during the build process and install them in the `lib` directory: [Google's Closure Compiler](https://developers.google.com/closure/compiler/) and [JSDoc3](https://github.com/jsdoc3/jsdoc).


Tests
-----

To run the automated tests, open `tst/runner.html` in a web browser.


Acknowledgements
----------------

Thanks to [James Ladd](http://jamesladdcode.com/) for encouraging me to start this project. Check out his [Redline Smalltalk](http://www.redline.st/) if Smalltalk on the JVM seems like a good idea to you.

Thanks to the [Buster.JS](http://busterjs.org/) development team for providing a great, automated testing tool.

Thanks to the Git and GitHub teams for making it easy to collaborate with others on code projects.


Author
------

Peter Michaux<br>
petermichaux@gmail.com<br>
http://peter.michaux.ca/<br>
[@petermichaux](https://twitter.com/petermichaux)


License
-------

Simplified BSD License. See the included LICENSE file for details.
