//require(['resize'], function (resize) {
//    //init.initControls(drag.graphControls);
//    //init.initMainControls(devs.graph);
//    resize();
//});


require(['joint',
        'style!layout_vendor/joint.css',
        'resize',
        'drag',
        'paper',
        'joint.shapes.html',
        'init',
        'style!layout/devs',
        'style!layout/custom'],
    function (joint,
              css_join,
              resize,
              drag,
              paper,
              shapeHtml,
              init) {
        console.log('starting');
        var graphDrawing = new joint.dia.Graph;

        // 1 init resizing (it's a bug - init paper after initing controls)
        //var resizeControls =  resize.initResizeControls(joint);

        // 2 init dragging
        var dragControls = drag.init(joint, graphDrawing);

        // 3 init paper for drawing
        var drawControls = paper.init(joint, graphDrawing);

        // 4 init paper events for resizing
        resize.init(joint, drawControls.graph, drawControls.paper);

        // 5 init controls
        init.initControls(dragControls.graph, dragControls.paper, shapeHtml);

        // - init all controls shema for visual testing
        //init.initMainControls(devs.graph);
    });
