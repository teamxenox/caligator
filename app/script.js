'use strict';

const { remote } = require('electron');
const main = require('../utils/main');

// By default OS theme
// user theme has high precedence
// os theme and user theme applied then USer theme
// user theme and OS theme applied then User theme
if (process.platform === 'darwin') {
	const { systemPreferences } = remote;

	const defaultTheme = () => {
		if (
			window.localStorage.userTheme === undefined ||
			window.localStorage.userTheme === 'auto'
		) {
			window.localStorage.osTheme = systemPreferences.isDarkMode()
				? 'dark'
				: 'light';

			if ('loadTheme' in window) {
				window.loadTheme();
			}
		}
	};

	const defaultPoint = () => {
		if (window.localStorage.decimalPoint === undefined) {
			window.localStorage.decimalPoint = 4;
		}
	};

	systemPreferences.subscribeNotification(
		'AppleInterfaceThemeChangedNotification',
		defaultTheme
	);

	defaultTheme();
	defaultPoint();
}

// Main

/** @type {String} */
const inputContainer = document.querySelectorAll('.app__input')[0];

/** @type {Object} */
const outputContainer = document.querySelectorAll('.app__output')[0];

/** @type  {Object} */
const totalContainer = document.querySelector('#app__total__output');

/** @type {Array} */
let equationsCollected = [];

/**
 * @event
 * This function splits the input based on newline and evaluates
 */
function getSelection(textbox) {
	let selectedText = null;
	let activeElement = document.activeElement;

	// all browsers (including IE9 and up), except IE before version 9
	if (
		window.getSelection &&
		activeElement &&
		(activeElement.tagName.toLowerCase() == 'textarea' ||
			(activeElement.tagName.toLowerCase() == 'input' &&
				activeElement.type.toLowerCase() == 'text')) &&
		activeElement === textbox
	) {
		let startIndex = textbox.selectionStart;
		let endIndex = textbox.selectionEnd;

		if (endIndex - startIndex > 0) {
			let text = textbox.value;
			selectedText = text.substring(
				textbox.selectionStart,
				textbox.selectionEnd
			);
		}
	} else if (
		document.selection &&
		document.selection.type == 'Text' &&
		document.selection.createRange
	) {
		// All Internet Explorer
		let range = document.selection.createRange();
		selectedText = range.text;
	}

	return selectedText;
}

function getInputSelection(el) {
    let start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}

function replaceSelectedText(keyCode, secondKeyCode = 0, reverse = false) {
    let selection = getInputSelection(inputContainer), val = inputContainer.value;
		if(secondKeyCode){
			if(reverse){
				inputContainer.value = val.slice(0, selection.start) + keyCode + val.slice(selection.start,selection.end) + secondKeyCode + val.slice(selection.end);
			}
			else{
				inputContainer.value = val.slice(0, selection.start) + secondKeyCode + val.slice(selection.start,selection.end) + keyCode + val.slice(selection.end);
			}
		}
		else{
			inputContainer.value = val.slice(0, selection.start) + keyCode + val.slice(selection.start,selection.end) + keyCode + val.slice(selection.end);
		}
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

inputContainer.addEventListener('keydown', e => {
	const quotesObj = {
		"\"":true,
		"\'":true
	}
	const bracketsObj = {
		"(":1,
		")":2,
		"[":3,
		"]":4,
		"{":5,
		"}":6
		};

	if(getSelection(inputContainer) && quotesObj[e.key]){
		e.preventDefault();
		replaceSelectedText(e.key)
	}
	else if(getSelection(inputContainer) && bracketsObj[e.key]){
		e.preventDefault();
		if(bracketsObj[e.key] % 2){
			replaceSelectedText(e.key, getKeyByValue(bracketsObj, bracketsObj[e.key]+1), true)
		}
		else{
			replaceSelectedText(e.key, getKeyByValue(bracketsObj, bracketsObj[e.key]-1))
		}
	}
})

inputContainer.addEventListener('keyup', e => {
	equationsCollected = e.target.value.split('\n');
	evaluate(equationsCollected);
});

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
			result.innerText += +value.toFixed(
				window.localStorage.decimalPoint
			);
		} else {
			result.innerText += value;
		}
		result.addEventListener('click', function() {
			copyClicked(this);
		});

		outputContainer.append(result);
		displayTotal += value;
		totalContainer.innerText = displayTotal;
	});
}

// Controls

/** @const {Object} */
const appPopup = document.querySelectorAll('.modal')[0];

/**
 * This function adds the window controls to the application
 * @private
 */
