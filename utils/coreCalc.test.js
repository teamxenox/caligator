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

const evalExpTestCases = [
    ['3 + 4 - 20', -13],
    ['7 - 3', 4],
    ['2 * 5 + 3', 13],
    ['6 * (3 + 4)', 42],
    ['33/2', 16.5],
    ['33%2', 1],
    ['(((5+4) - (3*2)) / 3)', 1],
    ['2**4', 16],
    ['11 + 5 - ( 20 - 10 ) * 53 / 2', -249],
    ['(2 + 1) ** 3 - 20 + 3', 10],
    ['(11 * 11) - 11 * 11 + 2 ** 3', 8]
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

describe("Evaluate Expression", () => {
    evalExpTestCases.forEach((testCase) => {
        it(`${testCase[0]} = ${testCase[1]}`, () => {
            assert.equal(coreCalc.evalExp(testCase[0]), testCase[1]);
        });
    });
});