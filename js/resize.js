define(['jquery',
        'lodash',
        'joint',
        'jquery_ui',
        'style!layout_vendor/jquery-ui-1.10.4.custom',
        'style!layout/html'],
    function ($, _, joint, $ui) {
        return function () {
            var graph = new joint.dia.Graph;

            joint.shapes.html = {};
            joint.shapes.html.BoxResize = joint.shapes.basic.Rect.extend({
                defaults: joint.util.deepSupplement({
                    type: 'html.BoxResize',
                    attrs: {
                        rect: {
                            stroke: 'none',
                            'fill-opacity': 0
                        }
                    }
                }, joint.shapes.basic.Rect.prototype.defaults)
            });

            joint.shapes.html.BoxResizeView = joint.dia.ElementView.extend({

                template: [
                    '<div id="resizable" class="ui-widget-content">',
                    '<h3>Resizable</h3>',
                    '</div>'
                ].join(''),

                initialize: function () {
                    _.bindAll(this, 'updateBox');
                    joint.dia.ElementView.prototype.initialize.apply(this, arguments);

                    this.$box = $(_.template(this.template)());

                    this.model.on('change', this.updateBox, this);
                    this.model.on('remove', this.removeBox, this);
                    this.updateBox();
                },
                render: function () {
                    joint.dia.ElementView.prototype.render.apply(this, arguments);
                    this.paper.$el.prepend(this.$box);
                    this.updateBox();
                    return this;
                },
                updateBox: function () {
                    var bbox = this.model.getBBox();
                    this.$box.css({
                        width: bbox.width,
                        height: bbox.height,
                        left: bbox.x,
                        top: bbox.y,
                        transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)'
                    });
                }
            });

            var paper = new joint.dia.Paper({
                el: $('#paper'),
                width: 650,
                height: 400,
                gridSize: 1,
                model: graph
            });

            paper.on('cell:pointerdown', function (cellView, evt, x, y) {
                resizingAllow = true;
            });

            paper.on('cell:pointermove', function (cellView, evt, x, y) {
                resizingAllow = false;
            });

            paper.on('cell:pointerup', function (cellView, evt, x, y) {
                showSizing(cellView);
            });

            var container,
                resizingAllow = false,  // allow to show resize border, when click (not moved) on element
                resizingMoved = false,  // started resizing
                resizingStopped = false,// stopped resizing
                lastCellView = null;    // current resize element

            function showSizing(cellView) {
                container = container || $("#resizable");
                if (!resizingAllow) return;
                if (container.hasClass('box')) return;

                lastCellView = cellView;
                container.addClass('box');
                container.resizable({
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
                        if (lastCellView != null) lastCellView.model.resize(container.width(), container.height());
                    }
                });

                $('.ui-resizable-handle').css('pointer-events', 'auto');
            }

            function hideSizing() {
                container = container || $("#resizable");

                function clearResizing() {
                    container.removeClass('box');
                    container.resizable('destroy');
                    $('.ui-resizable-handle').css('pointer-events', 'none');
                    lastCellView = null;
                }

                // 1. Stop resizing
                if (container.hasClass('box') && resizingStopped) {
                    clearResizing();
                    resizingStopped = false;
                    return;
                }

                // 2. Click outside resizing and not move resizing
                if (container.hasClass('box') && !resizingMoved) {
                    clearResizing();
                    resizingMoved = false;
                    return;
                }
            }

            paper.on('blank:pointerup', function (evt, x, y) {
                hideSizing();
            });

            var el2 = new joint.shapes.html.BoxResize({
                    position: {
                        x: 70,
                        y: 160
                    },
                    size: {
                        width: 170,
                        height: 100
                    }
                }
            );

            graph.addCells([el2]);
        }
    });
