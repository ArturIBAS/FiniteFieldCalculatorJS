var oCalculator = FiniteFieldCalculator(2, 4, [1, 0, 0, 1, 1]);
// var oPolynomialHelper = PolynomialHelper();

// console.log('Неприводимый многочлен: ' + oPolynomialHelper.getViewForPolynom(oCalculator.irreduciblePolynom));

// console.log("Матрица:");
// var matrix = oCalculator.getConstructedFiniteFieldMatrixForOperation("*");

// for (let i = 0; i < matrix.length; i++) {
//     for (let j = 0; j < matrix[i].length; j++) {
//         console.log(oPolynomialHelper.getViewForPolynom(matrix[i][j]));
//     }
//     console.log('---------');
// }


// console.log("Матрица разности:");
// console.log(oCalculator.getConstructedFiniteFieldMatrixForOperation("-"));
// console.log("Матрица произведений:");
// console.log(oCalculator.getConstructedFiniteFieldMatrixForOperation("*"));
// console.log("Матрица отношений:");
// console.log(oCalculator.getConstructedFiniteFieldMatrixForOperation("/"));

// console.log("Матрица возведений в степень:");
// console.log(oCalculator.getConstructedFiniteFieldMatrixForOperation("^"));
// console.log("Матрица корней:");
// console.log(oCalculator.getConstructedFiniteFieldMatrixForOperation("v"));

// var oPolynomialHelper = PolynomialHelper();


// var aPolynom1 = [1, 0, 0]; //
// var aPolynom2 = [0, 0, 0]; //x^2+x+3


// var aRes = oPolynomialHelper.getMultiplicationForPolynoms(aPolynom1, aPolynom2);

// console.log(aRes);

// console.log(oPolynomialHelper.getViewForPolynom(aPolynom1));
// console.log(":");
// console.log(oPolynomialHelper.getViewForPolynom(aPolynom2));
// console.log("=");
// console.log(oPolynomialHelper.getViewForPolynom(aRes[1]));
// console.log(aRes);


/*
var aPolynomialsOfFiniteField = oPolynomialHelper.getArrayOfPolynomialsForFiniteField(3, [0, 1, 2]);
console.log(aPolynomialsOfFiniteField);

var aPolynomialsOfFiniteFieldForView = oPolynomialHelper.getArrayOfPolynomialsForFiniteFieldForView(aPolynomialsOfFiniteField);
console.log(aPolynomialsOfFiniteFieldForView);

*/