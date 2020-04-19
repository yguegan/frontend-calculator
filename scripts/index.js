class CalculatorView {

    updateView(calculatorModel) {
        document.getElementsByClassName("summary-calc")[0].innerHTML = calculatorModel.currentOperation;
        document.getElementsByClassName("result-calc")[0].innerHTML = calculatorModel.result;
    }
};

class CalculatorModel {
    init() {
        this.operandOne = "0";
        this.operandTwo = "0";
        this.currentOperation = "0";
        this.result = 0;
    }
};

class CalculatorCtrl {

    constructor(calculatorModel, calculatorView) {
        this.calculatorModel = calculatorModel;
        this.calculatorView = calculatorView;
    }
    init() {
        this.calculatorModel.init();
        this.operationsToTrigger = null;
        this.currentOperand = "0";
    }

    addToTheOperation(value) {
        this.currentOperand += value;
        if(this.calculatorModel.currentOperation === "0") {
            this.calculatorModel.currentOperation = value;
        }
        else {
            this.calculatorModel.currentOperation += value;
        }
        this.calculatorView.updateView(this.calculatorModel);
    }

    resetCurrentOperand() {
        this.currentOperand = ""
    }

    setOperationToTrigger(element, operation) {
        if(!isNaN(this.currentOperand)) {
            this.operationsToTrigger = operation;
            this.calculatorModel.operandOne = this.currentOperand;
            this.calculatorModel.currentOperation += " " + element.innerText + " ";
            this.resetCurrentOperand();
            this.calculatorView.updateView(this.calculatorModel);
        };
    }

    add(valueOne, valueTwo) {
        return Number(valueOne) + Number(valueTwo)
    }

    substract(valueOne, valueTwo) {
        return Number(valueOne) - Number(valueTwo)
    }

    multipleBy(valueOne, valueTwo) {
        return Number(valueOne) * Number(valueTwo)
    }

    dividedBy(valueOne, valueTwo) {
        if(Number(valueTwo) !== 0) {
            return Number(valueOne) / Number(valueTwo)
        }
        return 0.0;
    }

    computeResult() {
        this.calculatorModel.currentOperation += " = ";
        if(this.operationsToTrigger != null && !isNaN(this.currentOperand)) {
            if(this.currentOperand !== "") {
                this.calculatorModel.operandTwo = this.currentOperand;
            }
            this.calculatorModel.result = this.operationsToTrigger(this.calculatorModel.operandOne, this.calculatorModel.operandTwo);
            this.resetCurrentOperand();
        };
        this.calculatorView.updateView(this.calculatorModel);
    }

    resetCalculation() {
        this.calculatorModel.init();
        this.calculatorView.updateView(this.calculatorModel);
    }
};

const calculatorModel = new CalculatorModel();
const calculatorView = new CalculatorView();
const calculatorCtrl = new CalculatorCtrl(calculatorModel, calculatorView);

calculatorCtrl.init();