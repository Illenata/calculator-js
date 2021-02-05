"use strict";

window.addEventListener('DOMContentLoaded', () => {
    class Calculator {
        constructor(previousOperandTextElement, currentOperandTextElement) {
            this.previousOperandTextElement = previousOperandTextElement;
            this.currentOperandTextElement = currentOperandTextElement;
            this.readyToReset = false;
            this.clear();
        }

        clear() {
            this.currentOperand = '';
            this.previousOperand = '';
            this.operation = undefined;
        }

        delete() {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }

        appendNumber(number) {
            this.readyToReset = false;
            if (number === "." && this.currentOperand.includes('.')) { return; }
            this.currentOperand += number.toString();
        }

        chooseOperation(operation) {
            if (this.currentOperand === '' || this.currentOperand === 'error') {return;}
            if (this.previousOperand !== '') {
              this.compute();
            }
            this.operation = operation;
            this.previousOperand = this.currentOperand;
            this.currentOperand = '';       
        }

        sqrtOperation() {
            if (parseFloat(this.currentOperand) >= 0) {
                this.readyToReset = true;
                this.currentOperand = Math.sqrt(parseFloat(this.currentOperand));
            } else {
                this.readyToReset = true;
                this.currentOperand = 'error';
            }
        }

        negativeOperation() {
            this.readyToReset = false;
            if (this.currentOperand === 'error') {return;}
            if (this.currentOperand === '') {
                this.currentOperand = '-';
            }
            else {
                if (this.previousOperand !== '') {
                    this.compute();
                }
                  this.operation = '-';
                  this.previousOperand = this.currentOperand;
                  this.currentOperand = '';
            }
        }

        compute() {
            let computation;
            const prev = parseFloat(this.previousOperand);
            let current = parseFloat(this.currentOperand);
            if (isNaN(prev) || isNaN(current)) { return; }
            switch (this.operation) {
                case '+':
                    computation = prev + (current);
                    break;
                case '-':
                    computation = prev - (current);
                    break;
                case '*':
                    computation = prev * (current);
                    break;
                case '÷':
                    computation = prev / (current);
                    break;
                case 'xy':
                    computation = Math.pow(prev, current);
                    break;
                default:
                    return;
            }
            this.currentOperand = +computation.toFixed(10);
            this.operation = undefined;
            this.previousOperand = '';
            this.readyToReset = true;
        }

        getDisplayNumber(number) {
            const stringNumber = number.toString();
            const integerDigits = parseFloat(stringNumber.split('.')[0]);
            const desimalDigits = stringNumber.split('.')[1];
            let integerDisplay;
            if (number === '-') {
                integerDisplay = '-';
            } else if (number === 'error') {
                integerDisplay = 'error';
            } else if (isNaN(integerDigits)) {
                integerDisplay = '';
            } else {
                integerDisplay = integerDigits.toLocaleString('en', {
                    maximumFractionDigits: 0 });
            }
            if (desimalDigits != null) {
                if (integerDisplay === '') {
                    return `0.${desimalDigits}`.replace(/\,/g, ' ');
                } else {
                    return `${integerDisplay}.${desimalDigits}`.replace(/\,/g, ' ');
                }
            } else { 
                return integerDisplay.replace(/\,/g, ' ');
            }
        }

        updateDisplay() {
            this.currentOperandTextElement.innerText = 
            this.getDisplayNumber(this.currentOperand);
            if (this.operation === 'xy') {
                this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} x^y`;
            } else if (this.operation != null) {
                this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
            } else {
                this.previousOperandTextElement.innerText = '';
            }
        }
    }

    const numberBtns = document.querySelectorAll('[data-number]'),
        operationBtns = document.querySelectorAll('[data-operation]'),
        equalsBtn = document.querySelector('[data-equals]'),
        deleteBtn = document.querySelector('[data-delete]'),
        allClearBtn = document.querySelector('[data-all-clear]'),
        sqrtBtn = document.querySelector('[data-sqrt]'),
        negativeBtn = document.querySelector('[data-negative]'),
        previousOperandTextElement = document.querySelector('[data-previous-operand]'),
        currentOperandTextElement = document.querySelector('[data-current-operand]');


    const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

    numberBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (calculator.previousOperand === "" &&
            calculator.currentOperand !== "" &&
            calculator.readyToReset) {
                calculator.currentOperand = "";
                calculator.readyToReset = false;
            }
            calculator.appendNumber(btn.innerText);
            calculator.updateDisplay();
        });
    });

    operationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            calculator.chooseOperation(btn.innerText);
            calculator.updateDisplay();
        });
    });

    equalsBtn.addEventListener('click', () => {
        calculator.compute();
        calculator.updateDisplay();
    });

    allClearBtn.addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    });

    deleteBtn.addEventListener('click', () => {
            calculator.delete();
            calculator.updateDisplay();
    });

    sqrtBtn.addEventListener('click', () => {
        calculator.sqrtOperation();
        calculator.updateDisplay();
    });

    negativeBtn.addEventListener('click', () => {
        calculator.negativeOperation();
        calculator.updateDisplay();
    });
});