<!DOCTYPE html>
<html>
<body>
    <?php

    class CalculatorCsvModel {
        private $operation;
        private $ipAddress;
        private $date;

        function __construct($operation, $ipAddress, $date) {
            $this->operation = $operation;
            $this->ipAddress = $ipAddress;
            $this->date = $date;
        }

        function getOperation() {
            return $this->operation;
        }

        function getIpAddress() {
            return $this->ipAddress;
        }

        function getDate() {
            return $this->date;
        }
    }

    class CalculatorCtrl {
        private $csvOperations;
        private $calculatorView;


        function __construct($calculatorView) {
            $this->calculatorView = $calculatorView;
            $this->csvOperations = array();
        }

        public function loadInformationsFromCsv() {
            $row = 1;
            if (($handle = fopen("operationHistoric.csv", "r")) !== FALSE) {
                while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                    $row++;
                    $csvOperation = new CalculatorCsvModel($data[0],$data[1],$data[2]);
                    array_push($this->csvOperations, $csvOperation);
                }
                fclose($handle);
            }
            ($this->calculatorView)->renderView($this->csvOperations);
        }
    };

    class CalculatorView {

        public function renderView($csvOperations) {
            echo "<table>";
            echo "<tr>";
            echo "<th>Operation</th>";
            echo "<th>Ip address</th>";
            echo "<th>Date</th>";
            echo "</tr>";
        
            foreach($csvOperations as $csvOperation) {
                echo "<tr>";
                echo "<td>" . $csvOperation->getOperation() . "</td>";
                echo "<td>" . $csvOperation->getIpAddress() . "</td>";
                echo "<td>" . $csvOperation->getDate() . "</td>";
                echo "</tr>";
            }

            echo "</table>";
        }
    };

    $calculatorView = new CalculatorView();
    $calculatorCtrl = new CalculatorCtrl($calculatorView);
    $calculatorCtrl->loadInformationsFromCsv();

    ?>
</body>
</html>