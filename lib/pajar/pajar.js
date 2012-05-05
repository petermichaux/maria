/*
Pajar version 0 - A simple JavaScript library to find DOM nodes by CSS selectors.
Copyright (c) 2012, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/pajar/blob/master/LICENSE
*/var pajar = pajar || {};
(function() {

    var regExpCache = {};

    function hasClass(element, className) {
        var regExp = regExpCache[className] ||
                     (regExpCache[className] = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)'));
        return regExp.test(element.className);
    }

    function filterDOM(node, func) {
        var results = [];

        function walk(node) {
            if (func(node)) {
                results.push(node);
            }
            node = node.firstChild;
            while (node) {
                walk(node);
                node = node.nextSibling;
            }
        }

        walk(node);

        return results;
    }

/**

@property parjar.findAll

@parameter selector {string} The CSS selector for the search.

@parameter root {Document|Element} Optional element to use as the search start point.

@description

Search for all elements matching the CSS selector. Returns an array of the elements.

Acceptable simple selectors are of the following forms only.

    div
    #alpha
    .beta
    div.gamma

In the case of a #myId selector, the returned array will always have
zero or one elements. It is more likely that you want to call pajar.find when
using an id selector.

If the root element is supplied it is used as the starting point for the search.
The root element can be the result. If the root element is not supplied then
the current document is used as the search starting point.

pajar.findAll('#alpha');
pajar.findAll('div.gamma', document.body);

*/
    pajar.findAll = function(selector, root) {
        if ((arguments.length > 1) && !root) {
            throw new Error('pajar.findAll: the second argument can be omitted or an element but cannot be falsy.');
        }
        root = root || document;
        var matches;

        if (matches = selector.match(/^#(.*)$/)) {
            var id = matches[1];
            if (root.id === id) {
                return [root];
            }
            if ((typeof root.getElementById === 'function') ||
                ((typeof root.getElementById === 'object') &&
                 (root.getElementById !== null))) {
                var el = root.getElementById(id);
                return el ? [el] : [];
            }
            return filterDom(root, function(node) {
                return node.id === id;
            }).slice(0, 1);
        }

        matches = selector.match(/([^\.]*)\.*([^\.]*)/);
        var tagName = matches[1] || '*';
        var className = matches[2];

        var elements = root.getElementsByTagName(tagName);
        if ((!elements.length) && (tagName === '*') && root.all) {
            elements = root.all; // IE < 6
        }

        var results = [];

        if ((root.tagName && (root.tagName.toLowerCase() === tagName.toLowerCase())) &&
            ((!className) || hasClass(root, className))) {
            results.push(root);
        }

        if (className) {
            // filter for elements with correct className
            for (var i = 0, ilen = elements.length; i < ilen; ++i) {
                var element = elements[i];
                if (hasClass(element, className)) {
                    results.push(element);
                }
            }
        }
        else {
            for (var i = 0, ilen = elements.length; i < ilen; i++) {
                results.push(elements[i]);
            }
        }

        return results;
    };

/**

@property pajar.find

@parameter selector {string} The CSS selector for the search.

@parameter root {Document|Element} Optional element to use as the search start point.

@description

Search for the first element matching the CSS selector. A single element
or undefined is returned.

The rest of the details are the same as for pajar.findAll.

*/
    pajar.find = function(selector, root) {
        // use apply to preserve the number of arguments sent to findAll
        return pajar.findAll.apply(pajar, arguments)[0];
    };

}());
