const assert = require('assert');
const { describe, it } = require('mocha');

const main = require('./main');

describe('evaluate', () => {
	it('should correctly evaluate a comment', () => {
		assert.strictEqual(main.evaluate('#500g to kg'), '');
	});

	it('should correctly evaluate weight conversion', () => {
		assert.strictEqual(main.evaluate('500g to kg'), '0.5 kg');
	});

	it('should correctly evaluate length conversion', () => {
		assert.strictEqual(main.evaluate('500cm to m'), '0.5 m');
	});

	it('should correctly evaluate temperature conversion', () => {
		assert.strictEqual(main.evaluate('100c to f'), '212');
	});

	it('should correctly evaluate currency conversion', () => {
		assert.strictEqual(main.evaluate('1 usd to eur'), '0.91');
	});

	it('should correctly evaluate a percentage', () => {
		assert.strictEqual(main.evaluate('30% of 1'), '0.3');
	});

	it('should correctly evaluate a ratio', () => {
		assert.strictEqual(main.evaluate('1/2 of 3'), '1.5');
	});

	it('returns empty string when the expression cannot be parsed', () => {
		assert.strictEqual(main.evaluate('unparsable'), 'sadf');
	});
});
