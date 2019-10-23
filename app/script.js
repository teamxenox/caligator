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

	systemPreferences.subscribeNotification(
		'AppleInterfaceThemeChangedNotification',
		defaultTheme
	);

	defaultTheme();
}

// Main

/** @type {String} */
const inputContainer = document.querySelectorAll('.app__input')[0];

/** @type {Object} */
const outputContainer = document.querySelectorAll('.app__output')[0];

/** @type {Array} */
let equationsCollected = [];

/**
 * @event
 * This function splits the input based on newline and evaluates
 */
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
	output.forEach(value => {
		const result = document.createElement('p');
		result.innerText += value;
		outputContainer.append(result);
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
	}

	document.onreadystatechange = () => {
		if (document.readyState === 'complete') {
			init();
			const userTheme =
				window.localStorage.userTheme ||
				window.localStorage.osTheme ||
				'light';
			if (userTheme === 'auto') {
				document.documentElement.setAttribute(
					'data-theme',
					window.localStorage.osTheme || 'light'
				);
			} else {
				document.documentElement.setAttribute('data-theme', userTheme);
			}

			document.querySelector('#theme-switcher').value = userTheme;
		}
	};
})();
