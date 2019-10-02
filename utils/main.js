'use strict';

const coreConv = require('./coreConv');
const mathJs = require('mathjs');

/** @const {Object} */
const textForOperators = {
    'plus': '+',
    'added to': '+',
    'adds': '+',
    'with': '+',
    'minus': '-',
    'subtract': '-',
    'less': '-',
    'divided by': '/',
    'by': '/',
    'multiplied by': '*',
    'into': '*',
    'cross': '*'
};

/** @const {string} */
const currencyUnits = Object.keys(coreConv.currencyUnits).join('|');

/** @const {object} */
const commentRegExp = new RegExp(/^(\s*)#+(.*)/, 'm')


/**
 * This function generates a RegExp for the given units
 * @example generate(km|cm|in)
 * @param {string} units
 * @private
 */
const generateRegExpForUnits = units => new RegExp(`^(\\d+\\.?\\d*?\\s*)(${units})\\s*(to|TO)\\s*(${units})\\s*$`, 'm');

/** @const {object} */
const currencyRegExp = generateRegExpForUnits(currencyUnits);

/**
 * This function filters the given value with
 * filter conditions :  null, undefined, empty or to
 * returns false if it meets any of the above conditions
 * @param {*} v - value which is filtered for null, undefined, empty or to.
 * @returns {boolean} - result after filtering
 * @private
 */
const filterValues = v => (v !== null && v !== undefined && v !== '' && v !== 'to' && v !== 'TO');

/**
 * This function parses the given expression with the provided regExp and passes the values to the core modules
 * @param {string} inp
 * @param {object} type
 * @param {string} unit
 * @returns {number}
 */
const parseExp = (inp, type, unit) => {
    inp = inp.split(type).filter(filterValues);
    let result = coreConv.convert(unit, ...inp);
    return result
}

/**
 * This is main function which parses and sends the values to the core modules
 * @param {string} exp - provides user input, that can be an equation or conversion. But not both, yet.
 * @returns {number}
 */

// TODO: refactor
const evaluate = exp => {
    exp = exp.trim();

    // Ignores if starts with #
    if (commentRegExp.test(exp)) return "";

    // Replaces the text alternatives for operators
    Object.keys(textForOperators).forEach(operator => {
        let operatorRegExp = new RegExp(`\\d+\s*${operator}\\s*`, 'm')
        exp = exp.replace(operatorRegExp, textForOperators[operator])
    })

    if (currencyRegExp.test(exp.toUpperCase())) {
        return parseExp(exp.toUpperCase(), currencyRegExp, 'c');
    } else {
        return mathJs.evaluate(exp)
    }
}

const main = exp => {
    try {
        return evaluate(exp) ?
            (typeof (evaluate(exp)) !== "function" ? // to filter function printing
                evaluate(exp) : ""
            ) : ""
    } catch (err) {
        return ""
    }
}

module.exports = main;
