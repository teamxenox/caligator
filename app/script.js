"use strict";

const main = require('../utils/main');

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
inputContainer.addEventListener('keyup', (e) => {
    equationsCollected = e.target.value.split("\n");
    evaluate(equationsCollected);
})

/**
 * This function passes the data and updates the result on the markup
 * @param {Array} arr - gets the expression by line as an array
 * @private
 */

// FIXME : Output position for multiline input
function evaluate(arr) {
    var output = arr.map((each) => main(each));
    outputContainer.innerText = output.join("\n");
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
        document.getElementById("app--minimize").addEventListener("click", function (e) {
            var window = BrowserWindow.getFocusedWindow();
            window.minimize();
        });

        document.getElementById("app--close").addEventListener("click", function (e) {
            var window = BrowserWindow.getFocusedWindow();
            window.close();
        });

        document.getElementById('app--settings').addEventListener('click', () => {
            appPopup.style.display = 'block'
        })

        document.getElementById('modal__popup--close').addEventListener('click', () => {
            appPopup.style.display = 'none'
        })

        document.getElementById('color-switcher').addEventListener('click', () => {
            document.getElementsByTagName('body')[0].classList.toggle('dark')
        })
    };

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            init();
        }
    };

})();
