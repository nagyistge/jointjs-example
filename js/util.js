define(['joint'], function (joint) {
    function getCurrentId(graph){
        var elements = graph.getElements();
        if (!graph.currentId) {
            graph.currentId = '0';
        }

        if (elements.length > 0) {
            var ids = elements
                .map(function (x) {
                    return Number.parseInt(x.get('id'));
                })
                .sort();

            graph.currentId = ids[ids.length - 1];
        }

        return graph.currentId;
    }

    function addZero(graph) {
        var zeroStr = "";
        var zeroCount = graph.maxId.toString().length - graph.currentId.toString().length;
        while (zeroCount > 0) {
            zeroStr += "0";
            zeroCount--;
        }

        graph.currentId = zeroStr + graph.currentId;
    }

    function setId(graph, element){
        if (graph.currentId < graph.maxId) {
            graph.currentId++;
        }
        else {
            alert('max count: ' + graph.maxId + ' is riched!')
            return;
        }

        addZero(graph);

        element.set('id', graph.currentId);
        graph.currentId = Number.parseInt(graph.currentId);
    }

    function isPaperEmpty(paper) {
        return !paper._views || Object.keys(paper._views).length <= 0;
    }

    function convertIdeJsonToServerJson(json, paper) {
        // 0 init
        var serverObjects = { cells: []};
        var serverJson = JSON.stringify(serverObjects, null, 4);

        // 1 check if empty
        if (!json) return serverJson;
        if (isPaperEmpty(paper)) {
            console.log('Can not convert ide json to server json because of paper (no visual elements) is empty!')
            return serverJson;
        }

        // 2 set rules for filtering json keywords
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

        var ideObjects = JSON.parse(json);
        var cells = ideObjects.cells;
        var cell,
            serverCell;

        // 3 start loop by cell
        for(var i = 0; i < cells.length; i++) {

            cell = cells[i];
            serverCell = {};

            // loop by property of cell
            for(var prop in cell) {
                if (!cell.hasOwnProperty(prop) ||
                    keywords.indexOf(prop) < 0) {
                    continue;
                }

                var innerCell = cell[prop];

                // 4 if found attrts => get custom_attrs if exists
                if (prop === 'attrs') {
                    var key = getInnerProps(prop);
                    var customAttrs = cell[prop][key];
                    if (customAttrs) {
                        serverCell[prop] = customAttrs;
                    }
                    continue;
                }

                // 5 if found type => get text (text we could setup)
                if (prop === 'type' && cell['attrs']['text']) {
                    serverCell[prop] = cell['attrs']['text']['text'];
                    continue;
                }

                // 6 if found type = link => get port by selector
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

                // 7 simple property (not object)
                if (!(innerCell instanceof Object)) {
                    // instead of link => Link
                    serverCell[prop]  = cell[prop] === 'link' ? 'Link' : cell[prop];
                }
                // 8 property object (dict)
                else {
                    var innerProps = getInnerProps(prop);
                    // 9 if not exists rule => get full value (example "outPorts")
                    if (!innerProps || innerProps.length == 0) {
                        serverCell[prop] = innerCell;
                    }
                    // 10 if exists rule => filtering
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

            // 11 if not created attrs => add empty default value
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
