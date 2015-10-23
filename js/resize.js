define(['jquery',
        'lodash',
        'jquery_ui',
        'style!layout_vendor/jquery-ui-1.10.4.custom',
        'style!layout/html'],
    function ($, _, $ui) {

        function initPaperEvents(joint, graph, paper) {

            var resizing_box_template = [
                '<div id="resizable" class="ui-widget-content selected-control">',
                '<button class="delete">x</button>',
                '<span>Editable</span>',
                '</div>'
            ].join('');

            function setResizible(cellView, paper) {
                // 0 remember last clicked for sizing cell
                lastCellView = cellView;

                // 1 set dotted border for svg control
                joint.V(cellView.$el.find('.body')[0]).addClass('resize-box');

                // 2 add html layout for resizing
                cellView.$htmlBox = $(_.template(resizing_box_template)());
                paper.$el.prepend(cellView.$htmlBox);

                function updateResizingBox() {
                    var bbox = cellView.model.getBBox();
                    cellView.$htmlBox.css({
                        width: bbox.width,
                        height: bbox.height,
                        left: bbox.x,
                        top: bbox.y,
                        transform: 'rotate(' + (cellView.model.get('angle') || 0) + 'deg)'
                    });
                }
                updateResizingBox();

                // 3 activate resizing
                resizingBox = $('#resizable');
                resizingBox.resizable({
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
                            var width = resizingBox.width();
                            var height = resizingBox.height();
                            lastCellView.model.resize(width, height);
                        }
                    }
                });

                // 4 modify position box by model
                cellView.model.on('change', updateResizingBox, cellView);
                cellView.model.on('remove', setUnResizible);

                // 4 delete button
                cellView.$htmlBox.find('.delete').on('click', function () {
                    cellView.model.remove();
                    setUnResizible();
                });

                $('.ui-resizable-handle').css('pointer-events', 'auto');
            }

            function setUnResizible(){
                if (!resizingBox) return;
                //joint.V(lastCellView.$el.find('.body')[0]).removeClass('resize-box');
                resizingBox.resizable('destroy');
                resizingBox.remove();
                resizingBox = null;
                lastCellView = null;

                $('.ui-resizable-handle').css('pointer-events', 'none');
            }

            function isResizible(cellView){
                return cellView === lastCellView;
                //return joint.V(cellView.$el.find('.body')[0]).hasClass('resize-box');
            }

            paper = paper || new joint.dia.Paper({
                    el: $('#paper'),
                    width: 650,
                    height: 400,
                    gridSize: 1,
                    model: graph
                });

            var resizingBox = null,
                resizingAllow = false,  // allow to show resize border, when click (not moved) on element
                resizingMoved = false,  // started resizing
                resizingStopped = false,// stopped resizing
                lastCellView = null;    // current resize element

            function showSizing(cellView) {
                if (!resizingAllow) return;
                if (isResizible(cellView)) return;
                setResizible(cellView, paper);
            }

            function hideSizing(event) {
                if (!lastCellView) return;

                var offset = resizingBox.offset();
                var x = event.pageX, y = event.pageY;

                if (x >= offset.left && x <= offset.left + resizingBox.width()) {
                    if (y >= offset.top && y <= offset.top + resizingBox.height())
                        return;
                }

                // 1. Stop resizing
                if (isResizible(lastCellView) && resizingStopped) {
                    setUnResizible(lastCellView);
                    resizingStopped = false;
                    return;
                }

                // 2. Click outside resizing and not move resizing
                if (isResizible(lastCellView) && !resizingMoved) {
                    setUnResizible(lastCellView);
                    resizingMoved = false;
                    return;
                }
            }

            paper.on('cell:pointerdown', function (cellView, evt, x, y) { resizingAllow = true; });
            paper.on('cell:pointermove', function (cellView, evt, x, y) { resizingAllow = false; });
            paper.on('cell:pointerup', function (cellView, evt, x, y) {
                showSizing(cellView);
            });
            paper.on('blank:pointerup', function (evt, x, y) { hideSizing(evt); });
        }

        return {
            init: initPaperEvents
        };
    });
