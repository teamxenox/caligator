"use strict";

const main = require('../utils/main');

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
