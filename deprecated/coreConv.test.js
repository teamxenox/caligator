const assert = require('assert');

const coreConv = require('./coreConv');

const weightConvTestCases = [
	[0, 'g', 'g', 0],
	[0, 'g', 'kg', 0],
	[1, 'g', 'g', 1],
	[1000, 'g', 'kg', 1],
	[100, 'g', 'hg', 1],
	[10, 'g', 'dag', 1],
	[1, 'g', 'dg', 10],
	[1, 'g', 'cg', 100],
	[1, 'g', 'mg', 1000],
	[1, 'g', 'gr', 15.43236],
	[1, 'kg', 'mg', 1000000],
	[10.567, 'st', 'oz', 2367.008536828536]
];

const lengthConvTestCases = [
	[1, 'mi', 'm', 1609.3439798947877],
	[1, 'km', 'm', 1000],
	[1, 'hm', 'm', 100],
	[1, 'm', 'm', 1],
	[0, 'm', 'm', 0],
	[1, 'm', 'yd', 1.093613],
	[1, 'm', 'ft', 3.28084],
	[1, 'm', 'dm', 10],
	[1, 'm', 'in', 39.37008],
	[1, 'm', 'cm', 100],
	[1, 'm', 'mm', 1000],
	[1, 'm', 'nm', 1000000000]
];

describe('convert weight', () => {
	it('should correctly convert', () => {
		weightConvTestCases.forEach(testCase => {
			assert.equal(
				coreConv.convert('w', testCase[0], testCase[1], testCase[2]),
				testCase[3]
			);
		});
	});

	it('should correctly convert in reverse', () => {
		weightConvTestCases.forEach(testCase => {
			assert.equal(
				coreConv.convert('w', testCase[3], testCase[2], testCase[1]),
				testCase[0]
			);
		});
	});
});

describe('convert length', () => {
	it('should correctly convert', () => {
		lengthConvTestCases.forEach(testCase => {
			assert.equal(
				coreConv.convert('l', testCase[0], testCase[1], testCase[2]),
				testCase[3]
			);
		});
	});

	it('should correctly convert in reverse', () => {
		lengthConvTestCases.forEach(testCase => {
			assert.equal(
				coreConv.convert('l', testCase[3], testCase[2], testCase[1]),
				testCase[0]
			);
		});
	});
});
