'use strict';

class CalculatorView {

    updateView(calculatorModel) {
        document.getElementsByClassName("summary-calc")[0].innerHTML = calculatorModel.currentOperation.replace(/\*/g, '×').replace(/\//g, '÷');
        if(calculatorModel.result) {
            document.getElementsByClassName("summary-calc")[0].innerHTML = document.getElementsByClassName("summary-calc")[0].innerHTML + " = "
            document.getElementsByClassName("result-calc")[0].innerHTML = calculatorModel.result;
        }
        else {
            document.getElementsByClassName("result-calc")[0].innerHTML = 0;
        }
    }
};

class CalculatorModel {
    init() {
        this.result = null;
        this.currentOperation = "";
        this.csvOperations = [];
        this.ipAddress = "";
        this.initCsvOperations();
        this.determineIpAddress()
    }

    getOperationToString() {
        return this.currentOperation + this.result;
    }

    determineIpAddress() {
        window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
            var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};      
            if(pc.createDataChannel !== undefined) {
                pc.createDataChannel('');
            }
            else {
                this.ipAddress = "unknown";
            }
            pc.createOffer(pc.setLocalDescription.bind(pc), noop)
            pc.onicecandidate = (ice) => {
            if (ice && ice.candidate && ice.candidate.candidate) {
                let extractedIps = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate);  
                pc.onicecandidate = noop;
                if(extractedIps !== null && extractedIps.length > 1) {
                    this.ipAddress = extractedIps[1];
                }
                else {
                    this.ipAddress = "localhost";
                }
            }
        };
    }

    initCsvOperations() {
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
                scope.csvOperations.push(csvOperation);
            }
        }
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
    }

    addOperatorToOperation(value) {
        let newCurrentOperation = this.calculatorModel.currentOperation + value;
        if (/^(([0-9]{1,})\.{0,1}([0-9]{0,})){1,}([+\-\*/]{1}(([0-9]{1,})\.{0,1}([0-9]{0,}))){0,}[+\-\*/]{1}$/.test(newCurrentOperation)) {
            this.calculatorModel.currentOperation = newCurrentOperation;
        }
        this.calculatorView.updateView(this.calculatorModel);
    }

    addToTheOperation(value) {
        let newCurrentOperation = this.calculatorModel.currentOperation + value;
        if(/^(([0-9]{1,})\.{0,1}([0-9]{0,})){1,}([+\-\*/]{1}(([0-9]{1,})\.{0,1}([0-9]{0,}))){0,}$/.test(newCurrentOperation)) {
            this.calculatorModel.currentOperation = newCurrentOperation;
        }
        this.calculatorView.updateView(this.calculatorModel);
    }

    computeResult() {
        this.calculatorModel.result = eval(this.calculatorModel.currentOperation).toFixed(2);
        this.calculatorView.updateView(this.calculatorModel);
    }

    resetCalculation() {
        this.calculatorModel.init();
        this.calculatorView.updateView(this.calculatorModel);
    }

    saveToCsvFile() {
        let currentDate = new Date();
        this.calculatorModel.csvOperations.push(new CalculatorCSVModel(this.calculatorModel.getOperationToString(), this.calculatorModel.ipAddress, currentDate));
        
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
};

const calculatorModel = new CalculatorModel();
const calculatorView = new CalculatorView();
const calculatorCtrl = new CalculatorCtrl(calculatorModel, calculatorView);

calculatorCtrl.init();