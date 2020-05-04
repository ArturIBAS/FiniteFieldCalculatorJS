var oCalculator = FiniteFieldCalculator(6, 3);

// console.log("Матрица суммы:");
// console.log(oCalculator.getConstructedFiniteFieldMatrixForOperation("+"));
// console.log("Матрица разности:");
// console.log(oCalculator.getConstructedFiniteFieldMatrixForOperation("-"));
// console.log("Матрица произведений:");
// console.log(oCalculator.getConstructedFiniteFieldMatrixForOperation("*"));
// console.log("Матрица отношений:");
// console.log(oCalculator.getConstructedFiniteFieldMatrixForOperation("/"));
console.log("Матрица возведений в степень:");
console.log(oCalculator.getConstructedFiniteFieldMatrixForOperation("^"));
console.log("Матрица корней:");
console.log(oCalculator.getConstructedFiniteFieldMatrixForOperation("v"));