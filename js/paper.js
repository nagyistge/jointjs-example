define(function () {

    function initControls(joint, graph) {
        var paper = new joint.dia.Paper({
            el: $('#paper'),
            width: 1000,
            height: 400,
            gridSize: 1,
            defaultLink: new joint.dia.Link({
                attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
            }),
            model: graph,
            snapLinks: true,
            embeddingMode: true,
            validateEmbedding: function(childView, parentView) {
                return parentView.model instanceof joint.shapes.devs.Coupled;
            },
            validateConnection: function(sourceView, sourceMagnet, targetView, targetMagnet) {
                return sourceMagnet != targetMagnet;
            },
            markAvailable: true
        });

        /* rounded corners */
        /*
         _.each([c1,a1,a2,a3], function(element) {
         element.attr({ '.body': { 'rx': 6, 'ry': 6 }});
         });
         */
        /* custom highlighting */

        var V = joint.V;
        var highlighter = V('circle', {
            'r': 14,
            'stroke': '#ff7e5d',
            'stroke-width': '6px',
            'fill': 'transparent',
            'pointer-events': 'none'
        });

        paper.off('cell:highlight cell:unhighlight').on({

            'cell:highlight': function(cellView, el, opt) {

                if (opt.embedding) {
                    V(el).addClass('highlighted-parent');
                }

                if (opt.connecting) {
                    var bbox = V(el).bbox(false, paper.viewport);
                    highlighter.translate(bbox.x + 10, bbox.y + 10, { absolute: true });
                    V(paper.viewport).append(highlighter);
                }
            },

            'cell:unhighlight': function(cellView, el, opt) {

                if (opt.embedding) {
                    V(el).removeClass('highlighted-parent');
                }

                if (opt.connecting) {
                    highlighter.remove();
                }
            }
        });

        return {
            graph: graph,
            paper: paper
        };
    }

    return {
        init: initControls
    };

//
//graph.on('all', function(eventName, cell) {
//    console.log(arguments);
//});
//
//paper.on('blank:pointerdown', function(evt, x, y) {
//    //alert('pointerdown on a blank area in the paper.')
//})

});
