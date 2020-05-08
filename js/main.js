$('input[type=radio][name=type-field]').change(function() {
    if ($(this).val() == "gfpm") {
        $('#m').removeClass('d-none');
        $('#generate-btn').addClass('d-none');
    } else {
        $('#m').addClass('d-none');
    }
});

$('input.parametr-field').keyup(function() {
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
    var m = 0;

    if ($('input[type=radio][name=type-field]:checked').val() == "gfp") {

        p = Number($("#p").val());

        if (Number.isInteger(p)) {
            if (p == 0) {
                alert('Параметры поля должны быть больше нуля!');
            } else if (p == 1) {
                alert('Параметры поля должны быть больше единицы!');
            } else {
                oCalculator = FiniteFieldCalculator(p);
            }
        } else {
            alert('Параметры поля должны быть целыми числами!');
        }

    }

    if ($('input[type=radio][name=type-field]:checked').val() == "gfpm") {
        p = Number($("#p").val());
        m = Number($("#m").val());

        if (Number.isInteger(p) && Number.isInteger(m)) {
            if (p == 0 || m == 0) {
                alert('Параметры поля должны быть больше нуля!');
            } else if (p == 1 || m == 1) {
                alert('Параметры поля должны быть больше единицы!');
            } else {
                oCalculator = FiniteFieldCalculator(p, m);
            }
        } else {
            alert('Параметры поля должны быть целыми числами!');
        }
    }

    console.log(oCalculator);

    // console.log(oCalculator.getViewsForField());
    // console.log('=================================================================================');



});