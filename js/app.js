var dragControls,
    drawControls;

require(['joint',
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

        var drawGraph = new joint.dia.Graph;
        drawGraph.current_id = 0;
        drawGraph.max_id = 100;

        // 0 init fields
        init.initFields();

        // 1 init dragging
        dragControls = drag.init(joint, drawGraph);

        // 2 init paper for drawing
        drawControls = paper.init(joint, drawGraph);

        // 3 init paper events for selectable (resizing, deleting)
        editable.init(joint, drawControls.graph, drawControls.paper);

        // 4 init controls
        init.initControls(dragControls.graph, dragControls.paper, shapeHtml);

        // 5 api
        api.init(drawControls.graph, drawControls.paper);
    });


//dragControls.graph.on('all', function(eventName, cell) {
//    console.log(arguments);
//});
//drawGraph.on('all', function(eventName, cell) {
//    console.log(arguments);
//});

