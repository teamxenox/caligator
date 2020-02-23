/**
 * Function to Copy to clipboard, on clicking an output element.
 * @param {*} selected dom element to be copied
 */
function copyToClipboard(selected) {
	const el = document.createElement('textarea');
	el.value = selected.innerText;
	document.body.append(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}

module.exports = copyToClipboard;
