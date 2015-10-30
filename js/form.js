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

        form.append('<span> Custom attributes (enter valid json):<br></span>')
        form.append($text_input)
        form.append('<br><input type="submit" value="Submit">');

        // 3 saving
        form.find('input[type=submit]').click(function () {
            try {
                var attrs = JSON.parse($text_input.val());
                var attrsKey = Object.keys(attrs);
                var attrsOld = localCellView.model.attr('custom_attrs');
                var attrsDeleted = Object.keys(attrsOld).filter(function (item) {
                    return !~attrsKey.indexOf(item);
                });

                attrsDeleted.forEach(function (item) {
                    localCellView.model.removeAttr('custom_attrs/' + item);
                });
            }
            catch(ex) {
                alert('not valid json:' + ex);
                return;
            }
            localCellView.model.attr('custom_attrs', attrs);
            localCellView = null;
            form.empty();
        });

        // 4 hide form
        form.blur(function () {
            form.empty();
        });
    }

    function hideForm() {
        var form = $('form');
        if (!form.find('input, textarea').is(':focus')) {
            form.empty();
        }
    }

    return {
        addFormControls: addFormControls,
        hideForm: hideForm
    }
});
