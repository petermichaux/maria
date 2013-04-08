/*
Arbutus version 4
Copyright (c) 2013, Peter Michaux
All rights reserved.
Licensed under the Simplified BSD License.
https://github.com/petermichaux/arbutus/blob/master/LICENSE
*/

var arbutus={};(function(){var trimLeft=/^\s+/,trimRight=/\s+$/;function trim(str){return str.replace(trimLeft,'').replace(trimRight,'');}
function getFirstChild(element){return element.firstChild;}
function getFirstGrandChild(element){return element.firstChild.firstChild;}
function getSecondGrandChild(element){return element.firstChild.firstChild.nextSibling;}
function getFirstGreatGrandChild(element){return element.firstChild.firstChild.firstChild;}
function getFirstGreatGreatGrandChild(element){return element.firstChild.firstChild.firstChild.firstChild;}
function makeParser(before,after,getFirstResult){return function(html,doc){var parser=doc.createElement('div');var fragment=doc.createDocumentFragment();parser.innerHTML=before+html+after;var node=getFirstResult(parser);var nextNode;while(node){nextNode=node.nextSibling;fragment.appendChild(node);node=nextNode;}
return fragment;};}
var defaultParser=makeParser('','',getFirstChild);var parsers={'td':makeParser('<table><tbody><tr>','</tr></tbody></table>',getFirstGreatGreatGrandChild),'tr':makeParser('<table><tbody>','</tbody></table>',getFirstGreatGrandChild),'tbody':makeParser('<table>','</table>',getFirstGrandChild),'col':makeParser('<table><colgroup>','</colgroup></table>',getFirstGreatGrandChild),'option':makeParser('<select><option>a</option>','</select>',getSecondGrandChild)};parsers.th=parsers.td;parsers.thead=parsers.tbody;parsers.tfoot=parsers.tbody;parsers.caption=parsers.tbody;parsers.colgroup=parsers.tbody;var tagRegExp=/^<([a-z]+)/i;arbutus.parseHTML=function(html,doc){html=trim(html);var parser=defaultParser;var matches=html.match(tagRegExp);if(matches){var name=matches[1].toLowerCase();if(Object.prototype.hasOwnProperty.call(parsers,name)){parser=parsers[name];}}
return parser(html,doc||document);};}());