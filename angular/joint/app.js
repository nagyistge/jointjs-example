var dragControls,
    drawControls;

define(['joint',
        'style!layout_vendor/joint.css',
        'util',
        'editable',
        'drag',
        'paper',
        'joint.shapes.html',
        'init',
        'api',
        'style!layout/devs'
    ],
    function (joint,
              css_join,
              util,
              editable,
              drag,
              paper,
              shapeHtml,
              init,
              api) {

	    function initJoint() {
			var drawGraph = new joint.dia.Graph;
			drawGraph.currentId = 0;
			drawGraph.maxId = 100;

			// 0 init fields
			init.initFields();

			// 2 init paper for drawing
			drawControls = paper.init(joint, drawGraph);

			// 1 init dragging
			dragControls = drag.init(joint, drawGraph, drawControls.paper);

			// 3 init paper events for selectable (resizing, deleting)
			editable.init(joint, drawControls.graph, drawControls.paper);

			// 4 init controls
			init.initControls(dragControls.graph, dragControls.paper, shapeHtml);

			// 5 api
			api.init(drawControls.graph, drawControls.paper);
	    }

	    return {
		    initJoint: initJoint
	    }
    }
);


//dragControls.graph.on('all', function(eventName, cell) {
//    console.log(arguments);
//});
//drawGraph.on('all', function(eventName, cell) {
//    console.log(arguments);
//});

