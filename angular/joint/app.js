var dragControls,
    drawControls;

define(['joint',
        'style!layout_vendor/joint.css',
        'util',
        'editable',
        'drag',
        'paper',
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
              init,
              api) {

	    function initJoint() {
			// 0 init buttons
			init.initButtons();

			// 2 init paper for drawing
			drawControls = paper.init(joint);

			// 1 init dragging
			dragControls = drag.init(joint, drawControls.graph, drawControls.paper);

			// 3 init paper events for selectable (resizing, deleting)
			editable.init(joint, drawControls.graph, drawControls.paper);

			// 4 init controls
			init.initControls(dragControls.graph, dragControls.paper, drawControls.graph, drawControls.paper);

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

