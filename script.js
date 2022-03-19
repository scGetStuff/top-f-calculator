"use strict"

// calc 2 at a time, do not try to parse an equation
// 1 + 2 + 3 + 4
// 3 + 3 + 4
// 6 + 4
// 10


// TODO: just for as I impliment
console.clear();

// TODO: won't care about leading 0s for now
// TODO: may need some error handling, will think about it later
// TODO: a seperate display for expression, operand1 and operator
// TODO: display field needs to validate length and make sure it waps ok if needed
// TODO: round so display does not overflow
// TODO: operator need to evaluate expression if they started the second operand
// operator just overwrites in initial implimentation
// TODO: back will clear the display, should have 0


// key press and button have to map to the same code, becasuse i said so
document.addEventListener('keydown', keyHandler);
// i wanted to do this at doc level, but i worry about click
// and drag out of button screwing things up, so it goes on all buttons
const buttons = [...document.getElementsByTagName('button')];
buttons.forEach(button => button.addEventListener('click', clickHandler));

const display = document.getElementById('result');


function keyHandler(e) {

    // allow shift for no numeric pad
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


// TODO: need to wrap this stuff up in an expression object
// haven't done class in js yet
// make the operator functions methods?
let operand1 = 0;
let operand2 = 0;
let operatorValue = '';
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

    // TODO: not in yet, just ignore
    if (n === 'negate')
        return;

    // decimal can only occur once
    if (n === '.' && operand.includes('.'))
        return;

    operand.push(n);
    setDisplay(operand.join(''));
}

function setOperator(s) {
    operatorValue = s;
    setDisplay(s);

    // set the first operand and clear the buffer
    operand1 = Number.parseInt(operand.join(''));
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

    if (operatorValue === '')
        return;

    // set the second operand and clear the buffer
    operand2 = Number.parseInt(operand.join(''));
    operand.splice(0, operand.length);

    const mapOfStuffThatWouldHaveBeenStupidLookingBranching = {
        '+': add,
        '-': sub,
        '*': mult,
        '/': divide
    };

    // call the operator function adi reset first operand for chaining operations
    operand1 = mapOfStuffThatWouldHaveBeenStupidLookingBranching[operatorValue]();
    setDisplay(operand1);
}

function back() {
    operand.pop();
    setDisplay(operand.join(''));
}

function clear() {
    operand1 = 0;
    operand2 = 0;
    operatorValue = '';
    operand.splice(0, operand.length);
    setDisplay(operand1);
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

// TODO: handle divide by 0
function divide() {
    // if (operand2 === 0)
    return operand1 / operand2;
}

// TODO: probably just a flag
// maybe need 2, one for each operand
// kind of harder cause of the buffer, can't just multiply -1
// cause i'm using an array of chars
function negate() {

}

