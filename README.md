Maria
=====

An MVC framework for JavaScript applications. The real MVC. The Smalltalk MVC. The Gang of Four MVC. 

* A model contains domain data. When a model changes, it informs its observers.

* A view observes a model and represents its model's current state. A view has a controller. A view can have child views.

* A controller decides what happens when a user interacts with its view.

The three core design patterns of MVC (observer, composite, and strategy) are embedded in Maria's Model, View, and Controller objects. Other patterns traditionally included in MVC implementations (e.g. factory method and template) make appearances too.


Status
------

Maria is a new project and under construction.


Dependencies
------------

None. Maria combines several independent micro libraries which are all included.


Build
-----

To build, you need [JSMin](http://www.crockford.com/javascript/jsmin.html) or any other tool with the same command line interface. Then just type "make" at the command line and look in the build directory for the results.


Tests
-----

To run the automated tests, open tst/runner.html in a web browser.


Acknowledgements
----------------

Thanks to [James Ladd](http://jamesladdcode.com/) for encouraging me to start this project. Checkout his [Redline Smalltalk](http://www.redline.st/) if Smalltalk on the JVM seems like a good idea to you.

Thanks to the [Buster.JS](http://busterjs.org/) development team for providing a great, automated testing tool.
