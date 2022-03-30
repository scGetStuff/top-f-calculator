"use strict"

console.clear();

// DOM referances
document.addEventListener('keydown', keyHandler);
const buttons = [...document.getElementsByTagName('button')];
buttons.forEach(button => button.addEventListener('click', clickHandler));
const displayExpression = document.getElementById('expression');
const displayOperand = document.getElementById('operand');

// groups of buttons turned into lists used in key processing
// basicaly to avoid a bunch of stupid looking branches
let list = [...document.querySelectorAll('.btn-number')];
const numBtnValues = list.map(element => element.value);
list = [...document.querySelectorAll('.btn-operator')];
const opBtnValues = list.map(element => element.value);
list = [...document.querySelectorAll('.btn-action')];
const actValues = list.map(element => element.value);
list = undefined;
// add keyboard stuff that functions same as action buttons
actValues.push('=');
actValues.push('delete');

// expression data
// TODO: need to wrap this stuff up in an expression object
// haven't done class in js yet
// make the operator functions methods?
let operand1 = null;
let operand2 = null;
let operatorValue = null;
// using array as a buffer for the didgits entered
const operand = [];


// TODO: display field needs to validate length and make sure it waps ok if needed
// TODO: round so display does not overflow
// TODO: NaN/Infinity issues
// TODO: divide by zero message


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

// TODO: not sure what i want to do here
// origionaly had one field for display, passed in a single param
// added second area for the expression, messy first pass
function updateDisplay(s = '') {
    if (s !== '') {
        displayOperand.innerText = s;
        displayExpression.innerText = s;
    }
    if (operatorValue != null)
        displayExpression.innerText = `${operand1} ${operatorValue} ${s}`;
}

function displayEquation(result) {
    displayOperand.innerText = result;
    displayExpression.innerText = `${operand1} ${operatorValue} ${operand2} = ${result}`;
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
        alert('No negate yet');
        return;
    }

    // limit leading 0's to 1
    if (key === '0' && operand.length === 1 && operand[0] === '0')
        return;

    // this kind of ruins my generalized key handling code
    if (key === '.') {
        // user starts with '.'; '0' is in the display but not the buffer, so add it
        if (operand.length === 0)
            operand.push('0');
        // decimal can only occur once
        if (operand.includes('.'))
            return;
    }

    operand.push(key);
    updateDisplay(operand.join(''));
}

function setOperator(operator) {

    // execute if ready before processing current operator
    if (isRunable())
        operate();

    // user is repeatedly pounding on operator buttons before entering second operand
    if (operand1 != null && operand.length == 0) {
        operatorValue = operator;
        updateDisplay();
        return;
    }

    operatorValue = operator;
    // if the user hits an operator imediatly, the buffer is empty, fill 0
    if (operand.length === 0)
        operand.push('0');
    // set the first operand and clear the buffer
    operand1 = Number.parseFloat(operand.join(''));
    operand.splice(0, operand.length);
    updateDisplay();
}

function isRunable() {
    return (operand1 != null && operand.length > 0 && operatorValue != null);
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
        clear();
        updateDisplay('0');
        return;
    }
}

function operate() {

    if (operatorValue == null)
        return;

    const mapOfStuffThatWouldHaveBeenStupidLookingBranching = {
        '+': add,
        '-': sub,
        '*': mult,
        '/': divide
    };

    // set the second operand and run the calculation
    operand2 = Number.parseFloat(operand.join(''));
    const result = mapOfStuffThatWouldHaveBeenStupidLookingBranching[operatorValue]();
    displayEquation(result);

    // reset buffer with result for use by next operation
    clear();
    const chars = result.toString().split('');
    chars.forEach(char => operand.push(char));
}

function back() {
    operand.pop();

    // do not allow empty display, default 0
    if (operand.length === 0) {
        updateDisplay('0');
        return;
    }

    updateDisplay(operand.join(''));
}

function clear() {
    operand1 = null;
    operand2 = null;
    operatorValue = null;
    operand.splice(0, operand.length);
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

// TODO: kind of hard cause of the buffer
// flip a flag 1, -1 and multiply in appendOperand()
// will cause a problem in back(), would have to check for buffer === '-'
function negate() {

}

