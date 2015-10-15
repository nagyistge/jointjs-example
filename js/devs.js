var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 1000,
    height: 400,
    gridSize: 1,
    model: graph,
    snapLinks: true,
    embeddingMode: true,
    validateEmbedding: function(childView, parentView) {
        return parentView.model instanceof joint.shapes.devs.Coupled;
    },
    validateConnection: function(sourceView, sourceMagnet, targetView, targetMagnet) {
        return sourceMagnet != targetMagnet;
    }
});

var connect = function(source, sourcePort, target, targetPort) {
    var link = new joint.shapes.devs.Link({
        source: { id: source.id, selector: source.getPortSelector(sourcePort) },
        target: { id: target.id, selector: target.getPortSelector(targetPort) }
    });
    link.addTo(graph).reparent();
};

var c1 = new joint.shapes.devs.Coupled({
    position: { x: 260, y: 50 },
    size: { width: 300, height: 300 },
    inPorts: ['in1','in2'],
    outPorts: ['out1','out2'],
    attrs: {
        text: { text: 'Logic' }
    }
});

var a1 = new joint.shapes.devs.Atomic({
    position: { x: 360, y: 160 },
    size: { width: 150, height: 100 },
    inPorts: ['a','b'],
    outPorts: ['x','y'],
    attrs: {
        text: { text: 'AND/NAND' }
    }
});

var in1 = new joint.shapes.devs.Atomic({
    position: { x: 10, y: 70 },
    size: { width: 150, height: 100 },
    outPorts: ['out'],
    attrs: {
        text: { text: 'Joystic' }
    }
});

var in2 = new joint.shapes.devs.Atomic({
    position: { x: 10, y: 200 },
    size: { width: 150, height: 100 },
    outPorts: ['out'],
    attrs: {
        text: { text: 'Stop Button' }
    }
});

var out1 = new joint.shapes.devs.Atomic({
    position: { x: 650, y: 50 },
    size: { width: 140, height: 200 },
    inPorts: ['a','b'],
    attrs: {
        text: { text: 'Actuator' }
    }
});

var out2 = new joint.shapes.devs.Atomic({
    position: { x: 650, y: 300 },
    size: { width: 140, height: 50 },
    inPorts: ['in'],
    attrs: {
        text: { text: 'Led' }
    }
});

graph.addCells([c1, a1, in1, in2, out1, out2]);

c1.embed(a1);

connect(in1,'out',c1,'in1');
connect(in2,'out',c1,'in2');
connect(c1,'in1',a1,'a');
connect(c1,'in2',a1,'b');
connect(a1,'x',c1,'out1');
connect(a1,'y',c1,'out2');
connect(c1,'out1',out1,'a');
connect(c1,'out2',out1,'b');
connect(c1,'out2',out2,'in');

/* rounded corners */
/*
 _.each([c1,a1,a2,a3], function(element) {
 element.attr({ '.body': { 'rx': 6, 'ry': 6 }});
 });
 */
/* custom highlighting */

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

