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
        'style!layout/devs',
        'style!layout/custom'
    ],
    function (joint,
              css_join,
              util,
              editable,
              drag,
              paper,
              shapeHtml,
              init) {

        var drawGraph = new joint.dia.Graph;
        drawGraph.current_id = 0;
        drawGraph.max_id = 100;

        // 1 init resizing (it's a bug - init paper after initing controls)
        //var resizeControls =  resize.initResizeControls(joint);

        // 2 init dragging
        dragControls = drag.init(joint, drawGraph);

        // 3 init paper for drawing
        drawControls = paper.init(joint, drawGraph);


        //dragControls.graph.on('all', function(eventName, cell) {
        //    console.log(arguments);
        //});
        //drawGraph.on('all', function(eventName, cell) {
        //    console.log(arguments);
        //});

        // 4 init paper events for resizing
        editable.init(joint, drawControls.graph, drawControls.paper);

        // 5 init controls
        init.initControls(dragControls.graph, dragControls.paper, shapeHtml);

        // - init all controls shema for visual testing
        //init.initMainControls(devs.graph);
    });

require(['joint', 'fs', 'util'],
    function (joint, fs, util) {

        function exportToJson() {
            var json_str = JSON.stringify(drawControls.graph, null, 4);
            $('#log').val(json_str);
        }

        function exportFromJson() {
            var txt = $('#log').val();
            if (!txt) {
                console.log('empty log field. Please insert JSON in log!');
                return;
            }

            drawControls.graph.fromJSON(JSON.parse(txt));
            util.getCurrentId(drawControls.graph);
        }

        function clearLog() {
            $('#log').val('');
            $('#server_log').val('');
        }

        function saveToJsonFile() {
            console.log('saved to file:ide.txt')
            var txt = $('#log').val();
            var blob = new Blob([txt], {type: "text/plain;charset=utf-8"});
            window.saveAs(blob, 'ide.txt');
        }

        function getJsonFromServer() {
            $.ajax({
                url: "http://localhost:8888/getMetaData?key=goal3_led",
                //url: "http://lug.pp.ciklum.com:8080/api/getMetadata?key=goal3_led",
                // The name of the callback parameter, as specified by the YQL service
                jsonp: "callback",

                // Tell jQuery we're expecting JSONP
                dataType: "jsonp",

                // Work with the response
                success: function(response) {
                    $('#server_log').val('');
                    $('#server_log').val(JSON.stringify(response, null, 4));
                }
            });
        }

        function convertToServerJson() {
            var ideJson = $('#log').val();
            var serverJson = util.convertIdeJsonToServerJson(ideJson, drawControls.graph, drawControls.paper);
            $('#server_log').val(serverJson);
        }

        function sendJsonToServer() {
            var serverJson = $('#server_log').val();

            if (!serverJson) {
                serverJson = JSON.stringify(drawControls.graph, null, 4);
                serverJson = util.convertIdeJsonToServerJson(serverJson, drawControls.graph, drawControls.paper);
            }

            $('#server_log').val(serverJson);
            serverJson = JSON.stringify(JSON.parse(serverJson))
            var data = [{"key":"ide_test","metaData":serverJson}];

            $.ajax({
                type: "POST",
                url: 'http://localhost:8888/setMetaData',
                data: data,
                crossDomain: true,
                success: function (response) {
                    console.log('sent data, response:', response);
                },
                dataType: 'json'
            });
        }

        $('#btn_to_json').click(exportToJson);
        $('#btn_from_json').click(exportFromJson);
        $('#btn_clear_log').click(clearLog);
        $('#btn_save_to_json_file').click(saveToJsonFile);
        $('#btn_from_json_server').click(getJsonFromServer);
        $('#btn_to_json_server').click(convertToServerJson);
        $('#btn_to_json_server_send').click(sendJsonToServer);
    });
