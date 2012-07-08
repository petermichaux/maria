Maria
=====

An MVC framework for JavaScript applications. The real MVC. The Smalltalk MVC. The Gang of Four MVC. 

* A model contains domain data. When a model changes, it informs its observers.

* A view observes a model and represents its model's current state. A view has a controller. A view can have child views.

* A controller decides what happens when a user interacts with the controller's view.

The three core design patterns of MVC (observer, composite, and strategy) are embedded in Maria's Model, View, and Controller objects. Other patterns traditionally included in MVC implementations (e.g. factory method and template) make appearances too.


Downloads
---------

See http://peter.michaux.ca/downloads/maria/

```maria.js``` contains all the Maria source files concatenated together. This is a good file to use during the development of your application.

```maria-min.js``` contains the same code as ```maria.js``` but ```maria-min.js``` has been minified to remove whitespace and code comments. This is a good file to serve in production.


Status
------

Release candidates are in progress.


Browser Support
---------------

Tested working in IE6 and newer browsers by a variety of manufacturers.


Dependencies
------------

None. Maria combines several independent micro libraries which are all included.


Examples
--------

The eg directory contains example applications including the canonical to-do application.


Community
---------

Google Group: http://groups.google.com/group/maria-js

IRC: #maria.js on irc.freenode.net


Source Code
-----------

GitHub: https://github.com/petermichaux/maria


Build
-----

To build the production ready files, you need [JSMin](http://www.crockford.com/javascript/jsmin.html) or any other tool with the same command line interface. Then just type "make" at the command line and look in the build directory for the results.

For the record, this is how I installed JSMin. Note that I have /Users/peter/bin in my PATH.

```sh
$ cd ~/tmp
$ curl -O https://raw.github.com/douglascrockford/JSMin/master/jsmin.c
$ gcc -o jsmin jsmin.c
$ mv jsmin ~/bin
$ rm jsmin.c
$ which jsmin
/Users/peter/bin/jsmin
```


Tests
-----

To run the automated tests, open tst/runner.html in a web browser.


Acknowledgements
----------------

Thanks to [James Ladd](http://jamesladdcode.com/) for encouraging me to start this project. Checkout his [Redline Smalltalk](http://www.redline.st/) if Smalltalk on the JVM seems like a good idea to you.

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
