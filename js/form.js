define(['joint'], function (joint) {

    function addFormControls(lastCellView) {
        // 1 check if exist selected element
        if (!lastCellView) return;
        var localCellView = lastCellView;

        // 2 creating dynamic form elements
        var form = $('form');
        form.empty();
        var input = '<input type="text" value="' + localCellView.model.attr('text/text')+ '">';
        var $text_input = $(input);

        form.append('<div id="form_header">Element attributes</div>');
        form.append('Text:<br>')
        form.append($text_input)
        form.append('<br><input type="submit" value="Submit">');

        form.find('input[type=submit]').click(function () {
            console.log('saved');
            localCellView.model.attr('text/text', $text_input.val());
            localCellView = null;
            form.empty();
        });
    }

    return {
        addFormControls: addFormControls
    }
});