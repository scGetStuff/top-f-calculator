"use strict"

console.clear();

// DOM referances & event binding
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
let signMultiplier = 1;
// using array as a buffer for the didgits entered
const operand = [];
// TODO: kind of lame, but i need to know if i am in a new expression or building off of result
// typing after a calculation was append numbers to the result
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

// TODO: kind of messy, need to fix this for negatives, get it down to 
// single function that driven off the state of the expresssion
// old code was simple single string display
// added second display field for the full expression
function displayUpdate(s = '') {
    // user enters operand digits
    if (s !== '') {
        displayOperand.innerText = s;
        displayExpression.innerText = s;
    }
    // once they have hit an operator can use the data in the variables
    if (operatorValue != null)
        displayExpression.innerText = `${operand1} ${operatorValue} ${s}`;
}

function displayEquation(result) {
    displayOperand.innerText = result;
    displayExpression.innerText = `${operand1} ${operatorValue} ${operand2} = ${result}`;
}

function displayResetOperand() {
    displayOperand.innerText = '0';
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
        clear();

    if (shouldAppend(key)) {
        operand.push(key);
        displayUpdate(operand.join(''));
    }
}

// some special cases for 0 and decimal that were poluting appendOperand()
function shouldAppend(key) {
    // limit leading 0's to 1
    if (key === '0' && operand.length === 1 && operand[0] === '0')
        return false;

    if (key === '.') {
        // user starts with '.'; '0' is in the display but not the buffer, so add it
        if (operand.length === 0)
            operand.push('0');
        // decimal can only occur once
        if (operand.includes('.'))
            return false;
    }

    return true;
}

function setOperator(operator) {

    if (isRunable())
        operate();

    // user is repeatedly pounding on operator buttons before entering second operand
    if (operand1 != null && operand.length == 0) {
        operatorValue = operator;
        displayUpdate();
        return;
    }

    operatorValue = operator;

    // if the user hits an operator imediatly after load/refresh, the buffer is empty, default to 0
    if (operand.length === 0)
        operand.push('0');

    // set the first operand and clear the buffer
    operand1 = Number.parseFloat(operand.join(''));
    operand.splice(0, operand.length);
    displayUpdate();
    isResult = false;
}

function isRunable() {
    return (operand1 != null && operatorValue != null && operand.length > 0);
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
        displayUpdate('0');
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

    if (operatorValue == null || operand.length == 0)
        return;

    operand2 = Number.parseFloat(operand.join(''));
    let result = mapOfStuffThatWouldHaveBeenStupidLookingBranching[operatorValue]();
    if (!isValidResult(result))
        return;

    // round answers with long decimals so that they don’t overflow the screen 
    if (!Number.isInteger(result))
        result = Number.parseFloat(result.toFixed(4));
    displayEquation(result);

    // reset buffer with result for use by next operation
    clear();
    const chars = result.toString().split('');
    chars.forEach(char => operand.push(char));
    isResult = true;
}

function isValidResult(num) {
    // typeof() fails for numeric strings, isFinite() works for all except null
    const isValid = (isFinite(num) && num != null);

    if (!isValid) {
        // display the equation that produced the alert, but reset the data to 0
        displayEquation(num);
        displayResetOperand();
        clear();
        alert(`Bad stuff happened: ${num}`);
    }

    return isValid;
}

function back() {
    operand.pop();

    // do not allow empty display, default 0
    if (operand.length === 0) {
        displayUpdate('0');
        return;
    }

    displayUpdate(operand.join(''));
}

function clear() {
    operand1 = null;
    operand2 = null;
    operatorValue = null;
    operand.splice(0, operand.length);
    isResult = false;
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
    signMultiplier *= -1;
}

// TODO: plan is to use this as a wraper for setting an operand
// will use the negate flag here, so operand buffer will not have the 
// - char in it, but the variable will be negative
function calcOperand() {
    return signMultiplier * Number.parseFloat(operand.join(''));
}
