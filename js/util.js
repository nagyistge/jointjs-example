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

        console.log(graph.current_id);
        element.set('id', graph.current_id);
        graph.current_id = Number.parseInt(graph.current_id);
        console.log(graph.current_id);
    }

    return {
        getCurrentId: getCurrentId,
        setId: setId
    }
});