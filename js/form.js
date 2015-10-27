define(['joint'], function (joint) {

    function addFormControls(lastCellView) {
        // 1 check if exist selected element
        if (!lastCellView) return;
        var localCellView = lastCellView;

        // 2 creating dynamic form elements
        var form = $('form');
        form.empty();

        console.log(JSON.stringify(localCellView.model.attr('custom_attrs')));
        var input = '<textarea type="text"></textarea>';
        var $text_input = $(input);
        $text_input.val(JSON.stringify(localCellView.model.attr('custom_attrs')));

        form.append('<span> Custom attributes:<br></span>')
        form.append($text_input)
        form.append('<br><input type="submit" value="Submit">');

        form.find('input[type=submit]').click(function () {
            console.log('saved');
            localCellView.model.attr('custom_attrs', JSON.parse($text_input.val()));
            localCellView = null;
            form.empty();
        });
    }

    return {
        addFormControls: addFormControls
    }
});
