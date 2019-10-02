'use strict';

const coreCalc = require('./coreCalc');
const coreConv = require('./coreConv');
const mathJs = require('mathjs');

var prefix = '';


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

/** @const {object} */
const commentRegExp = new RegExp(/^(\s*)#+(.*)/, 'm')

/**
 * This function parses the given expression with the provided regExp and passes the values to the core modules
 * @param {string} inp
 * @param {object} type
 * @param {string} unit
 * @returns {number}
 */
const parseInput = (inp, type, unit) => {
    inp = inp.split(type).filter(filterValues);
    prefix = inp[2];
    let result = coreConv.convert(unit, ...inp);
    return result
}


/**
 * This is main function which parses and sends the values to the core modules
 * @param {string} exp - provides user input, that can be an equation or conversion. But not both, yet.
 * @returns {number}
 */

// TODO: refactor
const main = exp => {
    exp = exp.toLowerCase();
    exp = exp.trim();

    // Ignores if starts with #
    if (commentRegExp.test(exp)) return "";

    // Replaces the text alternatives for operators
    Object.keys(textForOperators).forEach(operator => {
        let operatorRegExp =  new RegExp(`\\d+\s*${operator}\\s*`,'m')
        exp = exp.replace(operatorRegExp, textForOperators[operator])
    })

    try {
        return mathJs.eval(exp) || ""
    } catch (err) {
        return ""
    }

}


module.exports = main;
