const assert = require("assert");

const coreCalc = require("./coreCalc");

const operateTestCases = [
    ['+', 5, 4, 9],
    ['-', 13, 22, 9],
    ['*', 2, 4, 8],
    ['/', 7, 14, 2],
    ['%', 2, 5, 1]
];

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

describe("operate", () => {
    operateTestCases.forEach((testCase) => {
        it(`${testCase[2]} ${testCase[0]} ${testCase[1]} = ${testCase[3]}`, () => {
            assert.equal(coreCalc.operate(testCase[0], testCase[1], testCase[2]), testCase[3]);
        });
    });
});

describe("hasPrecedence", () => {
    hasPrecedenceTestCases.forEach((testCase) => {
        it(`The operator ${testCase[1]} has higher/equal precedence than ${testCase[0]} -> ${testCase[2]}`, () => {
            assert.equal(coreCalc.hasPrecedence(testCase[0], testCase[1]), testCase[2]);
        })
    });
});