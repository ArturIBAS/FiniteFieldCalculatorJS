function validateFieldParams(aParams) {

    for (let i in aParams) {
        if (aParams[i] === null || aParams[i] === undefined || isNaN(aParams[i])) {
            return 'error-number';
        }
        if (Number(aParams[i]) <= 1) {
            return 'error-less-than-or-equal-to-one';
        }
        return 'success';
    }
}

function getHtmlMatrixView(oCalculator, sOperation) {

    let sHtmlResult = '';

    let sTitleOperation = 'Матрица ';

    switch (sOperation) {
        case "+":
            sTitleOperation += "сложения";
            break;
        case "-":
            sTitleOperation += "вычитания";
            break;
        case "*":
            sTitleOperation += "умножения";
            break;
        case "/":
            sTitleOperation += "деления";
            break;
        case "^":
            sTitleOperation += "степеней";
            break;
        case "v":
            sTitleOperation += "корней";
            break;
    }

    let aViewsOfFieldElements = oCalculator.getViewsForField();
    let aMatrixForView = oCalculator.getViewForMatrixOperation(sOperation);


    let htmlTableOpen = '<table border="1">';
    let htmlTableClose = '</table>';

    let sViewElem = "";

    sHtmlResult += '<h3 class="mt-50">' + sTitleOperation + '</h3><br>'

    sHtmlResult += htmlTableOpen;

    sHtmlResult += '<tr>';

    sHtmlResult += '<td>' + sOperation + '</td>';

    for (let i = 0; i < aViewsOfFieldElements.length; i++) {
        sHtmlResult += '<td>' + aViewsOfFieldElements[i] + '</td>';
    }

    sHtmlResult += '</tr>';

    for (let i = 0; i < aMatrixForView.length; i++) {

        sHtmlResult += '<tr>';

        sHtmlResult += '<td>' + aViewsOfFieldElements[i] + '</td>';

        for (let j = 0; j < aMatrixForView[i].length; j++) {
            if (String(aMatrixForView[i][j]) == "NaN") sViewElem = "-";
            else sViewElem = aMatrixForView[i][j];
            sHtmlResult += '<td>' + sViewElem + '</td>';
        }

        sHtmlResult += '</tr>';
    }

    sHtmlResult += htmlTableClose;

    return sHtmlResult;
}

function constructFieldMatrixOperationAndShow(oCalculator) {

    let aOperations = ["+", "-", "*", "/"];
    if (oCalculator.type == "p") {
        aOperations.push("^");
        aOperations.push("v");
    }

    let sHtmlTableContainer = '';

    let elDivContainer = $('#matrix-operation');

    elDivContainer.empty();

    for (let i in aOperations) {
        sHtmlTableContainer = getHtmlMatrixView(oCalculator, aOperations[i]);
        elDivContainer.append($(sHtmlTableContainer));
    }
}

function constructFieldAndCheckCorrect(p, m = NaN) {

    let oCalculator = null;
    let sFlagCorrectField = 'success';
    let irreduciblePolynom = null;

    let oIrreduciblePolynomsForSelect = null;

    if (isNaN(m)) {
        oCalculator = FiniteFieldCalculator(p);
    } else {
        irreduciblePolynom = $("#irreduciblePolynom").val();
        if (irreduciblePolynom === null) {
            oCalculator = FiniteFieldCalculator(p, m);
            console.log(oCalculator);
            oIrreduciblePolynomsForSelect = oCalculator.getArrayForSelectIrreduciblePolynom();
            for (let sPolynomView in oIrreduciblePolynomsForSelect) {
                $('#irreduciblePolynom').append('<option value="' + JSON.stringify(oIrreduciblePolynomsForSelect[sPolynomView]) + '">' + sPolynomView + '</option>');
            }
            $('#matrix-operation').empty();
            alert('Пожалуйста, выберите один из неприводимых многочленов!');
            $("#irreduciblePolynom").removeClass('d-none');
            return false;
        } else {
            irreduciblePolynom = JSON.parse(irreduciblePolynom);
            oCalculator = FiniteFieldCalculator(p, m, irreduciblePolynom);
        }
    }

    if (typeof oCalculator !== 'object') {
        alert(oCalculator);
    } else {
        sFlagCorrectField = oCalculator.checkTheFieldForComplianceWithAxioms();
        if (sFlagCorrectField != 'success') {
            alert(sFlagCorrectField);
        } else {
            constructFieldMatrixOperationAndShow(oCalculator);
        }
    }

}


$('input[type=radio][name=type-field]').change(function() {
    if ($(this).val() == "gfpm") {
        $('#m').removeClass('d-none');
        $('#generate-btn').addClass('d-none');
    } else {
        $('#m').addClass('d-none');
        $("#irreduciblePolynom").addClass('d-none');
    }
});

$('#m').keyup(function() {
    $('#irreduciblePolynom').empty();
    $('#irreduciblePolynom').addClass('d-none');
});

$('input.parametr-number-field').keyup(function() {
    if ($('input[type=radio][name=type-field]:checked').val() == "gfp") {
        if ($('#p').val() != '')
            $('#generate-btn').removeClass('d-none');
        else $('#generate-btn').addClass('d-none');
    } else {
        if ($('#p').val() != '' && $('#m').val() != '') {
            if ($("#m").val() != '') $('#generate-btn').removeClass('d-none');
        } else {
            $('#generate-btn').addClass('d-none');
        }
    }
});

$('#generate-btn').click(function() {

    let oCalculator = null;
    let p = 0;
    let m = NaN;

    let aParams = [];

    let sFlagValidateParams = '';

    p = Number($("#p").val());
    aParams.push(p);

    if ($('input[type=radio][name=type-field]:checked').val() == "gfpm") {
        m = Number($("#m").val());
        aParams.push(m);
    }


    sFlagValidateParams = validateFieldParams(aParams);

    switch (sFlagValidateParams) {
        case "error-less-than-or-equal-to-one":
            alert('Параметрами поля могут быть только числа, которые больше единицы!');
            break;
        case "error-number":
            alert('Некорректно введены параметры поля, пожалуйста, повторите попытку!');
            break;
        default:
            $('#matrix-operation').empty();
            $('#matrix-operation').append($("<h3 class='mt-50'>Идёт генерация, пожалуйста, подождите.</h3>"))
            if ($('input[type=radio][name=type-field]:checked').val() == "gfpm") {
                if (2 > 3 && m > 3)
                    alert('Генерация поля и построение матриц может занять некоторое время, пожалуйста, подождите!');
                constructFieldAndCheckCorrect(p, m);
            } else {
                if (p > 25)
                    alert('Генерация поля и построение матриц может занять некоторое время, пожалуйста, подождите!');
                constructFieldAndCheckCorrect(p);
            }
    }

});