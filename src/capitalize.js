/**

Capitalize the first letter of the string.

    maria.capitalize('abcDef'); // 'AbcDef'

@param {string} str The string to be capitalized.

@return {string} The capitalized string.

*/
maria.capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
