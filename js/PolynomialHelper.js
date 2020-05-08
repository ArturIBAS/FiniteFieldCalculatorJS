function PolynomialHelper() {

    this.getArrayOfPolynomialsForFiniteField = function(iMaxPolynomialDegree, aAcceptableCoefficients = []) {
        var oPerms = PermutationsWithRepetition(aAcceptableCoefficients, iMaxPolynomialDegree);
        var aPolynomsWithCoeffs = [];
        oPerms.each(function(v) { aPolynomsWithCoeffs.push(v); });

        aPolynomsWithCoeffs.sort(function(aPolynom1, aPolynom2) {
            for (let i = aPolynom1.length - 1; i >= 0; i--) {
                if (aPolynom1[i] == aPolynom2[i]) {
                    continue;
                } else {
                    return aPolynom1[i] > aPolynom2[i];
                }
            }
        });

        return aPolynomsWithCoeffs;
    }

    this.getArrayOfPolynomialsForFiniteFieldForView = function(aPolynomsWithCoeffs) {
        var aPolynomsWithCoeffsForView = [];
        for (let i = 0; i < aPolynomsWithCoeffs.length; i++) {
            aPolynomsWithCoeffsForView[i] = this.getViewForPolynom(aPolynomsWithCoeffs[i]);
            if (aPolynomsWithCoeffsForView[i] == "") aPolynomsWithCoeffsForView[i] = "0";
        }
        return aPolynomsWithCoeffsForView;
    }

    this.getViewForPolynom = function(aPolynom) {
        var sViewPolynom = "";
        var sSign = "+";

        if (this.checkPolynomByZero(aPolynom)) return "0";

        for (let i = aPolynom.length - 1; i >= 0; i--) {
            if (aPolynom[i] != 0) {
                if (aPolynom[i] == 1 && i >= 1) {
                    sViewPolynom += "";
                } else {
                    if (aPolynom[i] < 0 && sViewPolynom.slice(-1) == "+") sViewPolynom = sViewPolynom.substring(0, sViewPolynom.length - 1);
                    sViewPolynom += String(aPolynom[i]);
                }
                if (i > 0) {
                    if (i == 1) sViewPolynom += "x" + sSign;
                    else sViewPolynom += "x^" + String(i) + sSign;
                }
            }
        }

        if (sViewPolynom[sViewPolynom.length - 1] == "+" || sViewPolynom[sViewPolynom.length - 1] == "-") sViewPolynom = sViewPolynom.substring(0, sViewPolynom.length - 1);

        return sViewPolynom;
    }

    this.bringPolynomialsToSameOrder = function(aPolynom1, aPolynom2) {
        var arrayWithResultPolynoms = [];

        var iDiffLenght = 0;

        if (aPolynom1.length > aPolynom2.length) {
            iDiffLenght = aPolynom1.length - aPolynom2.length;
            for (let i = 0; i < iDiffLenght; i++) {
                aPolynom2.push(0);
            }
        }
        if (aPolynom1.length < aPolynom2.length) {
            iDiffLenght = aPolynom2.length - aPolynom1.length;
            for (let i = 0; i < iDiffLenght; i++) {
                aPolynom1.push(0);
            }
        }

        arrayWithResultPolynoms.push(aPolynom1);
        arrayWithResultPolynoms.push(aPolynom2);

        return arrayWithResultPolynoms;
    }

    this.getSumForPolynoms = function(aPolynom1, aPolynom2) { // return aPolynom1 + aPolynom2

        // console.log(aPolynom1);
        // console.log(aPolynom2);
        // console.log('---');

        var arrayAccumulate = this.bringPolynomialsToSameOrder(aPolynom1, aPolynom2);

        aPolynom1 = arrayAccumulate[0];
        aPolynom2 = arrayAccumulate[1];

        var aResultPolynom = [];

        for (let i = 0; i < aPolynom1.length; i++) {
            aResultPolynom[i] = aPolynom1[i] + aPolynom2[i];
        }

        return aResultPolynom;
    }

    this.getDiffForPolynoms = function(aPolynom1, aPolynom2) { // return aPolynom1 - aPolynom2
        var arrayAccumulate = this.bringPolynomialsToSameOrder(aPolynom1, aPolynom2);

        aPolynom1 = arrayAccumulate[0];
        aPolynom2 = arrayAccumulate[1];

        var aResultPolynom = [];

        for (let i = 0; i < aPolynom1.length; i++) {
            aResultPolynom[i] = aPolynom1[i] - aPolynom2[i];
        }

        return aResultPolynom;

    }

    this.giveTheDivisionModuloAndTakeTheModule = function(aPolynom1, aPolynom2) {

        var aResultPolynom = this.getDivForPolynoms(aPolynom1, aPolynom2)[1];
        aResultPolynom = this.getAbsOfPolynom(aResultPolynom);

        if (this.checkPolynomByZero(aResultPolynom)) return 0;
        return aResultPolynom;
    }

    this.getMultiplicationForPolynoms = function(aPolynom1, aPolynom2) { // return aPolynom1*aPolynom2
        var arrayAccumulate = this.bringPolynomialsToSameOrder(aPolynom1, aPolynom2);
        aPolynom1 = arrayAccumulate[0];
        aPolynom2 = arrayAccumulate[1];

        if (this.checkPolynomByZero(aPolynom1) || this.checkPolynomByZero(aPolynom2)) return 0;

        var aResultPolynom = [];

        for (let i = 0; i < aPolynom2.length; i++) {
            if (aPolynom2[i] != 0) {
                aResultPolynom.push(this.getMultiplicationForPolynomByMonomial(aPolynom1, aPolynom2[i], i));
            }
        }

        var aResultPolynomSum = aResultPolynom.shift();

        for (let i = 0; i < aResultPolynom.length; i++) {
            aResultPolynomSum = this.getSumForPolynoms(aResultPolynomSum, aResultPolynom[i]);
        }

        return aResultPolynomSum;

    }

    this.getMultiplicationForPolynomByMonomial = function(aPolynom, iCoeffMonomial, iDegreeMonomial) { // return aPolynom1-aPolynom2

        var aPolynomCopy = aPolynom.slice();

        for (let i = 0; i < aPolynomCopy.length; i++) {
            aPolynomCopy[i] = aPolynomCopy[i] * iCoeffMonomial;
        }

        for (let i = 0; i < iDegreeMonomial; i++) {
            aPolynomCopy.unshift(0);
        }

        return aPolynomCopy;
    }

    this.getDivForPolynoms = function(aPolynom1, aPolynom2, aPolynomResultDiv = undefined) { // return aPolynom1/aPolynom2 - return [result of div, remainder]

        if (aPolynomResultDiv === undefined) aPolynomResultDiv = [0];

        var arrayAccumulate = this.bringPolynomialsToSameOrder(aPolynom1, aPolynom2);

        aPolynom1 = arrayAccumulate[0];
        aPolynom2 = arrayAccumulate[1];

        var aResultPolynomOfDiv = [];

        var arrForMultiplierForBefore = [];

        var iMultiplicationDeegre = 0;
        var iMultiplicationCoeff = 0;

        var aAccForPolynom2 = [];

        var aResultWithPolynomAndRemainder = [];

        if (this.compareDeegreePolynoms(aPolynom2, aPolynom1) || this.checkPolynomByZero(aPolynom1)) {
            aResultWithPolynomAndRemainder[0] = aPolynomResultDiv;
            aResultWithPolynomAndRemainder[1] = aPolynom1;
            return aResultWithPolynomAndRemainder;

        } else {

            arrForMultiplierForBefore = this.getMultiplierForPolynomDivisorBeforePolynomDivided(aPolynom1, aPolynom2)

            if (arrForMultiplierForBefore.length == 0) return false;

            iMultiplicationDeegre = arrForMultiplierForBefore[0];
            iMultiplicationCoeff = arrForMultiplierForBefore[1];

            aPolynomResultDiv = this.getSumForPolynoms(aPolynomResultDiv, this.getPolynomialFromTheParametersOfTheMonomial(iMultiplicationDeegre, iMultiplicationCoeff));

            aAccForPolynom2 = this.getDiffForPolynoms(aPolynom1, this.getMultiplicationForPolynomByMonomial(aPolynom2, iMultiplicationCoeff, iMultiplicationDeegre));

            aResultPolynomOfDiv = this.getDivForPolynoms(aAccForPolynom2, aPolynom2, aPolynomResultDiv);

        }

        return aResultPolynomOfDiv;

    }

    this.getSeniorDivisorAndCoeffOfSeniorForPolynom = function(aPolynom) { // aRes[0] - senior divisor, aRes[1] - coeff
        var aRes = [];
        for (let i = aPolynom.length - 1; i >= 0; i--) {
            if (aPolynom[i] != 0) {
                aRes[0] = Number(i);
                aRes[1] = Number(aPolynom[i]);
                return aRes;
            }
        }
        return aRes;
    }

    this.compareDeegreePolynoms = function(aPolynom1, aPolynom2) { // degree of aPolynom1 > degree of aPolynom2

        var arrWithSeniorDivisorAndCoeff = [];
        var iDegree1 = 0;
        var iDegree2 = 0;

        iDegree1 = this.getSeniorDivisorAndCoeffOfSeniorForPolynom(aPolynom1)[0];
        iDegree2 = this.getSeniorDivisorAndCoeffOfSeniorForPolynom(aPolynom2)[0];

        return iDegree1 > iDegree2;

    }

    this.getMultiplierForPolynomDivisorBeforePolynomDivided = function(aPolynomDivided, aPolynomDivisor) { // return [iDegree, iCoeff]

        var arrWithSeniorDivisorAndCoeff = [];

        // параметры делимого aPolynom1
        var iSeniorDegreeOfDividend = 0;
        var iCoeffOfSeniorDegreeOfDividend = 0;

        // параметры делителя aPolynom2
        var iSeniorDivisor = 0;
        var iCoeffOfSeniorDivisor = 0;

        var iMultiplicationDeegre = 0;
        var iMultiplicationCoeff = 0;

        arrWithSeniorDivisorAndCoeff = this.getSeniorDivisorAndCoeffOfSeniorForPolynom(aPolynomDivided);

        iSeniorDegreeOfDividend = arrWithSeniorDivisorAndCoeff[0];
        iCoeffOfSeniorDegreeOfDividend = arrWithSeniorDivisorAndCoeff[1];

        arrWithSeniorDivisorAndCoeff = this.getSeniorDivisorAndCoeffOfSeniorForPolynom(aPolynomDivisor);

        iSeniorDivisor = arrWithSeniorDivisorAndCoeff[0];
        iCoeffOfSeniorDivisor = arrWithSeniorDivisorAndCoeff[1];

        arrWithSeniorDivisorAndCoeff = [];

        iMultiplicationDeegre = iSeniorDegreeOfDividend - iSeniorDivisor;

        iMultiplicationCoeff = iCoeffOfSeniorDegreeOfDividend / iCoeffOfSeniorDivisor;

        return [iMultiplicationDeegre, iMultiplicationCoeff];
    }

    this.getPolynomialFromTheParametersOfTheMonomial = function(iDegree, iCoeff) {

        var aResPolynom = new Array(iDegree + 1);
        aResPolynom.fill(0);
        aResPolynom[iDegree] = iCoeff;
        return aResPolynom;
    }

    this.checkPolynomByZero = function(aPolynom) {

        for (let i = 0; i < aPolynom.length; i++) {
            if (aPolynom[i] != 0) return false;
        }
        return true;
    }

    this.comparePolynomialsForEquality = function(aPolynom1, aPolynom2) {
        var aDiffPolynom = this.getDiffForPolynoms(aPolynom1, aPolynom2);
        return this.checkPolynomByZero(aDiffPolynom);
    }

    this.getAbsOfPolynom = function(aPolynom) {
        for (let i = 0; i < aPolynom.length; i++) {
            aPolynom[i] = Math.abs(aPolynom[i]);
        }
        return aPolynom;
    }

    this.parsePolynom = function(sViewPolynom) {

        sViewPolynom = sViewPolynom.replace(/\s+/g, ''); //delete \s and \n
        var aSplitWithMonomialsOfPolynom = sViewPolynom.split(/[-+]+/);

        if (aSplitWithMonomialsOfPolynom.length == 0) return false;

        var iMaxDegree = 0;

        var aSplitForMonomialsWithCoeffAndDegree = [];

        var iCoeff = 0;

        var iDegree = 0;

        var oWithDegreeAndCoeffs = new Object();

        for (let i = 0; i < aSplitWithMonomialsOfPolynom.length; i++) {
            aSplitForMonomialsWithCoeffAndDegree = aSplitWithMonomialsOfPolynom[i].split("^");

            if (aSplitForMonomialsWithCoeffAndDegree.length > 1) {

                if (aSplitForMonomialsWithCoeffAndDegree[0].indexOf('x') == -1) return false;

                if (aSplitForMonomialsWithCoeffAndDegree[0] == "x") iCoeff = 1;
                else iCoeff = aSplitForMonomialsWithCoeffAndDegree[0].substring(0, aSplitForMonomialsWithCoeffAndDegree[0].length - 1);

                if (iCoeff == "") iCoeff = 1;
                else iCoeff = Number(iCoeff);

                iDegree = Number(aSplitForMonomialsWithCoeffAndDegree[1]);

                oWithDegreeAndCoeffs[iDegree] = iCoeff;
                if (iDegree > iMaxDegree) iMaxDegree = iDegree;
            } else {
                if (aSplitForMonomialsWithCoeffAndDegree[0].indexOf('x') == -1) {
                    oWithDegreeAndCoeffs[0] = Number(aSplitForMonomialsWithCoeffAndDegree[0]);
                } else {
                    if (aSplitForMonomialsWithCoeffAndDegree[0].length > 1) {
                        oWithDegreeAndCoeffs[1] = Number(aSplitForMonomialsWithCoeffAndDegree[0].substring(0, aSplitForMonomialsWithCoeffAndDegree[0].length - 1));
                    } else {
                        oWithDegreeAndCoeffs[1] = 1;
                    }
                }
            }
        }

        var aPolynom = new Array(iMaxDegree + 1);
        aPolynom.fill(0);

        for (let i = 0; i < aPolynom.length; i++) {
            if (oWithDegreeAndCoeffs[i] !== undefined && oWithDegreeAndCoeffs[i] !== null && !isNaN(oWithDegreeAndCoeffs[i]))
                aPolynom[i] = oWithDegreeAndCoeffs[i];
        }

        return aPolynom;

    }

    return this;

}