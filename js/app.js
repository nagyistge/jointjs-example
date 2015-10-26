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
        drawGraph.max_id = 10000;

        // 1 init resizing (it's a bug - init paper after initing controls)
        //var resizeControls =  resize.initResizeControls(joint);

        // 2 init dragging
        dragControls = drag.init(joint, drawGraph);

        // 3 init paper for drawing
        drawControls = paper.init(joint, drawGraph);

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
        }

        function saveToJsonFile() {
            console.log('saved to file:ide.txt')
            var txt = $('#log').val();
            var blob = new Blob([txt], {type: "text/plain;charset=utf-8"});
            window.saveAs(blob, 'ide.txt');
        }

        function getJsonFromServer() {
            function resp(data){
                console.log(data)
            }
            //$.ajax({
            //    type:"GET",
            //    dataType: "jsonp",
            //    url: "http://lug.pp.ciklum.com:8080/api/getMetadata?key=goal3_led?callback=resp",
            //    success: function(data) {
            //       console.log('success', data);
            //    },
            //    error: function(jqXHR, textStatus, errorThrown) {
            //        console.log(jqXHR.status);
            //    },
            //    //jsonp: "resp",
            //
            //    // Tell jQuery we're expecting JSONP
            //});

            //$.getJSON("https://api.github.com/users/mralexgray/repos?callback=?", function(result){
            //    //response data are now in the result variable
            //    alert(result);
            //});


            $.ajax({
                url: "https://api.github.com/users/mralexgray/repos",

                // The name of the callback parameter, as specified by the YQL service
                jsonp: "callback",

                // Tell jQuery we're expecting JSONP
                dataType: "jsonp",

                // Work with the response
                success: function( response ) {
                    console.log( response ); // server response
                }
            });

            //$.getJSON('http://lug.pp.ciklum.com:8080/api/getMetadata?key=goal3_led?callback=?'
            //    , function (data) {
            //    console.log('1st', data);
            //}).success(function (data) {
            //        console.log('success', data)
            //    }).done(function (data) {
            //        console.log('done', data);
            //    }).fail(function (error, e1, e2) {
            //        console.log('error', error, e1, e2);
            //    });


            //
            //$.getJSON('http://lug.pp.ciklum.com:8080/api/getMetadata?key=goal3_led', function (data) {
            //    clearLog();
            //    $('#log').val(data);
            //}).done(function (data) {
            //}).fail(function (error) {
            //    console.log('Error during getting data');
            //});
        }

        function setJsonToServer() {
            console.log('save to server');
        }

        $('#btn_to_json').click(exportToJson);
        $('#btn_from_json').click(exportFromJson);
        $('#btn_clear_log').click(clearLog);
        $('#btn_save_to_json_file').click(saveToJsonFile);
        $('#btn_from_json_server').click(getJsonFromServer);
        $('#btn_to_json_server').click(setJsonToServer);
    });
