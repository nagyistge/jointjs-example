define(['jquery',
        'lodash',
        'jquery_ui',
        'style!layout_vendor/jquery-ui-1.10.4.custom',
        'style!layout/html'],
    function ($, _, $ui) {

        function initPaperEvents(joint, graph, paper) {

            var delete_button_template = '<button class="delete">x</button>';

            var resizing_box_body_template = [
                delete_button_template,
                '<span>Editable</span>'
            ].join('');

            var resizing_box_template = [
                '<div id="resizable" class="ui-widget-content selected-control">',
                resizing_box_body_template,
                '</div>'
            ].join('');

            var resizing_box_wrappper_template = [
                '<div id="resizable" class="ui-widget-content selected-control">',
                '</div>'
            ].join('');

            function updateResizingBox() {
                if (!lastCellView) return;

                var bbox = lastCellView.model.getBBox();
                lastCellView.$htmlBox.css({
                    width: bbox.width,
                    height: bbox.height,
                    left: bbox.x,
                    top: bbox.y,
                    transform: 'rotate(' + (lastCellView.model.get('angle') || 0) + 'deg)'
                });
            }

            function isHtmlInSVG(){
                return lastCellView.$htmlBox && lastCellView.$htmlBox[0].innerHTML !== resizing_box_body_template;
            }

            /*
                Set selected style for current SVG element.
                If it doest not have own html element it will be resizible,
                else it only will be available to delete
             */
            function addExtraProperties(cellView, paper) {
                // 0 remember last clicked for sizing cell
                if (lastCellView) deleteExtraProperties();
                lastCellView = cellView;

                // 2 add html layout for resizing
                // 2.1 if htmlElement inside SVG
                if (isHtmlInSVG()) {
                    lastCellView.$htmlBox.css('position', 'static');
                    lastCellView.$htmlBox.wrap($(resizing_box_wrappper_template));
                    lastCellView.$htmlBox = cellView.$htmlBox.parent();
                    lastCellView.$htmlBox.prepend($(delete_button_template));
                    lastCellView.htmlElement= true;
                }
                // 2.2 SVG element
                else {
                    lastCellView.$htmlBox = $(_.template(resizing_box_template)());
                    paper.$el.prepend(cellView.$htmlBox);
                }

                updateResizingBox(lastCellView);

                // 3 delete button
                lastCellView.$htmlBox.find('.delete').on('click', function () {
                    cellView.model.remove();
                    deleteExtraProperties(true);
                });

                // 4 activate resizing
                if (lastCellView.htmlElement) return;

                lastCellView.$htmlBox.resizable({
                    start: function (e, ui) {
                        resizingMoved = false;
                        resizingStopped = false;
                    },
                    resize: function (e, ui) {
                        resizingStopped = false;
                        resizingMoved = true;
                    },
                    stop: function (e, ui) {
                        resizingMoved = false;
                        resizingStopped = true;
                        if (lastCellView != null) {
                            var width = lastCellView.$htmlBox.width();
                            var height = lastCellView.$htmlBox.height();
                            lastCellView.model.resize(width, height);
                        }
                    }
                });

                // 5 modify position box by model
                lastCellView.model.on('change', updateResizingBox, lastCellView);
                lastCellView.model.on('remove', deleteExtraProperties);

                $('.ui-resizable-handle').css('pointer-events', 'auto');
            }

            /*
                Disable selected style for last selected SVG element.
                Disable resizible style and delete button.
             */
            function deleteExtraProperties(isDeleted){
                if (!lastCellView || !lastCellView.$htmlBox) return;

                // 1 if was htmlElement in SVG
                if (lastCellView.htmlElement) {
                    // 1.1 remove delete button
                    var children = $(lastCellView.$htmlBox.children());
                    var deleteButton = children[0];
                    var htmlElement = $(children[1]);
                    deleteButton.remove();

                    // 1.2 remove html if deleted
                    if (isDeleted) {
                        lastCellView.$htmlBox.remove();
                        lastCellView.$htmlBox = null;
                    }
                    // 1.3 unwrap html if not selected
                    else {
                        htmlElement.unwrap();
                        lastCellView.$htmlBox = htmlElement;
                        lastCellView.$htmlBox.css('position', 'absolute');
                        updateResizingBox();
                    }
                }
                // 2 if was SVG element
                else {
                    lastCellView.$htmlBox.resizable('destroy');
                    lastCellView.$htmlBox.remove();
                    lastCellView.$htmlBox = null;
                }

                lastCellView = null;
                $('.ui-resizable-handle').css('pointer-events', 'none');
            }

            var resizingAllow = false,  // allow to show resize border, when click (not moved) on element
                resizingMoved = false,  // started resizing
                resizingStopped = false,// stopped resizing
                lastCellView = null;    // current resize element

            function editibleOn(cellView) {
                if (!resizingAllow) return;
                if (cellView === lastCellView) return;
                addExtraProperties(cellView, paper);
            }

            function editibleOff(event) {
                if (!lastCellView) return;

                var offset = lastCellView.$htmlBox.offset();
                var x = event.pageX, y = event.pageY;

                if (x >= offset.left && x <= offset.left + lastCellView.$htmlBox.width()) {
                    if (y >= offset.top && y <= offset.top + lastCellView.$htmlBox.height())
                        return;
                }

                // 1. Stop resizing
                if (resizingStopped) {
                    deleteExtraProperties();
                    resizingStopped = false;
                    return;
                }

                // 2. Click outside resizing and not move resizing
                if (!resizingMoved) {
                    deleteExtraProperties();
                    resizingMoved = false;
                    return;
                }
            }

            paper = paper || new joint.dia.Paper({
                    el: $('#paper'),
                    width: 650,
                    height: 400,
                    gridSize: 1,
                    model: graph
                });

            paper.on('cell:pointerdown', function (cellView, evt, x, y) { resizingAllow = true; });
            paper.on('cell:pointermove', function (cellView, evt, x, y) { resizingAllow = false; });
            paper.on('cell:pointerup', function (cellView, evt, x, y) {
                editibleOn(cellView);
            });
            paper.on('blank:pointerup', function (evt, x, y) { editibleOff(evt); });
        }

        return {
            init: initPaperEvents
        };
    });
