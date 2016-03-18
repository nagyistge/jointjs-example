define([ 'joint' ], function (joint) {

	var V = joint.V;
	var currentId = 0;

	function setId(graph, element) {
		var MAX_NUMBER = 100000000;

		function addZero(graph) {
			var zeroStr = "";
			var zeroCount = MAX_NUMBER.toString().length - currentId.toString().length;
			while (zeroCount > 0) {
				zeroStr += "0";
				zeroCount--;
			}

			currentId = zeroStr + currentId;
		}

		if (currentId < MAX_NUMBER) {
			currentId++;
		}
		else {
			console.error('max count: ' + MAX_NUMBER + ' is riched!')
			return;
		}

		addZero(graph);

		element.set('id', currentId);
		element.set('uuid', joint.util.uuid());
		currentId = Number.parseInt(currentId);
	}

	function isPaperEmpty(paper) {
		return !paper._views || Object.keys(paper._views).length <= 0;
	}
	
	function showAllElementPorts(graph, paper) {
		var cell,
			model,
			cells = graph.getCells();

		for (var i = 0; i < cells.length; i++) {
			cell = cells[ i ];
			if (cell.isLink()) {
				continue;
			}

			if (cell.attributes.attrs.custom_attrs.isServiceButton) {
				continue;
			}

			model = paper.getModelById(cell.id);
			showElementPorts(paper, model);
		}
	}

	function showHidePortsText(graph, paper) {
		var cell,
			model,
			cells = graph.getCells(),
			queryPort0 = '.devs .outPorts .port0 .port-label',
			queryPort1 = '.devs .outPorts .port1 .port-label';

		for (var i = 0; i < cells.length; i++) {
			cell = cells[ i ];
			if (cell.isLink()) {
				continue;
			}

			if (cell.attributes.attrs.custom_attrs.isServiceButton) {
				continue;
			}

			model = paper.getModelById(cell.id);
			var view = paper.findViewByModel(model);

			if (V(view.el.querySelector(queryPort0)).hasClass('hide')) {
				V(view.el.querySelector(queryPort0)).removeClass('hide');
				V(view.el.querySelector(queryPort1)).removeClass('hide');
			} else {
				V(view.el.querySelector(queryPort0)).addClass('hide');
				V(view.el.querySelector(queryPort1)).addClass('hide');
			}
		}
	}

	function deleteNotConnectedNodes(graph, paper) {
		var cell,
			model,
			links,
			cells = graph.getCells();

		for (var i = 0; i < cells.length; i++) {
			cell = cells[ i ];
			if (cell.isLink()) {
				continue;
			}

			if (cell.attributes.attrs.custom_attrs.isServiceButton) {
				continue;
			}

			model = paper.getModelById(cell.id);
			if (model.attributes.attrs.custom_attrs.isRoot) {
				continue;
			}

			links = graph.getConnectedLinks(model);
			if (!links || links.length === 0) {
				model.remove();
			}
		}
	}

	function paintConnections(graph, paper) {
		var cell,
			cells = graph.getCells();

		for (var i = 0; i < cells.length; i++) {
			cell = cells[ i ];
			if (!cell.isLink()) {
				continue;
			}

			linkConnected(paper, cell);
		}
	}

	function linkConnected(paper, link) {
		var model = paper.getModelById(link.attributes.id);
		var view = paper.findViewByModel(model);
		var source = link.get('source');
		if (!source || !source.port) {
			return;
		}

		//var target = link.get('target');
		//var modelSource = paper.getModelById(source.id);
		//var modelTarget = paper.getModelById(target.id);

		V(view.$el[ 0 ].firstChild).addClass(source.port);
	}

	function showElementPorts(paper, model) {
		if (model.isLink()) {
			return;
		}

		var view = paper.findViewByModel(model);
		if (!model.attributes.attrs.custom_attrs.isRoot) {
			V(view.el.querySelector('.devs .inPorts .port0 .port-body')).removeClass('hide');
		}

		V(view.el.querySelector('.devs .outPorts .port0 .port-body')).removeClass('hide');
		V(view.el.querySelector('.devs .outPorts .port1 .port-body')).removeClass('hide');
	}

	function convertIdeJsonToServerJson(json, paper, returnServerJson) {
		// 0 init
		if (returnServerJson === undefined || returnServerJson === null) {
			returnServerJson = true;
		}

		var nodesArray = [];
		var serverJson = JSON.stringify(nodesArray, null, 4);

		// 1 check if empty
		if (isPaperEmpty(paper)) {
			console.log('Can not convert ide json to server json because of paper (no visual elements) is empty!')
			return serverJson;
		}

		var ideObjects = JSON.parse(json);
		var cells = ideObjects.cells;

		var allNodes = cells.filter(function (cell) {
			return cell[ 'type' ] === 'link' ? null : cell;
		});

		var links = cells.filter(function (cell) {
			return cell[ 'type' ] === 'link' ? cell : null;
		});

		var link,
			node = {},
			nodes = {},
			rootNode = null;

		for (var i = 0; i < links.length; i++) {
			link = links[ i ];
			if (!link.target.id) {
				continue;
			}

			var modelSource = paper.getModelById(link.source.id);
			var modelTarget = paper.getModelById(link.target.id);

			if (modelSource.attributes.attrs.custom_attrs.isRoot) {
				rootNode = modelSource;
			}

			var viewSource = paper.findViewByModel(modelSource);
			var viewTarget = paper.findViewByModel(modelTarget);

			var portSource = viewSource.$el.find(link.source.selector);
			// var portTarget = viewTarget.$el.find(link.target.selector);

			node = nodes[ modelSource.attributes.uuid ];
			if (!node) {
				node = {};
				node.block_id = modelSource.attributes.uuid;
				node.ref_block_id = modelSource.attributes.ref_block_id;
				node.children = {};
			}

			if (portSource[ 0 ].attributes.port === 'red') {
				node.children.falseChild = modelTarget.attributes.uuid;
			} else {
				node.children.trueChild = modelTarget.attributes.uuid;
			}

			nodes[ modelSource.attributes.uuid ] = node;
		}

		for (var key in nodes) {
			node = nodes[ key ];
			nodesArray.push(node);
		}

		// fill empty nodes
		var parsedNode = null;
		for (var i = 0; i < allNodes.length; i++) {
			node = allNodes[ i ];
			parsedNode = nodes[ node.uuid ];
			if (!parsedNode) {
				nodes[ node.uuid ] = {
					block_id: node.uuid,
					ref_block_id: node.ref_block_id,
					children: {
						trueChild: "",
						falseChild: ""
					}
				};
			} else if (!parsedNode.children.trueChild) {
				parsedNode.children.trueChild = "";
			} else if (!parsedNode.children.falseChild) {
				parsedNode.children.falseChild = "";
			}
		}

		paper.jointNodes = nodesArray;

		if (!rootNode) {
			return serverJson;
		}

		var rootObject = {};
		rootObject.constraint_id = rootNode.attributes.uuid;
		rootObject.constraint_name = "Allow Admin transactions in business hours";
		rootObject.constraint_description = "This constraint allows a user with role admin to access API bewteen business hours";
		rootObject.start_block_id = rootNode.attributes.uuid;
		rootObject.abort_block_id = "";
		rootObject.constraint_graph = nodesArray;

		serverJson = JSON.stringify(rootObject, null, 4);

		var apiJson = convertServerJsonToAPI(serverJson);
		return returnServerJson ? serverJson : apiJson;
	}

	function convertServerJsonToAPI(json) {
		var apiJson = "";
		if (!json) {
			return apiJson;
		}

		var serverRoot = JSON.parse(json);
		if (!serverRoot) {
			return;
		}

		var rootObject = {};
		rootObject.constraint_id = serverRoot.constraint_id;
		rootObject.constraint_name = serverRoot.constraint_name;
		rootObject.constraint_description = serverRoot.constraint_description;
		rootObject.start_element_id = serverRoot.start_block_id;
		rootObject.abort_element_id = serverRoot.abort_block_id;
		rootObject.constraint_graph = serverRoot.constraint_graph;

		if (rootObject.constraint_graph) {
			var node = null,
				apiNode = null,
				apiNodes = [];
			for (var i = 0; i < rootObject.constraint_graph.length; i++) {
				node = rootObject.constraint_graph[ i ];
				apiNode = {};
				apiNode.element_id = node.block_id;
				apiNode.ref_block_id = node.ref_block_id;
				apiNode.children = node.children;
				apiNodes.push(apiNode);
			}

			rootObject.constraint_graph = apiNodes;
		}

		apiJson = JSON.stringify(rootObject, null, 4);
		return apiJson;
	}

	return {
		setId: setId,
		convertIdeJsonToServerJson: convertIdeJsonToServerJson,
		showAllElementPorts: showAllElementPorts,
		showElementPorts: showElementPorts,
		linkConnected: linkConnected,
		paintConnections: paintConnections,
		deleteNotConnectedNodes: deleteNotConnectedNodes,
		showHidePortsText: showHidePortsText
	}
});
