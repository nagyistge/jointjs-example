define(['joint'], function (joint) {

    function addFormControls(lastCellView) {
        // 1 check if exist selected element
        if (!lastCellView) return;
        var localCellView = lastCellView;

        // 2 creating dynamic form elements
        var form = $('form');
        form.empty();

        var input = '<textarea id="attrs" type="text"></textarea>';
        var $text_input = $(input);
        $text_input.val(JSON.stringify(localCellView.model.attr('custom_attrs'), null, 4));

        form.append('<span> Custom attributes:<br></span>')
        form.append($text_input)
        form.append('<br><input type="submit" value="Submit">');

        // 3 saving
        form.find('input[type=submit]').click(function () {
            localCellView.model.attr('custom_attrs', JSON.parse($text_input.val()));
            localCellView = null;
            form.empty();
        });

        // 4 hide form
        $('#attrs').blur(function () {
            var form = $('form');
            form.empty();
        });
    }

    function hideForm() {
        if (!$('#attrs').is(":focus")) {
            var form = $('form');
            form.empty();
        }
    }

    return {
        addFormControls: addFormControls,
        hideForm: hideForm
    }
});
