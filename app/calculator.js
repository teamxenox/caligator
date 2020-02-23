'use strict';

const main = require('../lib/_calculator');
const copyToClipboard = require('../utils/copy-to-clipboard');

const inputContainer = document.querySelectorAll('.app__input')[0];
const outputContainer = document.querySelectorAll('.app__output')[0];
const totalContainer = document.querySelector('#app__total__output');
let equationsCollected = [];

/**
 * To split the input based on newline and evaluates
 * @param {Object} textbox
 */
function getSelection(textbox) {
	let selectedText = null;
	const { activeElement } = document;

	// All browsers (including IE9 and up), except IE before version 9
	if (
		window.getSelection &&
		activeElement &&
		(activeElement.tagName.toLowerCase() === 'textarea' ||
			(activeElement.tagName.toLowerCase() === 'input' &&
				activeElement.type.toLowerCase() === 'text')) &&
		activeElement === textbox
	) {
		const startIndex = textbox.selectionStart;
		const endIndex = textbox.selectionEnd;

		if (endIndex - startIndex > 0) {
			const text = textbox.value;
			selectedText = text.substring(
				textbox.selectionStart,
				textbox.selectionEnd
			);
		}
	} else if (
		document.selection &&
		document.selection.type === 'Text' &&
		document.selection.createRange
	) {
		// All Internet Explorer
		const range = document.selection.createRange();
		selectedText = range.text;
	}

	return selectedText;
}

function getInputSelection(el) {
	let start = 0;
	let end = 0;
	let normalizedValue;
	let range;
	let textInputRange;
	let len;
	let endRange;

	if (
		typeof el.selectionStart === 'number' &&
		typeof el.selectionEnd === 'number'
	) {
		start = el.selectionStart;
		end = el.selectionEnd;
	} else {
		range = document.selection.createRange();

		if (range && range.parentElement() === el) {
			len = el.value.length;
			normalizedValue = el.value.replace(/\r\n/g, '\n');

			// Create a working TextRange that lives only in the input
			textInputRange = el.createTextRange();
			textInputRange.moveToBookmark(range.getBookmark());

			// Check if the start and end of the selection are at the very end
			// of the input, since moveStart/moveEnd doesn't return what we want
			// in those cases
			endRange = el.createTextRange();
			endRange.collapse(false);

			if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
				start = len;
				end = len;
			} else {
				start = -textInputRange.moveStart('character', -len);
				start += normalizedValue.slice(0, start).split('\n').length - 1;

				if (
					textInputRange.compareEndPoints('EndToEnd', endRange) > -1
				) {
					end = len;
				} else {
					end = -textInputRange.moveEnd('character', -len);
					end += normalizedValue.slice(0, end).split('\n').length - 1;
				}
			}
		}
	}

	return {
		start,
		end
	};
}

function replaceSelectedText(keyCode, secondKeyCode = 0, reverse = false) {
	const selection = getInputSelection(inputContainer);
	const val = inputContainer.value;
	if (secondKeyCode) {
		if (reverse) {
			inputContainer.value =
				val.slice(0, selection.start) +
				keyCode +
				val.slice(selection.start, selection.end) +
				secondKeyCode +
				val.slice(selection.end);
		} else {
			inputContainer.value =
				val.slice(0, selection.start) +
				secondKeyCode +
				val.slice(selection.start, selection.end) +
				keyCode +
				val.slice(selection.end);
		}
	} else {
		inputContainer.value =
			val.slice(0, selection.start) +
			keyCode +
			val.slice(selection.start, selection.end) +
			keyCode +
			val.slice(selection.end);
	}
}

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

/**
 * This function passes the data and updates the result on the markup
 * @param {Array} arr - gets the expression by line as an array
 * @private
 */

// FIXME : Output position for multiline input
function evaluate(arr) {
	const output = arr.map(each => main(each));
	outputContainer.innerText = '';
	let displayTotal = 0;
	output.forEach(value => {
		const result = document.createElement('p');
		result.className = '__output';
		if (
			Number(parseFloat(value)) === parseFloat(value) &&
			parseFloat(value) % 1 !== 0
		) {
			value = parseFloat(value);
			result.innerText += Number(
				value.toFixed(window.localStorage.decimalPoint)
			);
		} else {
			result.innerText += value;
		}

		result.addEventListener('click', function() {
			copyToClipboard(this);
		});

		outputContainer.append(result);
		displayTotal += value;
		totalContainer.innerText = displayTotal;
	});
}

// Adding eventListeners
inputContainer.addEventListener('keydown', e => {
	const quotesObj = {
		'"': true,
		"'": true
	};
	const bracketsObj = {
		'(': 1,
		')': 2,
		'[': 3,
		']': 4,
		'{': 5,
		'}': 6
	};

	if (getSelection(inputContainer) && quotesObj[e.key]) {
		e.preventDefault();
		replaceSelectedText(e.key);
	} else if (getSelection(inputContainer) && bracketsObj[e.key]) {
		e.preventDefault();
		if (bracketsObj[e.key] % 2) {
			replaceSelectedText(
				e.key,
				getKeyByValue(bracketsObj, bracketsObj[e.key] + 1),
				true
			);
		} else {
			replaceSelectedText(
				e.key,
				getKeyByValue(bracketsObj, bracketsObj[e.key] - 1)
			);
		}
	}
});

inputContainer.addEventListener('keyup', e => {
	equationsCollected = e.target.value.split('\n');
	evaluate(equationsCollected);
});
