'use strict';

// The supported weight units
/*
 * The property is the abbreviation of supported units.
 * The value needed to convert to or from gram.
 * Unit's abbreviations could be found in https://www.weightconversions.org/abbreviations.htm
 */
const weightUnits = {
	mg: 1000,
	cg: 100,
	gr: 15.43236,
	dg: 10,
	g: 1,
	dr: 0.5643834,
	dag: 0.1,
	oz: 0.03527396,
	hg: 0.01,
	lb: 0.002204623,
	kg: 0.001,
	st: 0.000157473,
	ton: 0.000001102311
};

// The supported length units
/*
 * The property is the abbreviation of supported units.
 * The value needed to convert to or from meter.
 */
const lengthUnits = {
	nm: 1000000000,
	mm: 1000,
	cm: 100,
	in: 39.37008,
	dm: 10,
	ft: 3.28084,
	yd: 1.093613,
	m: 1,
	hm: 0.01,
	km: 0.001,
	mi: 0.0006213712
};

/**
 * This is a function to perform conversion
 * @param {String} mode - Type of conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convert = (mode, value, oldUnit, newUnit) => {
	switch (mode) {
		case 'w':
			return convertWeight(value, oldUnit, newUnit);
		case 'l':
			return convertLength(value, oldUnit, newUnit);
	}
};

/**
 * This is a function to perform weight conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertWeight = (value, oldUnit, newUnit) => {
	if (oldUnit === newUnit) return value;
	return (value / weightUnits[oldUnit]) * weightUnits[newUnit];
};

/**
 * This is a function to perform length conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertLength = (value, oldUnit, newUnit) => {
	if (oldUnit === newUnit) return value;
	return (value / lengthUnits[oldUnit]) * lengthUnits[newUnit];
};

module.exports = {
	convert
};
