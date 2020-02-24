'use strict';

const mathJs = require('mathjs');
const operatorsAsText = require('../constants/operators-as-text');
const replaceAll = require('../utils/replace-all');

/** @const {object} */
const commentRegExp = new RegExp(/^(\s*)#+(.*)/, 'm');

/**
 * This is main function which parses and sends the values to the core modules
 * @param {string} exp - provides user input, that can be an equation or conversion. But not both, yet.
 * @returns {number}
 */
const evaluate = exp => {
	if (exp) {
		exp = exp.trim();

		// 1. Check for comments
		if (commentRegExp.test(exp)) return '';

		// 2. Replace the text alternatives for arithmetic  operators
		Object.keys(operatorsAsText).forEach(operator => {
			if (exp.includes(operator)) {
				exp = replaceAll(exp, operator, operatorsAsText[operator]);
			}
		});

		return mathJs.evaluate(exp);
	}

	return '';
};

const main = exp => {
	try {
		if (typeof evaluate(exp) !== 'function') {
			return evaluate(exp);
		}

		return '';
	} catch (error) {
		return '';
	}
};

module.exports = main;
