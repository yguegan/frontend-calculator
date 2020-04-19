class CalculatorView {

    updateView(calculatorModel) {
        document.getElementsByClassName("summary-calc")[0].innerHTML = calculatorModel.operation;
        document.getElementsByClassName("result-calc")[0].innerHTML = calculatorModel.result;
    }
};

class CalculatorModel {

    init() {
        this.operation = "";
        this.result = 0;
    }


};

class CalculatorCtrl {
    constructor(calculatorModel, calculatorView) {
        this.calculatorModel = calculatorModel;
        this.calculatorView = calculatorView;
    }
    init() {
        calculatorModel.init();
        this.operation = "";
    }

    addToTheOperation(value) {
        this.calculatorModel.operation += value;
        this.calculatorView.updateView(this.calculatorModel);
    }

    computeResult() {
        this.calculatorModel.result = eval(this.calculatorModel.operation);
        this.calculatorModel.operation += " =";
        this.calculatorView.updateView(this.calculatorModel);
    }
};

const calculatorModel = new CalculatorModel();
const calculatorView = new CalculatorView();
const calculatorCtrl = new CalculatorCtrl(calculatorModel, calculatorView);

calculatorCtrl.init();