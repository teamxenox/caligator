const chai = require("chai");
const assert = require("assert");

const coreCalc = require("./coreCalc");

const hasPrecedenceTestCases = [
    ['+', '+', true], 
    ['+', '-', true],
    ['-', '+', true],
    ['-', '-', true],
    ['*', '*', true],
    ['*', '/', true],
    ['/', '/', true],
    ['*', '+', false],
    ['/', '+', false],  
    ['*', '-', false],  
    ['/', '-', false],  
];

describe("hasPrecedence", () => {
    hasPrecedenceTestCases.forEach((testCase) => {
        it(`The operator ${testCase[1]} has higher/equal precedence than ${testCase[0]} -> ${testCase[2]}`, () => {
            assert.equal(coreCalc.hasPrecedence(testCase[0], testCase[1]), testCase[2]);
        })
    });
});