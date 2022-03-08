"use strict"

// basic plan is to have a map of keystroke handlers with one 
// event listener on the body.
// click on buttons should read button value and use the map too.
// each button value is the key, a function for each group/action
// numbers(and the other 2 keys), opperators, equal, clear.

console.clear();

document.addEventListener('keydown', keyHandler);

// i wanted to do this at doc level, but i worry about click
// and drag out of button screwing things up, so it goes on all
const buttons = [...document.getElementsByTagName('button')];
buttons.forEach(button => button.addEventListener('click', clickHandler));


const display = document.getElementById('result');
let operand1 = 0;
let operand2 = 0;
let operatorValue = '+';


// Same thing:
// =, Enter
// del, backspace
// Esc, clear
const eventMap = {};

function keyHandler(e) {
    // allow shift for no numeric pad
    // if (!(e.altKey || e.ctrlKey | e.metaKey || e.repeat || e.shiftKey))
    if (!(e.altKey || e.ctrlKey | e.metaKey || e.repeat)) {
        const key = e.key.toLowerCase();
        doStuffWithKey(key);
    }
}

function clickHandler(e) {
    doStuffWithKey(this.value);
}

function doStuffWithKey(key = '') {
    console.log(key);
    display.value = key;
}

// TODO: a seperate display for operator
// display field needs to validate length and make sure it waps ok if needed
// round so display does not overflow

// calc 2 at a time, do not try to parse an equation
// 1 + 2 + 3 + 4
// 3 + 3 + 4
// 6 + 4
// 10

// expect a number, won't care about leading 0s for now
// if not a number, then must be operator or clear
// next should be number or a new operator, multiple operator will overwrite
// final should be equal or clear
function isKeyValid() {

}

// validate 2 operands and an operator
function operate() {

}

function clear() {

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



