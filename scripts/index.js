'use strict';

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
        this.csvOperations = [];
    }

    getOperationToString() {
        return this.currentOperation + this.result;
    }
};

class CalculatorCSVModel {
    constructor(operation, userIp, date) {
        this.operation = operation;
        this.userIp = userIp;
        this.date = date;
    }

    getDataOnCsvFormat() {
        return this.operation + "," + this.userIp + "," + this.date;
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
        this.readExistingCSVFile();
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

    saveToCsvFile() {
        let currentDate = new Date();
        this.calculatorModel.csvOperations.push(new CalculatorCSVModel(this.calculatorModel.getOperationToString(), "192.168.1.1", currentDate));
        
        let csvContent = "";
        this.calculatorModel.csvOperations.forEach(function(rowArray) {
            let row = rowArray.getDataOnCsvFormat();
            csvContent += row + "\r\n";
        });

        let csvFile = new Blob([csvContent], {type:"text/csv"});
        let downloadLink = document.createElement("a");
        downloadLink.download = "operationHistoric.csv";
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    readExistingCSVFile() {
        let xhttp = new XMLHttpRequest();
        let scope = this;
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                buildExistingHistory(this.responseText);
            }
          };
          xhttp.open("GET", "operationHistoric.csv", true);
          xhttp.send();

        function buildExistingHistory(data) {
            var operations = data.split(/\r\n|\n/);
    
            for (var operationIndex=0; operationIndex<operations.length; operationIndex++) {
                let operationValues = operations[operationIndex].split(','); 
                let csvOperation = new CalculatorCSVModel(operationValues[0],operationValues[1],operationValues[2]);
                scope.calculatorModel.csvOperations.push(csvOperation);
            }
        }
    }
};

const calculatorModel = new CalculatorModel();
const calculatorView = new CalculatorView();
const calculatorCtrl = new CalculatorCtrl(calculatorModel, calculatorView);

calculatorCtrl.init();