(function() {
	const { BrowserWindow } = require('electron').remote;

	function init() {
		document
			.querySelector('#app--minimize')
			.addEventListener('click', () => {
				const window = BrowserWindow.getFocusedWindow();
				window.minimize();
			});

		document.querySelector('#app--close').addEventListener('click', () => {
			const window = BrowserWindow.getFocusedWindow();
			window.close();
		});

		document
			.querySelector('#app--settings')
			.addEventListener('click', () => {
				appPopup.style.display = 'block';
			});

		document
			.querySelector('#modal__popup--close')
			.addEventListener('click', () => {
				appPopup.style.display = 'none';
			});

		document
			.querySelector('#theme-switcher')
			.addEventListener('change', e => {
				const userTheme = e.target.value;
				if (userTheme === 'auto') {
					document.documentElement.setAttribute(
						'data-theme',
						window.localStorage.osTheme || 'light'
					);
				} else {
					document.documentElement.setAttribute(
						'data-theme',
						userTheme
					);
				}

				window.localStorage.userTheme = userTheme;
			});

		document
			.querySelector('#decimal-switcher')
			.addEventListener('change', e => {
				const decimalPoint = e.target.value;
				window.localStorage.decimalPoint = decimalPoint;
			});
	}

	document.onreadystatechange = () => {
		if (document.readyState === 'complete') {
			init();
			const userTheme =
				window.localStorage.userTheme ||
				window.localStorage.osTheme ||
				'light';

			const decimalPoint = window.localStorage.decimalPoint || 4;

			if (userTheme === 'auto') {
				document.documentElement.setAttribute(
					'data-theme',
					window.localStorage.osTheme || 'light'
				);
			} else {
				document.documentElement.setAttribute('data-theme', userTheme);
			}

			document.querySelector('#theme-switcher').value = userTheme;
			document.querySelector('#decimal-switcher').value = decimalPoint;
		}
	};
})();

// Function to Copy to clipboard, on clicking an output element.
function copyClicked(p_output_element) {
	const el = document.createElement('textarea');
	el.value = p_output_element.innerText;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}

const getResizeableElement = () => {
	return document.querySelector('.app__input');
};
const getSecondResizeableElement = () => {
	return document.querySelector('.app__output');
};
const getHandleElement = () => {
	return document.getElementById('handle');
};
const minPaneSize = 100;
let maxPaneSize = document.body.clientWidth * 0.75;
const minSecondPanelSize = 25;
getResizeableElement().style.setProperty('--max-width', `${maxPaneSize}px`);
getResizeableElement().style.setProperty('--min-width', `${minPaneSize}px`);

const setPaneWidth = width => {
	getResizeableElement().style.setProperty(
		'--resizeable-width',
		`${width}px`
	);
	let secondWidth =
		minSecondPanelSize +
		((maxPaneSize -
			parseFloat(
				getComputedStyle(getResizeableElement()).getPropertyValue(
					'--resizeable-width'
				)
			)) /
			maxPaneSize) *
			100;
	if (secondWidth >= minSecondPanelSize) {
		getSecondResizeableElement().style.setProperty(
			'--resizeable-width',
			`${secondWidth}%`
		);
	}
};

const getPaneWidth = () => {
	const pxWidth = getComputedStyle(getResizeableElement()).getPropertyValue(
		'--resizeable-width'
	);
	return parseInt(pxWidth, 10);
};

const startDragging = event => {
	event.preventDefault();
	const host = getResizeableElement();
	const startingPaneWidth = getPaneWidth();
	const xOffset = event.pageX;

	const mouseDragHandler = moveEvent => {
		moveEvent.preventDefault();
		maxPaneSize = document.body.clientWidth * 0.75;
		getResizeableElement().style.setProperty(
			'--max-width',
			`${maxPaneSize}px`
		);

		const primaryButtonPressed = moveEvent.buttons === 1;
		if (!primaryButtonPressed) {
			setPaneWidth(
				Math.min(Math.max(getPaneWidth(), minPaneSize), maxPaneSize)
			);
			document.body.removeEventListener('pointermove', mouseDragHandler);
			return;
		}

		const paneOriginAdjustment = 'left' === 'right' ? 1 : -1;
		setPaneWidth(
			(xOffset - moveEvent.pageX) * paneOriginAdjustment +
				startingPaneWidth
		);
	};
	const remove = document.body.addEventListener(
		'pointermove',
		mouseDragHandler
	);
};

getHandleElement().addEventListener('mousedown', startDragging);
