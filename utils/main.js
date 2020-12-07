'use strict';

const mathJs = require('mathjs');
const coreConv = require('./coreConv');
const { string, exp } = require('mathjs');

/** @const {Object} */
const textForOperators = {
	plus: '+',
	'added to': '+',
	adds: '+',
	with: '+',
	minus: '-',
	subtract: '-',
	less: '-',
	'divided by': '/',
	by: '/',
	'multiplied by': '*',
	into: '*',
	cross: '*'
};


//Variables in calculations
let known_variables = {}

const containsOnlyLetters = str => {return /^[a-zA-Z]+$/.test(str)};

const findVariablesInExp = str => {
	//finds the longest words, sliding window mechanism. If a symbol is not letter it moves to the next one
	//if it is a letter it starts reading the following letters
	//and reads until it stops containing words only
	
	if (str.length == 0){
		return []
	}
	let variables = []
	let current_name = ""
	let start_i = 0
	let end_i = 1
	while (end_i < str.length - 1){
		
		if (containsOnlyLetters(str.slice(start_i, end_i+1))){
			end_i++;
		} else {
			if (end_i - 1 > start_i){
				variables.push(str.slice(start_i, end_i).trim())
			}
			start_i = end_i;
			end_i++;
		}
	}
	if (containsOnlyLetters(str.slice(start_i))){
		variables.push(str.slice(start_i).trim())
	}
	return variables
}

const replaceVariablesInExp = exp => {
	let variables = findVariablesInExp(exp);
	let mod_exp = exp; //Modified expression
	for (let i = 0; i < variables.length; i++){
		let variable = variables[i]
		let loc = mod_exp.indexOf(variable)
		let value = known_variables[variable]
		if (value){
			mod_exp = mod_exp.slice(0, loc) + value + mod_exp.slice(loc + variable.length)
		}
		
	}
	return mod_exp
}


//Creates new entries in known_variables and changes exp only to it's value so that it is displayed as result
//Example: "radius = 5*2+6" becomes "5*2+6" and known_values["radius"] = evaluate("5*2+6")
//Note, also applies replaceVariablesInExp 
const handlePossibleDeclarations = exp => {
	let loc = exp.indexOf("=")
	let variable = exp.slice(0, loc).replace(/\s+/g, '')
	exp = exp.slice(loc+1)
	exp = replaceVariablesInExp(exp);
	let result = evaluate(exp)
	known_variables[variable] = result
	return exp
}
/** @const {string} */
const currencyUnits = Object.keys(coreConv.currencyUnits).join('|');

/** @const {object} */
const commentRegExp = new RegExp(/^(\s*)#+(.*)/, 'm');

/**
 * This function generates a RegExp for the given units
 * @example generate(km|cm|in)
 * @param {string} units - list of the conversion units
 * @private
 * @returns {object}
 */
const generateRegExpForUnits = units =>
	new RegExp(
		`^(\\d+\\.?\\d*?\\s*)(${units})\\s*(to|TO)\\s*(${units})\\s*$`,
		'm'
	);

/** @const {object} */
const currencyRegExp = generateRegExpForUnits(currencyUnits);

/**
 * This function filters the given value with
 * filter conditions :  null, undefined, empty or to
 * return false if it meets any of the above conditions
 * @param {*} v - value which is filtered for null, undefined, empty or to.
 * @returns {boolean} - result after filtering
 * @private
 * @returns {object}
 */
const filterValues = v =>
	v !== null && v !== undefined && v !== '' && v !== 'to' && v !== 'TO';

/**
 * This function parses the given expression with the provided regExp and passes the values to the core modules
 * @param {string} inp - each
 * @param {object} type - regExp type
 * @param {string} unit - conversion for 'l', 'c', 'w', 't', 'r', 'p' for length, currency and weight. check coreConv.convert(mode)
 * @returns {number}
 */
const parseExp = (inp, type, unit) => {
	inp = inp.split(type).filter(filterValues);
	const result = coreConv.convert(unit, ...inp);
	return result;
};

/**
 * This is main function which parses and sends the values to the core modules
 * @param {string} exp - provides user input, that can be an equation or conversion. But not both, yet.
 * @returns {number}
 */

// TODO: refactor
const evaluate = exp => {
	exp = exp.trim();

	// Ignores if starts with #
	if (commentRegExp.test(exp)) return '';

	// Replaces the text alternatives for operators
	Object.keys(textForOperators).forEach(operator => {
		const operatorRegExp = new RegExp(`\\d+\s*${operator}\\s*`, 'm');
		exp = exp.replace(operatorRegExp, textForOperators[operator]);
	});

	if (currencyRegExp.test(exp.toUpperCase())) {
		return parseExp(exp.toUpperCase(), currencyRegExp, 'c');
	}

	return mathJs.evaluate(exp);
};

const main = exp => {
	if (exp.includes("=")){
		exp = handlePossibleDeclarations(exp); //Also applies replaceVariablesInExp
	} else {
		exp = replaceVariablesInExp(exp);
	}
	try {
		return evaluate(exp)
			? typeof evaluate(exp) !== 'function' // To filter function printing
				? evaluate(exp)
				: ''
			: '';
	} catch (error) {
		return '';
	}
};

module.exports = main;
