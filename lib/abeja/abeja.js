/*
Abeja version 0 - A JavaScript library to create DOM structures from HTML strings.
Copyright (c) 2012, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/abeja/blob/master/LICENSE
*/var abeja = abeja || {};
/**

@property abeja.parseHTML

@parameter html {string} The string of HTML to be parsed.

@parameter doc {Document} The document object to create the new DOM nodes.

@description

Returns a document fragment that has the children defined by the html string.

var fragment = abeja.parseHTML('<p>alpha beta</p>');
document.body.appendChild(fragment);

*/
abeja.parseHTML = function(html, doc) {
    doc = doc || document;
    var parser = doc.createElement('div');
    var fragment = doc.createDocumentFragment();
    parser.innerHTML = html;
    while (parser.firstChild) {
        fragment.appendChild(parser.firstChild);
    }
    return fragment;
};
