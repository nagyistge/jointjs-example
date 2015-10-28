define(['joint'], function (joint) {
    function getCurrentId(graph){
        var elements = graph.getElements();
        if (!graph.current_id) {
            graph.current_id = '0';
        }

        if (elements.length > 0) {
            var ids = elements
                .map(function (x) {
                    return Number.parseInt(x.get('id'));
                })
                .sort();

            graph.current_id = ids[ids.length - 1];
        }

        return graph.current_id;
    }

    function addZero(graph) {
        var zeroStr = "";
        var zeroCount = graph.max_id.toString().length - graph.current_id.toString().length;
        while (zeroCount > 0) {
            zeroStr += "0";
            zeroCount--;
        }

        graph.current_id = zeroStr + graph.current_id;
    }

    function setId(graph, element){
        if (graph.current_id < graph.max_id) {
            graph.current_id++;
        }
        else {
            alert('max count: ' + graph.max_id + ' is riched!')
            return;
        }

        addZero(graph);

        element.set('id', graph.current_id);
        graph.current_id = Number.parseInt(graph.current_id);
    }

    function convertIdeJsonToServerJson(ideJson, graph, paper) {
        var serverJson = '';
        if (!ideJson) return serverJson;

        // rules for filtering json keywords
        var rules = [
            "type", "inPorts", "outPorts", "id",
            {
                "source": ["id", "selector"]
            },
            {
                "target": ["id", "selector"]
            },
            {
                "attrs" : "custom_attrs"
            }
        ];

        // get only names of rule objects
        var keywords = rules.map(function (item) {
            return item instanceof Object ? Object.keys(item)[0] : item;
        });

        // get only invested values
        function getInnerProps(ruleName) {
            var keywords = rules.map(function (item) {
                return item instanceof Object ?
                    (Object.keys(item)[0] === ruleName ? item[Object.keys(item)[0]] : undefined)
                    : undefined;
            });

            return keywords.filter(function (item) {
                return item != undefined;
            })[0];
        }

        var ideObjects = JSON.parse(ideJson);
        var serverObjects = { cells: []};
        var cells = ideObjects.cells;
        var cell, serverCell;

        for(var i = 0; i < cells.length; i++) {

            cell = cells[i];
            serverCell = {};

            // every property of cell
            for(var prop in cell) {
                if (!cell.hasOwnProperty(prop) ||
                    keywords.indexOf(prop) < 0) {
                    continue;
                }

                var innerCell = cell[prop];

                if (prop === 'attrs') {
                    var key = getInnerProps(prop);
                    var custom_attrs = cell[prop][key];
                    if (custom_attrs) {
                        serverCell[prop] = custom_attrs;
                    }
                    continue;
                }

                // get text instead of type (text we could setup)
                if (prop === 'type' && cell['attrs']['text']) {
                    serverCell[prop] = cell['attrs']['text']['text'];
                    continue;
                }

                // find by selector port name
                if ((~['source', 'target'].indexOf(prop)) && cell['type'] === 'link') {
                    var id = cell[prop].id;
                    var selector = cell[prop].selector;
                    var model = paper.getModelById(id);
                    var view = paper.findViewByModel(model);
                    var port = view.$el.find(selector);
                    var value = port.attr('port');
                    serverCell[prop] = {
                        id:id,
                        selector:value
                    };
                    continue;
                }

                if (!(innerCell instanceof Object)) {
                    serverCell[prop] = cell[prop];
                }
                else {
                    var innerProps = getInnerProps(prop);
                    // take full  value (example "outPorts")
                    if (!innerProps || innerProps.length == 0) {
                        serverCell[prop] = innerCell;
                    }
                    // filter by rules
                    else {
                        for (var innerProp in innerCell) {
                            if (!innerCell.hasOwnProperty(innerProp) ||
                                innerProps.indexOf(innerProp) < 0) {
                                continue;
                            }

                            if (!(prop in serverCell)) {
                                serverCell[prop] = {};
                            }

                            serverCell[prop][innerProp] = innerCell[innerProp];
                        }
                    }
                }
            }

            if (!~Object.keys(serverCell).indexOf('attrs')) {
                serverCell['attrs'] = {};
            }

            serverObjects.cells.push(serverCell);
        }

        serverJson = JSON.stringify(serverObjects, null, 4);
        return serverJson;
    }

    return {
        getCurrentId: getCurrentId,
        setId: setId,
        convertIdeJsonToServerJson: convertIdeJsonToServerJson
    }
});
