/*
Pajar version 0 - A simple JavaScript library to find DOM nodes by CSS selectors.
Copyright (c) 2012, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/pajar/blob/master/LICENSE
*/
var pajar=pajar||{};(function(){var regExpCache={};function hasClass(element,className){var regExp=regExpCache[className]||(regExpCache[className]=new RegExp('(?:^|\\s+)'+className+'(?:\\s+|$)'));return regExp.test(element.className);}
function filterDOM(node,func){var results=[];function walk(node){if(func(node)){results.push(node);}
node=node.firstChild;while(node){walk(node);node=node.nextSibling;}}
walk(node);return results;}
pajar.findAll=function(selector,root){if((arguments.length>1)&&!root){throw new Error('pajar.findAll: the second argument can be omitted or an element but cannot be falsy.');}
root=root||document;var matches;if(matches=selector.match(/^#(.*)$/)){var id=matches[1];if(root.id===id){return[root];}
if((typeof root.getElementById==='function')||((typeof root.getElementById==='object')&&(root.getElementById!==null))){var el=root.getElementById(id);return el?[el]:[];}
return filterDom(root,function(node){return node.id===id;}).slice(0,1);}
matches=selector.match(/([^\.]*)\.*([^\.]*)/);var tagName=matches[1]||'*';var className=matches[2];var elements=root.getElementsByTagName(tagName);if((!elements.length)&&(tagName==='*')&&root.all){elements=root.all;}
var results=[];if((root.tagName&&(root.tagName.toLowerCase()===tagName.toLowerCase()))&&((!className)||hasClass(root,className))){results.push(root);}
if(className){for(var i=0,ilen=elements.length;i<ilen;++i){var element=elements[i];if(hasClass(element,className)){results.push(element);}}}
else{for(var i=0,ilen=elements.length;i<ilen;i++){results.push(elements[i]);}}
return results;};pajar.find=function(selector,root){return pajar.findAll.apply(pajar,arguments)[0];};}());