'use strict';

const main = require('../utils/main');
const { remote } = require('electron');

// by default OS theme
// user theme has high precedence
// os theme and user theme applied then USer theme
// user theme and OS theme applied then User theme
if (process.platform == 'darwin') {
    const { systemPreferences } = remote;

    const defaultTheme = () => {
        if (
            window.localStorage.user_theme === undefined ||
            window.localStorage.user_theme === 'auto'
        ) {
            window.localStorage.os_theme = systemPreferences.isDarkMode()
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
let inputContainer = document.getElementsByClassName('app__input')[0];

/** @type {Object} */
let outputContainer = document.getElementsByClassName('app__output')[0];

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
    let output = arr.map(each => main(each));
    outputContainer.innerText = '';
    output.forEach(value => {
        let result = document.createElement('p');
        result.innerText += value;
        outputContainer.appendChild(result);
    });
}

// Controls

/** @const {Object} */
const appPopup = document.getElementsByClassName('modal')[0];

/**
 * This function adds the window controls to the application
 * @private
 */
(function () {
    const { BrowserWindow } = require('electron').remote;

    function init() {
        document
            .getElementById('app--minimize')
            .addEventListener('click', () => {
                let window = BrowserWindow.getFocusedWindow();
                window.minimize();
            });

        document.getElementById('app--close').addEventListener('click', () => {
            let window = BrowserWindow.getFocusedWindow();
            window.close();
        });

        document
            .getElementById('app--settings')
            .addEventListener('click', () => {
                appPopup.style.display = 'block';
            });

        document
            .getElementById('modal__popup--close')
            .addEventListener('click', () => {
                appPopup.style.display = 'none';
            });

        document
            .getElementById('theme-switcher')
            .addEventListener('change', e => {
                let userTheme = e.target.value;
                if (userTheme == 'auto') {
                    document.documentElement.setAttribute(
                        'data-theme',
                        window.localStorage.os_theme || 'light'
                    );
                } else {
                    document.documentElement.setAttribute(
                        'data-theme',
                        userTheme
                    );
                }
                window.localStorage.user_theme = userTheme;
            });
    }

    document.onreadystatechange = () => {
        if (document.readyState == 'complete') {
            init();
            let userTheme =
                window.localStorage.user_theme ||
                window.localStorage.os_theme ||
                'light';
            if (userTheme == 'auto') {
                document.documentElement.setAttribute(
                    'data-theme',
                    window.localStorage.os_theme || 'light'
                );
            } else {
                document.documentElement.setAttribute('data-theme', userTheme);
            }
            document.getElementById('theme-switcher').value = userTheme;
        }
    };
})();
