function FiniteFieldCalculator(p = NaN, m = NaN, irreduciblePolynom = null) {

    if (isNaN(p) && isNaN(m)) return 'incorrect-variables';

    if (p < 2) return 'incorrect-p';

    this.prefixForFieldForStorage = "galois_field";
    this.prefixIrreduciblePolynomForFieldForStorage = this.prefixForFieldForStorage + '_' + 'irreducible_polynom';
    this.p = Math.floor(Number(p));
    this.m = Math.floor(Number(m));
    this.irreduciblePolynom = irreduciblePolynom;
    this.type = "p";
    this.oPolynomialHelper = PolynomialHelper();

    var finiteOutStorage = null;

    this.generateAndGetElementsOfGpField = function(p) {
        var aAcceptableCoefficients = [];
        for (let i = 0; i < p; i++) {
            aAcceptableCoefficients.push(i);
        }
        return aAcceptableCoefficients;
    }

    this.checkThePolynomialForIrreducibilityWithRespectToTheField = function(aPolynomForCheck) {

        var aFieldPolynoms = this.aFiniteField;
        var oPolynomialHelper = this.oPolynomialHelper;

        var aPolynomRemainderOfDiv = [];

        for (let i = 0; i < aFieldPolynoms.length; i++) {
            aPolynomRemainderOfDiv = oPolynomialHelper.getDivForPolynoms(aFieldPolynoms[i], aPolynomForCheck);
            if (!oPolynomialHelper.checkPolynomByZero(aFieldPolynoms[i]) && oPolynomialHelper.checkPolynomByZero(aPolynomRemainderOfDiv[1])) return false;
        }
        return true;
    }

    this.generateAndGetIrreduciblesPolynomialsForGp2 = function() {

        var p = this.p;

        var aQuadraticNonDeduction = [];

        var aIrreduciblesPolynomsForFieldGp2 = [];

        var index = null;

        var a = 0;

        var aMonomialX2 = [0, 0, 1]; // x^2

        var aAcumIccureduciblePolynom = [];

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
            aAcumIccureduciblePolynom = this.oPolynomialHelper.getSumForPolynoms(this.oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(0, aQuadraticNonDeduction[i]), aMonomialX2);
            if (this.checkThePolynomialForIrreducibilityWithRespectToTheField(aAcumIccureduciblePolynom)) {
                aIrreduciblesPolynomsForFieldGp2.push(aAcumIccureduciblePolynom);
            }
        }


        return aIrreduciblesPolynomsForFieldGp2;
    }

    this.generateAndGetIrreduciblesPolynomialsForGpm = function() {

        var p = this.p;
        var m = this.m;

        var aIrreduciblesPolynomsForField = [];

        if (m == 2 && p >= 3 && (p % 2 == 1)) aIrreduciblesPolynomsForField = this.generateAndGetIrreduciblesPolynomialsForGp2();

        var oPolynomialHelper = this.oPolynomialHelper;

        var aResultPolynom = [];

        var aAcumResultPolynom = [];

        var aAcumMonomial = [];

        var aAcumMonomial_2 = [];

        var aAcumMonomial_3 = [];

        var iDegree = 0;

        var iDegree_2 = 0;

        var iDegree_3 = 0;

        var aMainPartOfResultPolynom = oPolynomialHelper.getSumForPolynoms(oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(m, 1), oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(0, 1)); // x^m + 1

        // looking for our irreducible polynomial among the polynomials of "triangles"
        for (let i = 1; i < m; i++) {
            aAcumMonomial = oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(i, 1);
            aAcumResultPolynom = oPolynomialHelper.getSumForPolynoms(aAcumMonomial, aMainPartOfResultPolynom);
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
                    aAcumMonomial = oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(iDegree, 1);
                    aAcumMonomial_2 = oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(iDegree_2, 1);
                    aAcumMonomial_3 = oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(iDegree_3, 1);

                    aAcumResultPolynom = this.getSumForPolynoms(this.getSumForPolynoms(this.getSumForPolynoms(aAcumMonomial, aAcumMonomial_2), aAcumMonomial_3), aMainPartOfResultPolynom);

                    if (this.checkThePolynomialForIrreducibilityWithRespectToTheField(aAcumResultPolynom)) aIrreduciblesPolynomsForField.push(aAcumResultPolynom);
                }
            }
        }

        return aIrreduciblesPolynomsForField;
    }

    this.getElementsOfField = function(sType) {
        var finiteOutStorage = null;
        var aFiniteField = [];
        var aAcceptableCoefficients = [];

        if (isNaN(this.m)) {
            finiteOutStorage = localStorage.getItem(this.prefixForFieldForStorage + '_' + this.p);
        } else {
            finiteOutStorage = localStorage.getItem(this.prefixForFieldForStorage + '_' + this.p + '_' + this.m);
        }


        if (finiteOutStorage === null) {
            if (sType == "p") {
                aFiniteField = this.generateAndGetElementsOfGpField(this.p);
                localStorage.setItem(this.prefixForFieldForStorage + '_' + this.p, JSON.stringify(aFiniteField));
            }

            if (sType == "pm") {
                aAcceptableCoefficients = this.getElementsOfField("p");
                aFiniteField = this.oPolynomialHelper.getArrayOfPolynomialsForFiniteField(this.m, aAcceptableCoefficients);
                localStorage.setItem(this.prefixForFieldForStorage + '_' + this.p + '_' + this.m, JSON.stringify(aFiniteField));
            }

        } else {
            aFiniteField = JSON.parse(finiteOutStorage);
        }

        return aFiniteField;
    }

    this.getIrreduciblesPolynomsForGpm = function() {
        var irreduciblesPolynomsForFieldForStorage = null;
        var aIrreduciblesPolynomsForField = [];
        irreduciblesPolynomsForFieldForStorage = localStorage.getItem(this.prefixIrreduciblePolynomForFieldForStorage + '_' + this.p + '_' + this.m);
        if (irreduciblesPolynomsForFieldForStorage === null) {
            aIrreduciblesPolynomsForField = this.generateAndGetIrreduciblesPolynomialsForGpm();
        } else {
            aIrreduciblesPolynomsForField = JSON.parse(irreduciblesPolynomsForFieldForStorage);
        }
        return aIrreduciblesPolynomsForField;
    }


    if (isNaN(this.m)) {
        this.aFiniteField = this.getElementsOfField(this.type);
    } else {

        if (this.m <= 1) return 'incorrect-m';

        this.type = "pm";

        this.aFiniteField = this.getElementsOfField(this.type);

        this.aIrreduciblePolynoms = this.getIrreduciblesPolynomsForGpm();

        if (this.irreduciblePolynom === null) {

            if (this.aIrreduciblePolynoms.length == 1) this.irreduciblePolynom = this.aIrreduciblePolynoms[0];

            // if (this.aIrreduciblePolynoms.length > 1) return 'irreducible-polynomial-not-selected';

            if (this.aIrreduciblePolynoms.length == 0) return 'irreducibles-polynoms-not-found';

        } else {

            var bFlagCheck = false;

            for (let i = 0; i < this.aIrreduciblePolynoms.length; i++) {
                if (this.oPolynomialHelper.comparePolynomialsForEquality(this.irreduciblePolynom, this.aIrreduciblePolynoms[i])) {
                    bFlagCheck = true;
                    break;
                }
            }

            if (!bFlagCheck) return 'incorrect-polynom-for-field';
        }

    }

    this.getConstructedFiniteFieldMatrixForOperation = function(sOperation) {

        var aResultMatrix = [];
        var arrayForSumOfNumber = [];
        var iAccumulate = false;

        var aFieldPolynoms = this.aFiniteField;

        for (let i = 0; i < aFieldPolynoms.length; i++) {
            for (let j = 0; j < aFieldPolynoms.length; j++) {

                iAccumulate = false;

                switch (sOperation) {
                    case "+":
                        iAccumulate = this.getSumForFiniteField(aFieldPolynoms[i], aFieldPolynoms[j]);
                        break;
                    case "-":
                        iAccumulate = this.getDiffForFiniteField(aFieldPolynoms[i], aFieldPolynoms[j]);
                        break;
                    case "*":
                        iAccumulate = this.getMultiplicationForFiniteField(aFieldPolynoms[i], aFieldPolynoms[j]);
                        console.log(i + ' и ' + j); //13 и 3
                        console.log(this.oPolynomialHelper.getViewForPolynom(aFieldPolynoms[i]) + ' * ' + this.oPolynomialHelper.getViewForPolynom(aFieldPolynoms[j]) + ' = ' + this.getViewForPolynom(iAccumulate))
                        console.log('---');
                        break;
                    case "/":
                        iAccumulate = this.getDivForFiniteField(aFieldPolynoms[i], aFieldPolynoms[j]);
                        break;
                    case "^":
                        if (this.type == "p")
                            iAccumulate = this.getPowForFiniteField(aFieldPolynoms[i], [j]);
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

        return aResultMatrix;

    }

    this.giveDivisionModulo = function(operand) {
        var resultOfDiv;

        switch (this.type) {
            case "p":
                resultOfDiv = operand % this.p;
                break;
            case "pm":
                resultOfDiv = this.deleteNonFieldMonomials(this.oPolynomialHelper.giveTheDivisionModuloAndTakeTheModule(operand, this.irreduciblePolynom));
                break;
            default:
                resultOfDiv = NaN;
        }

        return resultOfDiv;
    }

    this.deleteNonFieldMonomials = function(aPolynom) {
        var aFieldPolynoms = this.aFiniteField;
        var aAcumMonomial = [];
        var oPolynomialHelper = this.oPolynomialHelper;
        for (let i = 0; i < aPolynom.length; i++) {
            aAcumMonomial = oPolynomialHelper.getPolynomialFromTheParametersOfTheMonomial(i, aPolynom[i]);
            if (!this.checkElementForPresenceInField(aAcumMonomial)) aPolynom = oPolynomialHelper.getDiffForPolynoms(aPolynom, aAcumMonomial);
        }
        return aPolynom;
    }

    this.getSumForFiniteField = function(operand1, operand2) {

        if (!this.checkElementForPresenceInField(operand1) || !this.checkElementForPresenceInField(operand2))
            return false;

        else
            return this.giveDivisionModulo(this.getSumForFieldElements(operand1, operand2));

    }

    this.getSumForFieldElements = function(operand1, operand2) {

        var resultOfSum;

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

    this.getDiffForFiniteField = function(operand1, operand2) {

        if (!this.checkElementForPresenceInField(operand1) || !this.checkElementForPresenceInField(operand2))
            return false;

        else
            return this.getSumForFiniteField(operand1, this.mutuallyInverseNumber(operand2));

    }

    this.getMultiplicationForFiniteField = function(operand1, operand2) {

        if (!this.checkElementForPresenceInField(operand1) || !this.checkElementForPresenceInField(operand2))
            return false;

        else
            return this.giveDivisionModulo(this.getMultiplicationForFieldElements(operand1, operand2)); //(operand1 * operand2) % p;
    }

    this.getMultiplicationForFieldElements = function(operand1, operand2) {

        var resultOfSum;

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

    this.getDivForFiniteField = function(operand1, operand2) {

        var oPolynomialHelper = this.oPolynomialHelper;

        if (!this.checkElementForPresenceInField(operand1) || !this.checkElementForPresenceInField(operand2)) {
            return false;
        } else if (operand2 == 0 || oPolynomialHelper.checkPolynomByZero(operand2)) {
            return NaN;
        } else {
            return this.getMultiplicationForFiniteField(operand1, this.inverseNumber(operand2));
        }
    }

    this.getPowForFiniteField = function(iNumber, iPow) {

        if (!this.checkElementForPresenceInField(iNumber) || !this.checkElementForPresenceInField(iPow)) return false;

        iNumber = Number(iNumber);
        iPow = Number(iPow);

        if (iPow <= 1) return Math.pow(iNumber, iPow);

        var result = false;

        for (let i = 1; i < iPow; i++) {
            if (result === false) result = this.getMultiplicationForFiniteField(iNumber, iNumber);
            else result = this.getMultiplicationForFiniteField(result, iNumber);
        }

        return result;

    }

    this.getRootForFiniteField = function(iNumber, iPow) {

        if (!this.checkElementForPresenceInField(iNumber) || !this.checkElementForPresenceInField(iPow)) return false;

        var p = this.p;
        iNumber = Number(iNumber);
        iPow = Number(iPow);

        var result = NaN;

        for (let i = 0; i < p; i++) {
            if (this.getPowForFiniteField(i, iPow) == iNumber) return i;
        }

        return NaN;

    }

    this.mutuallyInverseNumber = function(operand) {

        var aFieldPolynoms = this.aFiniteField;

        if (!this.checkElementForPresenceInField(operand)) return false;
        for (let i = 0; i < aFieldPolynoms.length; i++) {
            if (Number(this.getSumForFiniteField(operand, aFieldPolynoms[i])) == 0) return aFieldPolynoms[i];
        }
        return false;
    }

    this.inverseNumber = function(operand) {

        var aFieldPolynoms = this.aFiniteField;
        var oPolynomialHelper = this.oPolynomialHelper;

        if (!this.checkElementForPresenceInField(operand)) return false;
        for (let i = 0; i < aFieldPolynoms.length; i++) {
            if ((this.type == "p" && this.getMultiplicationForFiniteField(operand, aFieldPolynoms[i]) == 1) || (this.type == "pm" && oPolynomialHelper.checkPolynomByZero(oPolynomialHelper.getDiffForPolynoms(this.getMultiplicationForFiniteField(operand, aFieldPolynoms[i]), [1])))) return aFieldPolynoms[i];
        }
        return false;
    }

    this.checkElementForPresenceInField = function(element) {

        var aFiniteField = this.aFiniteField;
        var oPolynomialHelper = this.oPolynomialHelper;

        for (let i = 0; i < aFiniteField.length; i++) {
            switch (this.type) {
                case "p":
                    if (Number(aFiniteField[i]) == Number(element)) return true;
                    break;
                case "pm":
                    if (oPolynomialHelper.checkPolynomByZero(oPolynomialHelper.getDiffForPolynoms(element, aFiniteField[i]))) return true;
                    break;
                default:
                    return false;
            }
        }
    }


    return this;

}