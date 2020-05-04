function FiniteFieldCalculator(p) {

    this.p = Math.floor(Number(p));

    this.getP = function() {
        return this.p;
    };


    this.getConstructedFiniteFieldMatrixForOperation = function(sOperation) {

        var aResultMatrix = [];
        var arrayForSumOfNumber = [];
        var iAccumulate = false;

        for (let i = 0; i < p; i++) {
            for (let j = 0; j < p; j++) {


                switch (sOperation) {
                    case "+":
                        iAccumulate = this.getSumForFiniteField(i, j);
                        break;
                    case "-":
                        iAccumulate = this.getDiffForFiniteField(i, j);
                        break;
                    case "*":
                        iAccumulate = this.getProductForFiniteField(i, j);
                        break;
                    case "/":
                        iAccumulate = this.getDivForFiniteField(i, j);
                        break;
                    case "^":
                        iAccumulate = this.getPowForFiniteField(i, j);
                        break;
                    case "v":
                        iAccumulate = this.getRootForFiniteField(i, j);
                        break;
                    default:
                        return false;
                }

                if (iAccumulate !== false)
                    arrayForSumOfNumber[j] = iAccumulate;
                else
                    return false;
            }
            aResultMatrix[i] = arrayForSumOfNumber;
            arrayForSumOfNumber = [];
        }

        return aResultMatrix;

    }


    this.getSumForFiniteField = function(iOperand1, iOperand2) {

        var p = this.p;
        iOperand1 = Number(iOperand1);
        iOperand2 = Number(iOperand2);

        if (!this.checkNumberForPresenceInField(iOperand1) || !this.checkNumberForPresenceInField(iOperand2))
            return false;

        else
            return (iOperand1 + iOperand2) % p;

    }

    this.getDiffForFiniteField = function(iOperand1, iOperand2) {

        var p = this.p;
        iOperand1 = Number(iOperand1);
        iOperand2 = Number(iOperand2);

        if (!this.checkNumberForPresenceInField(iOperand1) || !this.checkNumberForPresenceInField(iOperand2))
            return false;

        else
            return this.getSumForFiniteField(iOperand1, this.mutuallyInverseNumber(iOperand2));

    }

    this.getProductForFiniteField = function(iOperand1, iOperand2) {
        iOperand1 = Number(iOperand1);
        iOperand2 = Number(iOperand2);

        if (!this.checkNumberForPresenceInField(iOperand1) || !this.checkNumberForPresenceInField(iOperand2))
            return false;

        else
            return (iOperand1 * iOperand2) % p;
    }

    this.getDivForFiniteField = function(iOperand1, iOperand2) {
        iOperand1 = Number(iOperand1);
        iOperand2 = Number(iOperand2);

        if (!this.checkNumberForPresenceInField(iOperand1) || !this.checkNumberForPresenceInField(iOperand2))
            return false;

        else
            return this.getProductForFiniteField(iOperand1, this.inverseNumber(iOperand2));
    }

    this.getPowForFiniteField = function(iNumber, iPow) {

        if (!this.checkNumberForPresenceInField(iNumber) || !this.checkNumberForPresenceInField(iPow)) return false;

        iNumber = Number(iNumber);
        iPow = Number(iPow);

        if (iPow <= 1) return Math.pow(iNumber, iPow);

        var result = false;

        for (let i = 0; i < iPow; i++) {
            if (result === false)
                result = this.getProductForFiniteField(iNumber, iNumber);
            else result = this.getProductForFiniteField(result, iNumber);
        }

        return result;

    }

    this.getRootForFiniteField = function(iNumber, iPow) {

        if (!this.checkNumberForPresenceInField(iNumber) || !this.checkNumberForPresenceInField(iPow)) return false;

        var p = this.p;
        iNumber = Number(iNumber);
        iPow = Number(iPow);

        var result = NaN;

        for (let i = 0; i < p; i++) {
            if (this.getPowForFiniteField(i, iPow) == iNumber) return i;
        }

        return NaN;

    }

    this.mutuallyInverseNumber = function(iNumber) {
        var p = this.p;
        if (!this.checkNumberForPresenceInField(iNumber)) return false;
        for (let i = 0; i < p; i++) {
            if (this.getSumForFiniteField(iNumber, i) === 0) return i;
        }
        return false;
    }

    this.inverseNumber = function(iNumber) {
        var p = this.p;
        if (!this.checkNumberForPresenceInField(iNumber)) return false;
        for (let i = 0; i < p; i++) {
            if (this.getProductForFiniteField(iNumber, i) === 1) return i;
        }
        return false;
    }

    this.checkNumberForPresenceInField = function(iNumber) {
        var p = this.p;
        return (Number.isInteger(iNumber) && iNumber < p);
    }

    return this;

}