/**
 * To find and replace the any occurrence of a given string with the replacement
 * @param {string} str string to be searched and replaced
 * @param {string} find string to be replaced
 * @param {string} replacement replacement string
 * @returns {string} replaced string or original string
 */
const replaceAll = (str, find, replacement) => {
	return str && find && replacement ? str.split(find).join(replacement) : str;
};

module.exports = replaceAll;
