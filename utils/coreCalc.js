"use strict";

// set the operators to be used 
const operators = ['+', '-', '*', '/', '%', '(', ')', '**', '|', '&', '^'];
const precedence = {
    '|': 0,
    '^': 1,
    '&': 2,
    '+': 3,
    '-': 3,
    '*': 4,
    '/': 4,
    '%': 4,
    '**': 5 
};

const evalExp = (expression) => {
    let tokens = [];

    // remove the spaces from the expressions
    let exp = expression.replace(/\s/g, '');

    // extract the tokens from the expression
    // the token can be operators such as +, -, * , / 
    // tokens can also be numbers such as 5, 34, 21, etc


    tokens = getTokens(exp);

    // maintain the values and operator stack
    let values = [];
    let ops = [];

    tokens.forEach(token => {
        if(!operators.includes(token)) {
            values.push(parseInt(token));
        }else if(token === '(') {
            ops.push(token);
        }else if(token === ')') {
            // loop while the operator is not opening brace
            while(ops[ops.length - 1] != '(') {
                values.push(operate(ops.pop(), values.pop(), values.pop()));
            }
            ops.pop();
        } else if(operators.includes(token)) {
            while(ops.length !== 0 && hasPrecedence(token, ops[ops.length - 1])) {
                values.push(operate(ops.pop(), values.pop(), values.pop()));
            }
            ops.push(token);
        }
    });

    // operate the remaining operands in the stack
    while(ops.length !== 0) {
        values.push(operate(ops.pop(), values.pop(), values.pop()));
    }

    return values.pop();
};

const getTokens = exp => {
    let tokens = [];
    let operand = "";

    for(let i = 0; i < exp.length; i++) {
        if(exp[i] === '*' && exp[i+1] === '*'){
            if(operand !== '') 
                tokens.push(operand);
            operand = '';
            tokens.push('**');
        } else if(exp[i] === '*' && exp[i-1] === '*') {
            continue;
        } else {
            if(!operators.includes(exp[i])) {
                operand += exp[i];
            }else {
                if(operand !== '') 
                    tokens.push(operand);
                tokens.push(exp[i]);
                operand = "";
            }
        }
    }
    tokens.push(operand);

    // filter out any junk/spaces
    tokens = tokens.filter(token => token !== '');
    return tokens;
};

const operate = (operator, operand1, operand2) => {
    switch(operator) {
        case '+':
            return operand1 + operand2;
        case '-':
            return operand2 - operand1;
        case '*':
            return operand2 * operand1;
        case '%':
            if(operand1 === 0) throw "Divide by Zero Exception Occurred !!";
            return operand2 % operand1;
        case '/':
            if(operand1 === 0) throw "Divide by Zero Exception Occurred !!"; 
            return operand2 / operand1;
        case '**':
            return Math.pow(operand2, operand1);
        case '&':
            return operand2 & operand1;
        case '|':
            return operand1 | operand2;
        case '^':
            return operand1 ^ operand2;
    }
};

const hasPrecedence = (op1, op2) => {
    if(op2 === '(' || op2 === ')') return false;

    if(precedence[op2] >= precedence[op1]) {
        return true;
    }else {
        return false;
    }
};

module.exports = {
    evalExp,
    hasPrecedence,
    operate,
    getTokens
};