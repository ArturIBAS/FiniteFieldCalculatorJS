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

function constructFieldMatrixOperationAndShow(oCalculator) {
    // console.log(oCalculator.getViewForMatrixOperation("+"));
    console.log(oCalculator.getViewForMatrixOperation("-"));
    // console.log(oCalculator.getViewForMatrixOperation("*"));
    // console.log(oCalculator.getViewForMatrixOperation("/"));
}

function constructFieldAndCheckCorrect(p, m = NaN) {

    var oCalculator = null;
    var sFlagCorrectField = 'success';
    var irreduciblePolynom = null;

    var oIrreduciblePolynomsForSelect = null;

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

    var oCalculator = null;
    var p = 0;
    var m = NaN;

    var aParams = [];

    var sFlagValidateParams = '';

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
            if ($('input[type=radio][name=type-field]:checked').val() == "gfpm")
                constructFieldAndCheckCorrect(p, m);
            else constructFieldAndCheckCorrect(p);
    }

});