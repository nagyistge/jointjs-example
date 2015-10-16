var ClickableView = joint.dia.ElementView.extend({
    pointerdown: function () {
        this._click = true;
        joint.dia.ElementView.prototype.pointerdown.apply(this, arguments);
    },
    pointermove: function () {
        this._click = false;
        joint.dia.ElementView.prototype.pointermove.apply(this, arguments);
    },
    pointerup: function (evt, x, y) {
        if (this._click) {
            this.notify('cell:click', evt, x, y);
        } else {
            joint.dia.ElementView.prototype.pointerup.apply(this, arguments);
        }
    }
});

var graphControls = new joint.dia.Graph;
var paperControls = new joint.dia.Paper({
    el: $('#paperControls'),
    width: 1000,
    height: 310,
    model: graphControls,
    gridSize: 1,
    elementView: ClickableView,
    interactive: false
});


var c1 = new joint.shapes.devs.Coupled({
    position: { x: 5, y: 5 },
    size: { width: 300, height: 300 },
    inPorts: ['in1','in2'],
    outPorts: ['out1','out2'],
    attrs: {
        text: { text: 'Logic' }
    }
});

var a1 = new joint.shapes.devs.Atomic({
    position: { x: 325, y: 5 },
    size: { width: 150, height: 100 },
    inPorts: ['a','b'],
    outPorts: ['x','y'],
    attrs: {
        text: { text: 'AND/NAND' }
    }
});

var in1 = new joint.shapes.devs.Atomic({
    position: { x: 325, y: 115 },
    size: { width: 150, height: 100 },
    outPorts: ['out'],
    attrs: {
        text: { text: 'Joystic' }
    }
});

var in2 = new joint.shapes.devs.Atomic({
    position: { x: 490, y: 5 },
    size: { width: 150, height: 100 },
    outPorts: ['out'],
    attrs: {
        text: { text: 'Stop Button' }
    }
});

var out1 = new joint.shapes.devs.Atomic({
    position: { x: 660, y: 5 },
    size: { width: 140, height: 200 },
    inPorts: ['a','b'],
    attrs: {
        text: { text: 'Actuator' }
    }
});

var out2 = new joint.shapes.devs.Atomic({
    position: { x: 490, y: 115 },
    size: { width: 140, height: 50 },
    inPorts: ['in'],
    attrs: {
        text: { text: 'Led' }
    }
});

graphControls.addCells([c1, a1, in1, in2, out1, out2]);

var newElement = null, body = null;

paperControls.on('cell:pointermove',function (cellView, evt, x, y) {
    body.bind('mousemove', function(e){

        console.log('pointermove')
        if (!createdElement) {
            createdElement = $("div.box");
            createdElement.css('visibility', 'visible');
        }

        var mouseX = e.pageX - cellView.model.getBBox().width / 2;
        var mouseY = e.pageY - cellView.model.getBBox().height / 2;
        createdElement.offset({ top: mouseY, left: mouseX });
    });
});

var paperMainJq = null, paperControlsJq = null;

function allowToDragDrop(event){
    if (!event) return false;
    paperMainJq = paperMainJq || $('#paper');

    var offset = paperMainJq.offset();
    var x = event.pageX, y = event.pageY;

    if (x >= offset.left && x <= offset.left + paperMainJq.width()) {
        if (y >= offset.top && y <= offset.top + paperMainJq.height())
            return true;
    }

    return false;
}

function clearDraggedData(){
    if (body){
        body.off('mousemove');
    }

    newElement.remove();
    newElement = null;

    if (createdElement){
        createdElement.remove();
        createdElement = null;
    }

    if (paper3) {
        paper3.remove();
        graph3.clear();
    }
}

paperControls.on('cell:pointerup',function (cellView, evt, x, y) {
    if (!allowToDragDrop(evt)) {
        clearDraggedData();
        return;
    }

    // clear created element
    if (newElement){
        var draggedElement = newElement.clone();
        var bbox = draggedElement.getBBox();
        paperMainJq = paperMainJq || $('#paper');
        paperControlsJq = paperControlsJq || $('#paperControls');

        draggedElement.position(
            evt.clientX - bbox.width / 2 - paperMainJq.offset().left,
            evt.clientY - bbox.height / 2 - paperMainJq.offset().top + document.body.scrollTop);
        graph.addCells([draggedElement]);
        clearDraggedData();
    }
});

var graph3, paper3;
var createdElement;

paperControls.on('cell:pointerdown',function (cellView, evt, x, y) {
    if (newElement) return;
    body = body || $('body');
    body.append('<div id="flyPaper" class="box" style="z-index: 100;display:block;opacity:.7; visibility: hidden"></div>');
    newElement = cellView.model.clone();
    newElement.position(0, 0);

    graph3 = graph3 || new joint.dia.Graph;
    paper3 = new joint.dia.Paper({
        el: $('#flyPaper'),
        width: paperControls.options.width,
        height: paperControls.options.height,
        model: graph3,
        gridSize: 1
    });
    graph3.addCells([newElement]);
});
//
//
//var rect2 = new joint.shapes.basic.Rect({
//    position: { x: 10, y: 50 },
//    size: { width: 100, height: 30 },
//    attrs: { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' } }
//});
//graphControls.addCells([rect2]);
