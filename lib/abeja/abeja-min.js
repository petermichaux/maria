/*
Abeja version 0 - A JavaScript library to create DOM structures from HTML strings.
Copyright (c) 2012, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/abeja/blob/master/LICENSE
*/
var abeja=abeja||{};abeja.parseHTML=function(html,doc){doc=doc||document;var parser=doc.createElement('div');var fragment=doc.createDocumentFragment();parser.innerHTML=html;while(parser.firstChild){fragment.appendChild(parser.firstChild);}
return fragment;};