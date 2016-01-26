/**

Returns a new string with the leading and trailing whitespace removed.

Same idea as `String.prototype.trim` in modern JavaScript engines.

    var str = ' a \n b ';
    str.length;            // 7
    str = maria.trim(str); // 'a \n b'
    str.length;            // 5

@param {string} str The string to be trimmed.

@return {string} The trimmed string.

*/
maria.trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
};
