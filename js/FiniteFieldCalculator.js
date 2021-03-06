//by Artur Buried
//email: arturburiev@yandex.ru
//good lack!

function FiniteFieldCalculator(p = NaN, m = NaN, irreduciblePolynom = null) {

    this.generateAndGetElementsOfGpField = function(p) {
        let aAcceptableCoefficients = [];
        for (let i = 0; i < p; i++) {
            aAcceptableCoefficients.push(i);
        }
        return aAcceptableCoefficients;
    }

    this.checkThePolynomialForIrreducibilityWithRespectToTheField = function(aPolynomForCheck) {

        let aPolynomRemainderOfDiv = [];

        for (let i = 0; i < this.aFiniteField.length; i++) {
            aPolynomRemainderOfDiv = this.oPolynomialHelper.getDivForPolynoms(this.aFiniteField[i], aPolynomForCheck);
            if (!this.oPolynomialHelper.checkPolynomByZero(this.aFiniteField[i]) && this.oPolynomialHelper.checkPolynomByZero(aPolynomRemainderOfDiv[1])) return false;
        }

        return true;
    }

    this.generateAndGetIrreduciblesPolynomialsForGp2 = function() {

        let p = this.p;
        let aQuadraticNonDeduction = [];
        let aIrreduciblesPolynomsForFieldGp2 = [];
        let index = null;
        let a = 0;
        let aMonomialX2 = [0, 0, 1]; // x^2
        let aAcumIccureduciblePolynom = [];

        // fill our field with elements from 0 to p-1
        for (let i = 1; i < p; i++) {
            aQuadraticNonDeduction.push(i);
        }

        // select quadratic residues from the filled field
        for (let i = 0; i < aQuadraticNonDeduction.length; i++) {
            a = (aQuadraticNonDeduction[i] * aQuadraticNonDeduction[i]) % p;
            index = aQuadraticNonDeduction.indexOf(a);
            if (index > -1) {
                aQuadraticNonDeduction.splice(index, 1);
            }
        }

        for (let i = 0; i < aQuadraticNonDeduction.length; i++) {
            aAcumIccureduciblePolynom = this.oPolynomialHelper.getSumForPolynoms(
                this.oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(0, aQuadraticNonDeduction[i]), aMonomialX2);
            if (this.checkThePolynomialForIrreducibilityWithRespectToTheField(aAcumIccureduciblePolynom)) {
                aIrreduciblesPolynomsForFieldGp2.push(aAcumIccureduciblePolynom);
            }
        }


        return aIrreduciblesPolynomsForFieldGp2;
    }

    this.generateAndGetIrreduciblesPolynomialsForGpm = function() {
        let p = this.p;
        let m = this.m;
        let aIrreduciblesPolynomsForField = [];
        
        if (this.m == 3 && (this.p == 2 || this.p == 3)) {
            aIrreduciblesPolynomsForField.push([-1, -1, 0, 1]);
            return aIrreduciblesPolynomsForField;
        }
        
        if (m == 2 && p >= 3 && (p % 2 == 1)) 
            aIrreduciblesPolynomsForField = this.generateAndGetIrreduciblesPolynomialsForGp2();
        
        let aResultPolynom = [];
        let aAcumResultPolynom = [];
        let aAcumMonomial = [];
        let aAcumMonomial_2 = [];
        let aAcumMonomial_3 = [];
        let iDegree = 0;
        let iDegree_2 = 0;
        let iDegree_3 = 0;
        
        let aMainPartOfResultPolynom = oPolynomialHelper.getSumForPolynoms(
        oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(m, 1),
        oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(0, 1)); // x^m + 1
        // looking for our irreducible polynomial among the polynomials of "triangles"
        for (let i = 1; i < m; i++) {
            aAcumMonomial = this.oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(i, 1);
            aAcumResultPolynom = this.oPolynomialHelper.getSumForPolynoms(aAcumMonomial, aMainPartOfResultPolynom);
            if (this.checkThePolynomialForIrreducibilityWithRespectToTheField(aAcumResultPolynom)) {
                aIrreduciblesPolynomsForField.push(aAcumResultPolynom);
            }
        }
        //else looking for our irreducible polynomial among polynomials of "pentagons"
        if (m >= 4) {
            aAcumMonomial = [];
            aAcumResultPolynom = [];
            for (let i = 1; i < m; i++) {
                iDegree = i;
                iDegree_2 = iDegree + 1;
                iDegree_3 = iDegree_2 + 1;
                if (iDegree < m && iDegree_2 < m && iDegree_3 < m) {
                    aAcumMonomial = this.oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(iDegree, 1);
                    aAcumMonomial_2 = this.oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(iDegree_2, 1);
                    aAcumMonomial_3 = this.oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(iDegree_3, 1);
                    aAcumResultPolynom = this.getSumForPolynoms(this.getSumForPolynoms(this.getSumForPolynoms(aAcumMonomial, 
                    aAcumMonomial_2), 
                    aAcumMonomial_3), aMainPartOfResultPolynom);
                    if (this.checkThePolynomialForIrreducibilityWithRespectToTheField(aAcumResultPolynom)) 
                   aIrreduciblesPolynomsForField.push(aAcumResultPolynom);
                }
            }
        }
        return aIrreduciblesPolynomsForField;
    }

    this.getElementsOfField = function(sType) {
        let finiteOutStorage = null;
        let aFiniteField = [];
        let aAcceptableCoefficients = [];

        let sFlagCheckTheFieldForComplianceWithAxioms = '';

        // if (isNaN(this.m)) {
        //     finiteOutStorage = localStorage.getItem(this.prefixForFieldForStorage + '_' + this.p);
        // } else {
        //     finiteOutStorage = localStorage.getItem(this.prefixForFieldForStorage + '_' + this.p + '_' + this.m);
        // }


        if (finiteOutStorage === null) {
            if (sType == "p") {
                aFiniteField = this.generateAndGetElementsOfGpField(this.p);
                // localStorage.setItem(this.prefixForFieldForStorage + '_' + this.p, JSON.stringify(aFiniteField));
            }

            if (sType == "pm") {
                aAcceptableCoefficients = this.getElementsOfField("p");
                aFiniteField = this.oPolynomialHelper.getArrayOfPolynomialsForFiniteField(this.m, aAcceptableCoefficients);
                // localStorage.setItem(this.prefixForFieldForStorage + '_' + this.p + '_' + this.m, JSON.stringify(aFiniteField));
            }

        } else {
            aFiniteField = JSON.parse(finiteOutStorage);
        }


        return aFiniteField;

    }

    this.checkTheFieldForComplianceWithAxioms = function() {

            let sFlagCheckFieldOnUniquenessOfZeroForSum = this.checkFieldOnUniquenessOfZero("+");
            let sFlagCheckFieldOnUniquenessOfZeroForMult = this.checkFieldOnUniquenessOfZero("*");
            let sFlagCheckFieldOnUniquenessOfOneForMult = this.checkFieldOnUniquenessOfOne("*");

            let aStringFlagsOfCheck = [];

            aStringFlagsOfCheck.push(sFlagCheckFieldOnUniquenessOfZeroForSum);
            aStringFlagsOfCheck.push(sFlagCheckFieldOnUniquenessOfZeroForMult);
            aStringFlagsOfCheck.push(sFlagCheckFieldOnUniquenessOfOneForMult);


            for (let index in aStringFlagsOfCheck) {
                if (aStringFlagsOfCheck[index] !== 'success') return aStringFlagsOfCheck[index];
            }
        
        return 'success';

    }

    this.getIrreduciblesPolynomsForGpm = function() {
        let irreduciblesPolynomsForFieldForStorage = null;
        let aIrreduciblesPolynomsForField = [];
        // irreduciblesPolynomsForFieldForStorage = localStorage.getItem(this.prefixIrreduciblePolynomForFieldForStorage + '_' + this.p + '_' + this.m);
        // if (irreduciblesPolynomsForFieldForStorage === null) {
        aIrreduciblesPolynomsForField = this.generateAndGetIrreduciblesPolynomialsForGpm();
        // } else {
        // aIrreduciblesPolynomsForField = JSON.parse(irreduciblesPolynomsForFieldForStorage);
        // }
        return aIrreduciblesPolynomsForField;
    }


    this.constructAndGetFiniteFieldMatrixForOperation = function(sOperation) {
        let aResultMatrix = [];
        let arrayForSumOfNumber = [];
        let iAccumulate = false;
        console.log('--------- Operation: ' + sOperation + ' ----------------')
        let inc = 0;
        for (let i = 0; i < this.aFiniteField.length; i++) {
            for (let j = 0; j < this.aFiniteField.length; j++) {
                iAccumulate = false;
                inc += 1;
                console.log(inc);
                switch (sOperation) {
                    case "+":
                        iAccumulate = this.getSumForFiniteField(this.aFiniteField[i], this.aFiniteField[j]);
                        break;
                    case "-":
                        iAccumulate = this.getDiffForFiniteField(this.aFiniteField[i], this.aFiniteField[j]);
                        break;
                    case "*":
                        iAccumulate = this.getMultiplicationForFiniteField(this.aFiniteField[i], this.aFiniteField[j]);
                        break;
                    case "/":
                        iAccumulate = this.getDivForFiniteField(this.aFiniteField[i], this.aFiniteField[j]);
                        break;
                    case "^":
                        if (this.type == "p")
                            iAccumulate = this.getPowForFiniteField(this.aFiniteField[i], [j]);
                        break;
                    case "v":
                        if (this.type == "p")
                            iAccumulate = this.getRootForFiniteField([i], [j]);
                        break;
                    default:
                        return false;
                }
                if (iAccumulate !== false)
                    arrayForSumOfNumber[j] = iAccumulate;
                else
                    arrayForSumOfNumber[j] = [];
            }
            aResultMatrix[i] = arrayForSumOfNumber;
            arrayForSumOfNumber = [];
        }
        console.log('--------- End of operation: ' + sOperation + ' ----------------');
        return aResultMatrix;
    }


    this.getConstructedFiniteFieldMatrixForOperation = function(sOperation) {

        let matrixForOperationOutStorage = null;

        let sPrefixOperationForStorage = "";

        let sPrefixStorage = "";

        switch (sOperation) {
            case "+":
                sPrefixOperationForStorage = "sum";
                break;
            case "-":
                sPrefixOperationForStorage = "diff";
                break;
            case "*":
                sPrefixOperationForStorage = "mult";
                break;
            case "/":
                sPrefixOperationForStorage = "div";
                break;
            case "^":
                if (this.type == "pm") return 'error-operation-for-field';
                sPrefixOperationForStorage = "pow";
                break;
            case "v":
                if (this.type == "pm") return 'error-operation-for-field';
                sPrefixOperationForStorage = "root";
                break;
            default:
                return 'operation-not-found';
        }

        sPrefixStorage = sPrefixOperationForStorage + '_' + this.prefixForFieldForStorage + '_' + this.p;

        if (this.type == "pm") sPrefixStorage += '_' + this.m;

        // if (localStorage.getItem(sPrefixStorage) === null) {
        matrixForOperationOutStorage = this.constructAndGetFiniteFieldMatrixForOperation(sOperation);
        //     localStorage.setItem(sPrefixStorage, JSON.stringify(matrixForOperationOutStorage));
        // } else {
        //     matrixForOperationOutStorage = JSON.parse(localStorage.getItem(sPrefixStorage));
        // }

        return matrixForOperationOutStorage;

    }

    this.getViewsForFiniteFieldPolynoms = function() {
        let aViewsFiniteFieldPolynoms = [];

        for (let i = 0; i < this.aFiniteField.length; i++) {
            aViewsFiniteFieldPolynoms.push(this.oPolynomialHelper.getViewForPolynom(this.aFiniteField[i]));
        }

        return aViewsFiniteFieldPolynoms;

    }

    this.getViewsForField = function() {

        if (this.type == "p") {
            return this.aFiniteField;
        }

        if (this.type == "pm") {
            return this.getViewsForFiniteFieldPolynoms();
        }

        return false;

    }

    this.giveDivisionModulo = function(operand) {
        let resultOfDiv;

        switch (this.type) {
            case "p":
                resultOfDiv = operand % this.p;
                break;
            case "pm":
                resultOfDiv = this.getDivModuleForCoeffs(
                    this.oPolynomialHelper.giveTheDivisionModuloAndTakeTheModule(operand, this.irreduciblePolynom)
                );
                break;
            default:
                resultOfDiv = NaN;
        }

        return resultOfDiv;
    }

    this.getDivModuleForCoeffs = function(aPolynom) {

        let aAcumMonomial = [];
        for (let i = 0; i < aPolynom.length; i++) {
            aAcumMonomial = this.oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(i, aPolynom[i]);
            if (aPolynom[i] >= this.p) aPolynom[i] = aPolynom[i] % this.p;
        }
        return aPolynom;
    }

    this.getSumForFiniteField = function(operand1, operand2) {
        return this.giveDivisionModulo(this.getSumForFieldElements(operand1, operand2));
    }

    this.getSumForFieldElements = function(operand1, operand2) {
        let resultOfSum;
        switch (this.type) {
            case "p":
                resultOfSum = operand1 + operand2;
                break;
            case "pm":
                resultOfSum = this.oPolynomialHelper.getSumForPolynoms(operand1, operand2);
                break;
            default:
                resultOfSum = NaN;
        }
        return resultOfSum;
    }

    this.mutuallyInverseNumber = function(operand) {

        for (let i = 0; i < this.aFiniteField.length; i++) {
            if ((this.type == "p" && Number(this.getSumForFiniteField(operand, this.aFiniteField[i])) == 0) || 
                (this.type == "pm" && this.oPolynomialHelper.comparePolynomialsForEquality(this.getSumForFiniteField(operand, 
                this.aFiniteField[i]), [0]))) {
                return this.aFiniteField[i];
            }
        }
        return false;
    }
    
    this.getDiffForFiniteField = function(operand1, operand2) {
        let mutuallyInverseNumberOfOperand2 = this.mutuallyInverseNumber(operand2);
        return this.getSumForFiniteField(operand1, mutuallyInverseNumberOfOperand2);
    }

    this.getMultiplicationForFiniteField = function(operand1, operand2) {
        return this.giveDivisionModulo(this.getMultiplicationForFieldElements(operand1, operand2)); //(operand1 * operand2) % p;
    }

    this.getMultiplicationForFieldElements = function(operand1, operand2) {

        let resultOfSum;

        switch (this.type) {
            case "p":
                resultOfSum = operand1 * operand2;
                break;
            case "pm":
                resultOfSum = this.oPolynomialHelper.getMultiplicationForPolynoms(operand1, operand2);
                break;
            default:
                resultOfSum = NaN;
        }

        return resultOfSum;
    }

    this.inverseNumber = function(operand) {

        let aAcumPolynomForMult = [];

        for (let i = 0; i < this.aFiniteField.length; i++) {
            aAcumPolynomForMult = this.aFiniteField[i];
            if ((this.type == "p" && this.getMultiplicationForFiniteField(operand, aAcumPolynomForMult) == 1) || 
                (this.type == "pm" && this.oPolynomialHelper.comparePolynomialsForEquality(
                this.getMultiplicationForFiniteField(operand, aAcumPolynomForMult), [1]))) 
                return aAcumPolynomForMult;
        }
        return false;
    }
    
    this.getDivForFiniteField = function(operand1, operand2) {

        if ((this.type == "p" && operand2 == 0) || (this.type == "pm" && this.oPolynomialHelper.checkPolynomByZero(operand2))) {
            return NaN;
        } else {
            return this.getMultiplicationForFiniteField(operand1, this.inverseNumber(operand2));
        }
    }

    this.getPowForFiniteField = function(iNumber, iPow) {
        
        iNumber = Number(iNumber);
        iPow = Number(iPow);
        
        let result = iNumber;
        for (let i = 1; i < iPow; i++) {
            result = this.getMultiplicationForFiniteField(result, iNumber);
        }
        
        return result;
    }

    this.getRootForFiniteField = function(iNumber, iPow) {

        iNumber = Number(iNumber);
        iPow = Number(iPow);

        let result = NaN;

        for (let i = 0; i < this.aFiniteField.length; i++) {
            if (this.getPowForFiniteField(this.aFiniteField[i], iPow) == iNumber) return this.aFiniteField[i];
        }

        return NaN;

    }

    this.mutuallyInverseNumber = function(operand) {

        for (let i = 0; i < this.aFiniteField.length; i++) {
            if ((this.type == "p" && Number(this.getSumForFiniteField(operand, this.aFiniteField[i])) == 0) || (this.type == "pm" && this.oPolynomialHelper.comparePolynomialsForEquality(this.getSumForFiniteField(operand, this.aFiniteField[i]), [0]))) {
                return this.aFiniteField[i];
            }
        }
        return false;
    }

    this.checkElementForPresenceInField = function(element) {

        for (let i = 0; i < this.aFiniteField.length; i++) {
            switch (this.type) {
                case "p":
                    if (Number(this.aFiniteField[i]) == Number(element)) return true;
                    break;
                case "pm":
                    if (this.oPolynomialHelper.checkPolynomByZero(this.oPolynomialHelper.getDiffForPolynoms(element, this.aFiniteField[i]))) return true;
                    break;
                default:
                    return false;
            }
        }
    }

    this.checkFieldOnUniquenessOfZero = function(sOperation) {
        let aMatrix = this.getConstructedFiniteFieldMatrixForOperation(sOperation);

        let iCount = 0;
        for (let i = 1; i < aMatrix.length; i++) {
            iCount = 0;

            for (let j = 0; j < aMatrix[i].length; j++) {
                if (this.type == "p") {
                    if (Number(aMatrix[i][j]) === 0) iCount += 1;
                }
                if (this.type == "pm") {
                    if (this.oPolynomialHelper.checkPolynomByZero(aMatrix[i][j])) iCount += 1;
                }
            }
            if (iCount == 0) {
                return 'error-not-found-mutually-inverse-element' + '-' + sOperation;
            } else if (iCount > 1) {
                return 'inconsistency-with-axiom-uniqueness-zero' + '-' + sOperation;
            } else if (iCount == 1) {
                continue;
            } else {
                return 'error' + '-' + sOperation;
            }
        }

        return 'success';
    }

    this.checkFieldOnUniquenessOfOne = function(sOperation) {
        let aMatrix = this.getConstructedFiniteFieldMatrixForOperation(sOperation);
        let iCount = 0;


        for (let i = 1; i < aMatrix.length; i++) {
            iCount = 0;
            for (let j = 0; j < aMatrix[i].length; j++) {
                if (this.type == "p") {
                    if (Number(aMatrix[i][j]) === 1) iCount += 1;
                }
                if (this.type == "pm") {
                    if (this.oPolynomialHelper.comparePolynomialsForEquality(aMatrix[i][j], [1])) iCount += 1;
                }
            }
            if (iCount == 0) {
                return 'error-not-found-inverse-element' + '-' + sOperation;
            } else if (iCount > 1) {
                return 'inconsistency-with-axiom-uniqueness-one' + '-' + sOperation;
            } else if (iCount == 1) {
                continue;
            } else {
                return 'error' + '-' + sOperation;
            }
        }

        return 'success';
    }

    this.getViewForMatrixPolynom = function(aMatrixField) {
        for (let i = 0; i < aMatrixField.length; i++) {
            for (let j = 0; j < aMatrixField[i].length; j++) {
                aMatrixField[i][j] = this.oPolynomialHelper.getViewForPolynom(aMatrixField[i][j]);
            }
        }
        return aMatrixField;
    }

    this.getViewForMatrixOperation = function(sOperation) {

        let aMatrixField = this.getConstructedFiniteFieldMatrixForOperation(sOperation);

        let aMatrixFieldView = null;

        if (this.type == "p") aMatrixFieldView = aMatrixField;

        if (this.type == "pm") {
            aMatrixFieldView = this.getViewForMatrixPolynom(aMatrixField);
        }

        return aMatrixFieldView;

    }

    this.getArrayForSelectIrreduciblePolynom = function() {
        aIrreduciblePolynoms = this.aIrreduciblePolynoms;

        let oRes = new Object();

        for (let i = 0; i < aIrreduciblePolynoms.length; i++) {
            oRes[this.oPolynomialHelper.getViewForPolynom(aIrreduciblePolynoms[i])] = aIrreduciblePolynoms[i];
        }

        return oRes;
    }

    /////////////// CONSTRUCTOR ///////////////

    if (isNaN(p) && isNaN(m)) return 'incorrect-variables';

    if (p <= 1) return 'incorrect-p';

    this.prefixForFieldForStorage = "galois_field";
    this.prefixIrreduciblePolynomForFieldForStorage = this.prefixForFieldForStorage + '_' + 'irreducible_polynom';
    this.p = Math.floor(Number(p));
    this.m = Math.floor(Number(m));
    this.irreduciblePolynom = irreduciblePolynom;
    this.aIrreduciblePolynoms = [];
    this.type = "p";
    this.oPolynomialHelper = PolynomialHelper();

    let finiteOutStorage = null;
    let aAccFiniteField = [];

    if (isNaN(this.m)) {
        aAccFiniteField = this.getElementsOfField(this.type);
        if (!Array.isArray(aAccFiniteField)) return aAccFiniteField;
        else this.aFiniteField = aAccFiniteField;
    } else {

        if (this.m <= 1) return 'incorrect-m';

        this.type = "pm";

        this.aFiniteField = this.getElementsOfField(this.type);

        this.aIrreduciblePolynoms = this.getIrreduciblesPolynomsForGpm();

        if (this.aIrreduciblePolynoms.length == 0) return 'irreducibles-polynoms-not-found';

        if (this.irreduciblePolynom !== null) {

            let bFlagCheck = false;

            for (let i = 0; i < this.aIrreduciblePolynoms.length; i++) {
                if (this.oPolynomialHelper.comparePolynomialsForEquality(this.irreduciblePolynom, this.aIrreduciblePolynoms[i])) {
                    bFlagCheck = true;
                    break;
                }
            }

            if (!bFlagCheck) return 'incorrect-polynom-for-field';
        }

    }

    /////////////// CONSTRUCTOR ///////////////

    return this;

}
