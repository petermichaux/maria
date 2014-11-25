/*
Grail version 1.0.4
Copyright (c) 2014, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/grail/blob/master/LICENSE
*/

var grail={};(function(){var trimLeft=/^\s+/;var trimRight=/\s+$/;var idRegExp=/^#(\S+)$/;var tagClassRegExp=/^([\w-]+)?(?:\.([\w-]+))?$/;function trim(str){return str.replace(trimLeft,'').replace(trimRight,'');}
function isHostMethod(obj,prop){return(typeof obj[prop]==='function')||((typeof obj[prop]==='object')&&(obj[prop]!==null));}
function findAllInDOM(node,func){var results=[];function walk(node){if(func(node)){results.push(node);}
node=node.firstChild;while(node){walk(node);node=node.nextSibling;}}
walk(node);return results;}
function findInDOM(node,func){function walk(node){if(func(node)){return node;}
node=node.firstChild;while(node){var result=walk(node);if(result){return result;}
node=node.nextSibling;}}
return walk(node);}
function findById(id,root){return(root.id===id)?root:(isHostMethod(root,'getElementById'))?root.getElementById(id):(isHostMethod(root,'querySelector'))?root.querySelector('#'+id):findInDOM(root,function(node){return node.id===id;});}
function getTagNameClassNameMatcher(tagName,className){tagName=tagName?tagName.toUpperCase():'*';if(className){var regExp=new RegExp('(?:^|\\s+)'+className+'(?:\\s+|$)');}
return function(element){return(((tagName==='*')||(element.tagName&&(element.tagName.toUpperCase()===tagName)))&&((!className)||regExp.test(element.className)));}}
grail.findAll=function(selector,root){selector=trim(selector);root=root||document;var matches;if(matches=selector.match(idRegExp)){var el=findById(matches[1],root);return el?[el]:[];}
else if(matches=selector.match(tagClassRegExp)){var tagNameClassNameMatcher=getTagNameClassNameMatcher(matches[1],matches[2]);if(isHostMethod(root,'querySelectorAll')){var elements;var results=[];if(tagNameClassNameMatcher(root)){results.push(root);}
elements=root.querySelectorAll(selector);for(var i=0,ilen=elements.length;i<ilen;i++){results.push(elements[i]);}
return results;}
else{return findAllInDOM(root,tagNameClassNameMatcher);}}
else{throw new Error('grail.findAll: Unsupported selector "'+selector+'".');}};grail.find=function(selector,root){selector=trim(selector);root=root||document;var matches;if(matches=selector.match(idRegExp)){return findById(matches[1],root);}
else if(matches=selector.match(tagClassRegExp)){var tagNameClassNameMatcher=getTagNameClassNameMatcher(matches[1],matches[2]);if(isHostMethod(root,'querySelector')){return tagNameClassNameMatcher(root)?root:root.querySelector(selector);}
else{return findInDOM(root,tagNameClassNameMatcher);}}
else{throw new Error('grail.find: Unsupported selector "'+selector+'".');}};}());