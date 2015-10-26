var dragControls,
    drawControls;

require(['joint',
        'style!layout_vendor/joint.css',
        'resize',
        'drag',
        'paper',
        'joint.shapes.html',
        'init',
        'style!layout/devs',
        'style!layout/custom',
        ],
    function (joint,
              css_join,
              resize,
              drag,
              paper,
              shapeHtml,
              init) {
        var graphDrawing = new joint.dia.Graph;

        // 1 init resizing (it's a bug - init paper after initing controls)
        //var resizeControls =  resize.initResizeControls(joint);

        // 2 init dragging
        dragControls = drag.init(joint, graphDrawing);

        // 3 init paper for drawing
        drawControls = paper.init(joint, graphDrawing);

        // 4 init paper events for resizing
        resize.init(joint, drawControls.graph, drawControls.paper);

        // 5 init controls
        init.initControls(dragControls.graph, dragControls.paper, shapeHtml);

        // - init all controls shema for visual testing
        //init.initMainControls(devs.graph);

    });

require(['joint', 'fs'], function (joint) {

    $('#log_btn_to_json').click(function () {
        var json_str = JSON.stringify(drawControls.graph, null, 4);
        $('#log').val(json_str);
    });

    $('#clear_log_btn').click(function () {
        $('#log').val('');
    });

    $('#save_btn_to_json_file').click(function () {
        console.log('saved to file:ide.txt')
        var txt = $('#log').val();
        var blob = new Blob([txt], {type: "text/plain;charset=utf-8"});
        window.saveAs(blob, 'ide.txt');
    });

    $('#log_btn_from_json_file').click(function () {
        var txt = $('#log').val();
        if (!txt) {
            console.log('empty log field. Please insert JSON in log!');
            return;
        }

        drawControls.graph.fromJSON(JSON.parse(txt));
    });
});
