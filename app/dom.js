// Contains the DOM manipulations other than the calculator part

const { remote } = require('electron');

/** #1
 * THEME CHOOSER
 * By default OS theme
 * user theme has high precedence
 * OS theme and user theme applied then user theme
 * user theme and OS theme applied then user theme
 **/
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

/** #2
 * This function adds the window controls to the application
 * @private
 */

/** @const {Object} */
const appPopup = document.querySelectorAll('.modal')[0];
const appInput = document.querySelectorAll('.app__input')[0];
const appOutput = document.querySelectorAll('.app__output')[0];

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

		document.querySelector('#app--reset').addEventListener('click', () => {
			appInput.value = '';
			appOutput.innerHTML = '';
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

/** #3
 * Handling Resizable columns
 * @returns inputDom
 */
const getResizeableElement = () => {
	return document.querySelector('.app__input');
};

const getSecondResizeableElement = () => {
	return document.querySelector('.app__output');
};

const getHandleElement = () => {
	return document.querySelector('#handle');
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
	const secondWidth =
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
	// Const host = getResizeableElement();
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

		const paneOriginAdjustment = -1;
		setPaneWidth(
			(xOffset - moveEvent.pageX) * paneOriginAdjustment +
				startingPaneWidth
		);
	};

	document.body.addEventListener('pointermove', mouseDragHandler);
};

getHandleElement().addEventListener('mousedown', startDragging);
