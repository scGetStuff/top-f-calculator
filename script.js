"use strict"

console.clear();

document.addEventListener('keydown', keyHandler);
const buttons = [...document.getElementsByTagName('button')];
buttons.forEach(button => button.addEventListener('click', clickHandler));

const displayExpression = document.getElementById('expression');
const displayOperand = document.getElementById('operand');

const numberKeyValues = buildArrayOfValues('.btn-number');
const operationKeyValues = buildArrayOfValues('.btn-operator');
const actionKeyValues = buildArrayOfValues('.btn-action');
// add alternate keyboard keys that functions same as action buttons
actionKeyValues.push('=');
actionKeyValues.push('delete');

function buildArrayOfValues(cssClass = '') {
    const list = [...document.querySelectorAll(cssClass)];
    return list.map(element => element.value);
}

// expression data
// TODO: need to wrap this stuff up in an expression object
// haven't done class in js yet
// make the operator functions methods?
let operand1 = null;
let operand2 = null;
let operatorValue = null;
const operandDigitBuffer = [];
let signMultiplier = 1;
// i need to know if i am in a new expression or building off of a result
// origional behavior was appending numbers to the result, 
// i want it to overwrite like the windows calculator does
let isResult = false;


function keyHandler(e) {
    // e.shiftKey is allowed so user can use keys that are not on the numeric pad
    if (e.altKey || e.ctrlKey || e.metaKey || e.repeat)
        return;
    const key = e.key.toLowerCase();  // Backspace, Escape, potentialy others
    doStuffWithKey(key);
}

function clickHandler(e) {
    doStuffWithKey(this.value);
}


function doStuffWithKey(key) {

    if (numberKeyValues.includes(key)) {
        appendOperand(key);
        return;
    }

    if (operationKeyValues.includes(key)) {
        setOperator(key);
        return;
    }

    if (actionKeyValues.includes(key)) {
        doAction(key);
        return;
    }
}

function appendOperand(key) {

    if (key === 'negate') {
        negate();
        writeBufferToDisplay()
        return;
    }

    if (isResult)
        clearExpression();

    if (shouldAppend(key)) {
        operandDigitBuffer.push(key);
        writeBufferToDisplay()
    }
}

function writeBufferToDisplay() {
    const digits = operandDigitBuffer.join('');
    updateDisplayOperand(digits);
    updateDisplayExpression(buildOperatorExpression(digits));
}

// some special cases for 0 and decimal that were poluting appendOperand()
function shouldAppend(key) {
    // limit leading 0's to 1
    if (key === '0' && operandDigitBuffer.length === 1 && operandDigitBuffer[0] === '0')
        return false;

    if (key === '.') {
        // user starts with '.'; '0' is in the display but not the buffer, so add it
        if (operandDigitBuffer.length === 0)
            operandDigitBuffer.push('0');
        // decimal can only occur once
        if (operandDigitBuffer.includes('.'))
            return false;
    }

    return true;
}

function setOperator(operator) {

    // user enters 2 + 3 + 4; evaluate 2 + 3 first
    if (isRunable())
        operate();

    operatorValue = operator;

    // user is repeatedly pounding on operator buttons before entering second operand
    if (operand1 !== null && operandDigitBuffer.length === 0) {
        updateDisplayExpression(buildOperatorExpression());
        return;
    }

    operand1 = getOperandFromBuffer();
    updateDisplayOperand(operand1);
    updateDisplayExpression(buildOperatorExpression());
    isResult = false;
}

function isRunable() {
    return (operand1 != null && operatorValue != null && operandDigitBuffer.length > 0);
}

function isSecondOperand() {
    return (operand1 != null);
}

function doAction(key) {

    if (['=', 'enter'].includes(key)) {
        operate();
        return;
    }

    if (['delete', 'backspace'].includes(key)) {
        back();
        return;
    }

    if (key === 'escape') {
        clearExpression();
        updateDisplayOperand('0');
        updateDisplayExpression('0');
        return;
    }
}

const operationFunction = {
    '+': add,
    '-': sub,
    '*': mult,
    '/': divide
};

function operate() {

    if (!isRunable())
        return;

    operand2 = getOperandFromBuffer();
    let result = operationFunction[operatorValue]();
    if (!isValidResult(result))
        return;

    // round answers with long decimals so that they don’t overflow the screen 
    if (!Number.isInteger(result))
        result = Number.parseFloat(result.toFixed(4));

    updateDisplayOperand(result);
    updateDisplayExpression(buildFullExpression(result));
    clearExpression();

    // reset buffer with result for use by next operation
    const chars = result.toString().split('');
    chars.forEach(char => operandDigitBuffer.push(char));
    isResult = true;
}

function isValidResult(num) {

    const isValid = isValidNumber(num);

    if (!isValid) {
        // display the equation that produced the alert, 
        // but reset the data to 0 to avoid errors
        updateDisplayOperand('0');
        updateDisplayExpression(buildFullExpression(num));
        clearExpression();
        alert(`Bad stuff happened: ${num}`);
    }

    return isValid;
}

// isFinite() filters out all except null and blank string
function isValidNumber(num) {
    return (isFinite(num) && num != null && num !== '');
}

function back() {

    operandDigitBuffer.pop();

    // do not allow empty display
    if (operandDigitBuffer.length === 0) {
        updateDisplayOperand('0');
        // don't want the 0 in the expresion, they must enter something to move foward
        updateDisplayExpression(buildOperatorExpression());
        return;
    }

    writeBufferToDisplay();
}

// data only, UI is seperate
function clearExpression() {
    operand1 = null;
    operand2 = null;
    signMultiplier = 1;
    operatorValue = null;
    operandDigitBuffer.splice(0, operandDigitBuffer.length);
    isResult = false;
}

function getOperandFromBuffer() {

    // display defaults to 0, handle empty buffer
    if (operandDigitBuffer.length === 0)
        operandDigitBuffer.push('0');

    // TODO: do I want to check NaN here?
    let num = Number.parseFloat(operandDigitBuffer.join(''));
    
    num *= signMultiplier;
    signMultiplier = 1;

    // reset buffer for use in the next operand
    operandDigitBuffer.splice(0, operandDigitBuffer.length);

    return num;
}

// the operand buffer will not have the '-' char in it, but operand variable will be negative
function negate() {
    signMultiplier *= -1;
}

function updateDisplayOperand(n = '') {
    displayOperand.innerText = decorateNegate(n);
}

function updateDisplayExpression(s = '') {
    displayExpression.innerText = s;
}

function buildFullExpression(result) {
    return `${operand1} ${operatorValue} ${operand2} = ${result}`;
}

function buildOperatorExpression(n = '') {
    // this check was needed in a few places, got messy
    // put it here to avoid duplication
    if (isSecondOperand())
        return `${operand1} ${operatorValue} ${decorateNegate(n)}`;
    else
        return n;
}

function decorateNegate(s = '') {
    if (isValidNumber(s)){
        const num = Number.parseFloat(s);
        s = `${signMultiplier * num}`;
    }
    return s;
}


function add() {
    return operand1 + operand2;
}

function sub() {
    return operand1 - operand2;
}

function mult() {
    return operand1 * operand2;
}

function divide() {
    return operand1 / operand2;
}
