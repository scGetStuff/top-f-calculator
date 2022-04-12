"use strict"

console.clear();

// event binding
document.addEventListener('keydown', keyHandler);
const buttons = [...document.getElementsByTagName('button')];
buttons.forEach(button => button.addEventListener('click', clickHandler));
const displayExpression = document.getElementById('expression');
const displayOperand = document.getElementById('operand');

// lists of button values
let list = [...document.querySelectorAll('.btn-number')];
const numBtnValues = list.map(element => element.value);
list = [...document.querySelectorAll('.btn-operator')];
const opBtnValues = list.map(element => element.value);
list = [...document.querySelectorAll('.btn-action')];
const actValues = list.map(element => element.value);
list = undefined;
// add alternate keyboard keys that functions same as action buttons
actValues.push('=');
actValues.push('delete');

// expression data
// TODO: need to wrap this stuff up in an expression object
// haven't done class in js yet
// make the operator functions methods?
let operand1 = null;
let operand2 = null;
let operatorValue = null;
let signMultiplier = 1;
// using array as a buffer for the didgits entered
const operandDigitBuffer = [];
// i need to know if i am in a new expression or building off of a result
// typing after a calculation was appending numbers to the result
// i want them to overwrite like windows calculator does
let isResult = false;


function keyHandler(e) {
    // allow shift for using keys that are not on the numeric pad
    if (e.altKey || e.ctrlKey || e.metaKey || e.repeat)
        return;
    const key = e.key.toLowerCase();  // Backspace, Escape, potentialy others
    doStuffWithKey(key);
}

function clickHandler(e) {
    doStuffWithKey(this.value);
}


function doStuffWithKey(key) {

    if (numBtnValues.includes(key)) {
        appendOperand(key);
        return;
    }

    if (opBtnValues.includes(key)) {
        setOperator(key);
        return;
    }

    if (actValues.includes(key)) {
        doAction(key);
        return;
    }
}

function appendOperand(key) {

    if (key === 'negate') {
        negate();
        alert('No negate yet');
        return;
    }

    if (isResult)
        clearExpression();

    if (shouldAppend(key)) {
        operandDigitBuffer.push(key);
        updateDisplayDivs(operandDigitBuffer.join(''));
    }
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

    // user enters 2 + 3 + 4
    if (isRunable())
        operate();

    operatorValue = operator;

    // user is repeatedly pounding on operator buttons before entering second operand
    if (operand1 != null && operandDigitBuffer.length === 0) {
        updateDisplayOperator();
        return;
    }

    operand1 = getOperandFromBuffer();
    updateDisplayDivs(operand1);
    isResult = false;
}

function isRunable() {
    return (operand1 != null && operatorValue != null && operandDigitBuffer.length > 0);
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
        updateDisplayDivs();
        return;
    }
}

const mapOfStuffThatWouldHaveBeenStupidLookingBranching = {
    '+': add,
    '-': sub,
    '*': mult,
    '/': divide
};

function operate() {

    if (!isRunable())
        return;

    operand2 = getOperandFromBuffer();
    let result = mapOfStuffThatWouldHaveBeenStupidLookingBranching[operatorValue]();
    if (!isValidResult(result))
        return;

    // round answers with long decimals so that they don’t overflow the screen 
    if (!Number.isInteger(result))
        result = Number.parseFloat(result.toFixed(4));
    updateDisplayDivs(result);
    updateDisplayExpression(buildFullExpression(result));

    clearExpression();

    // reset buffer with result for use by next operation
    const chars = result.toString().split('');
    chars.forEach(char => operandDigitBuffer.push(char));
    isResult = true;
}

function isValidResult(num) {

    // typeof() fails for numeric strings, isFinite() works for all except null
    const isValid = (isFinite(num) && num != null);

    if (!isValid) {
        // display the equation that produced the alert, but reset the data to 0
        updateDisplayDivs();
        updateDisplayExpression(buildFullExpression(num));
        clearExpression();
        alert(`Bad stuff happened: ${num}`);
    }

    return isValid;
}

function back() {

    operandDigitBuffer.pop();

    // do not allow empty display
    if (operandDigitBuffer.length === 0) {
        updateDisplayDivs();
        return;
    }

    updateDisplayDivs(operandDigitBuffer.join(''));
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

// TODO: will use the negate flag here and in display methods
// so operand buffer will not have the '-' char in it, but operand variable will be negative
function getOperandFromBuffer() {

    // display defaults to 0, handle empty buffer
    if (operandDigitBuffer.length === 0)
        operandDigitBuffer.push('0');

    // TODO: do I want to check NaN here?
    const num = Number.parseFloat(operandDigitBuffer.join(''));

    // reset buffer for use in the next operand
    operandDigitBuffer.splice(0, operandDigitBuffer.length);

    //return signMultiplier * num;
    return num;
}

function negate() {
    signMultiplier *= -1;
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


// TODO: add negate to display
function updateDisplayDivs(s = '0') {

    // first or second operand digits being added
    displayOperand.innerText = s;
    displayExpression.innerText = s;

    // second operand in progress, add the partial expression
    if (operand1 !== null && operatorValue != null && operand2 === null)
        updateDisplayOperator(s);
}

function updateDisplayOperator(s = '') {
    displayExpression.innerText = `${operand1} ${operatorValue} ${s}`;
}

function updateDisplayExpression(s = '0') {
    displayExpression.innerText = s;
}

function buildFullExpression(result) {
    return `${operand1} ${operatorValue} ${operand2} = ${result}`;
}
