"use strict"

// TODO: just for as I impliment
console.clear();

document.addEventListener('keydown', keyHandler);
const buttons = [...document.getElementsByTagName('button')];
buttons.forEach(button => button.addEventListener('click', clickHandler));
const display = document.getElementById('result');

function keyHandler(e) {
    // allow shift for keys not on numeric pad
    if (e.altKey || e.ctrlKey || e.metaKey || e.repeat)
        return;
    const key = e.key.toLowerCase();  // Backspace, Escape, potentialy others
    doStuffWithKey(key);
}

function clickHandler(e) {
    doStuffWithKey(this.value);
}

function setDisplay(s) {
    display.value = s;
}


// TODO: may need some error handling, will think about it later
// TODO: a seperate display for expression, operand1 and operator
// TODO: display field needs to validate length and make sure it waps ok if needed
// TODO: round so display does not overflow
// TODO: operator need to evaluate expression if they started the second operand
// TODO: NaN issues
// TODO: divide by zero message

// TODO: need to wrap this stuff up in an expression object
// haven't done class in js yet
// make the operator functions methods?
let operand1 = 0;
let operand2 = 0;
let operatorValue = null;
// using array as a buffer for the didgits entered
const operand = [];

// i tried a map of functions pointers, but it turned into a big dumb list with hardcoded keys that matched the html and made me want to kill myself
// i refuse to have a bunch of stupid looking branching, got it down to lists and a few branches
let list = [...document.querySelectorAll('.btn-number')];
const numBtnValues = list.map(element => element.value);
list = [...document.querySelectorAll('.btn-operator')];
const opBtnValues = list.map(element => element.value);
list = [...document.querySelectorAll('.btn-action')];
const actValues = list.map(element => element.value);
// add keyboard stuff that functions same as action buttons
actValues.push('=');
actValues.push('delete');
list = undefined;

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

function appendOperand(n) {

    if (n === 'negate') {
        alert('No negate yet');
        return;
    }

    // limit leading 0's to 1
    if (n === '0' && operand.length === 1 && operand[0] === '0')
        return;

    if (n === '.') {
        // user starts with '.'; '0' is in the display but not the buffer, so add it
        if (operand.length === 0)
            operand.push('0');
        // decimal can only occur once
        if (operand.includes('.'))
            return;
    }

    operand.push(n);
    setDisplay(operand.join(''));
}

function setOperator(s) {

    if (operatorValue !== null)
        operate();

    operatorValue = s;
    setDisplay(s);

    // set the first operand and clear the buffer
    operand1 = Number.parseFloat(operand.join(''));
    operand.splice(0, operand.length);
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
        return;
    }
}

function operate() {

    if (operatorValue === null)
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

    // reset buffer with result for use by next operation
    clear();
    const chars = result.toString().split('');
    chars.forEach(char => operand.push(char));
    setDisplay(result);
}

function back() {
    operand.pop();

    // do not allow empty display, default 0
    if (operand.length === 0) {
        setDisplay('0');
        return;
    }

    setDisplay(operand.join(''));
}

function clear() {
    operand1 = 0;
    operand2 = 0;
    operatorValue = null;
    operand.splice(0, operand.length);
    setDisplay('0');
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

