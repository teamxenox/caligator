'use strict';

const coreCalc = require('./coreCalc');
const coreConv = require('./coreConv');

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
const lengthUnits = Object.keys(coreConv.lengthUnits).join('|');

/** @const {string} */
const weightUnits = Object.keys(coreConv.weightUnits).join('|');

/** @const {string} */
const temperatureUnits = coreConv.temperatureUnits.join('|');

/** @const {string} */
const currencyUnits = Object.keys(coreConv.currencyUnits).join('|');

/**
 * This function generates a RegExp for the given units
 * @example generate(km|cm|in)
 * @param {string} units
 * @private
 */
const generateRegExpForUnits = units => new RegExp(`^(\\d+(\\.\\d*)?\\s*)(${units})\\s*(to|TO)\\s*(${units})\\s*$`, 'm');

/** @const {object} */
const lengthRegExp = generateRegExpForUnits(lengthUnits);

/** @const {object} */
const weightRegExp = generateRegExpForUnits(weightUnits);

/** @const {object} */
const temperatureRegExp = generateRegExpForUnits(temperatureUnits);

/** @const {object} */
const currencyRegExp = generateRegExpForUnits(currencyUnits);

/** @const {object} */
const commentRegExp = new RegExp(/^(\s*)#+(.*)/, 'm')

/** @const {object} */
const percentageRegExp = new RegExp(/(\d+)\s*(%\s*of)\s*(\d+)/, 'm')
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
const parseInput = (inp, type, unit) => {
    inp = inp.split(type).filter(filterValues);
    let result = coreConv.convert(unit, ...inp);
    return result
}

/**
 * This is main function which parses and sends the values to the core modules
 * @param {string} exp - provides user input, that can be an equation or conversion. But not both, yet.
 * @returns {number}
 */
const main = exp => {
    exp = exp.toLowerCase();

    if (commentRegExp.test(exp)) return "";

    if (lengthRegExp.test(exp)) {
        return parseInput(exp, lengthRegExp, 'l');
    } else if (weightRegExp.test(exp)) {
        return parseInput(exp, weightRegExp, 'w');
    } else if (temperatureRegExp.test(exp)) {
        return parseInput(exp, temperatureRegExp, 't');
    } else if (currencyRegExp.test(exp.toUpperCase())) {
        return parseInput(exp.toUpperCase(), currencyRegExp, 'c');
    } else {
        Object.keys(textForOperators).forEach(each => {
            exp = exp.replace(each, textForOperators[each])
        })
        return coreCalc.evalExp(exp)
    }
}

module.exports = main;
