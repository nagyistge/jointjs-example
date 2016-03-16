define([ 'joint' ], function (joint) {
	function getCurrentId(graph) {
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

			graph.currentId = ids[ ids.length - 1 ];
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

	function setId(graph, element) {
		if (graph.currentId < graph.maxId) {
			graph.currentId++;
		}
		else {
			alert('max count: ' + graph.maxId + ' is riched!')
			return;
		}

		addZero(graph);

		element.set('id', graph.currentId);
		element.set('uuid', joint.util.uuid());
		graph.currentId = Number.parseInt(graph.currentId);
	}

	function isPaperEmpty(paper) {
		return !paper._views || Object.keys(paper._views).length <= 0;
	}

	function deleteConnection(paper, graph, parentUiid, childUiid, childElement) {
		if (!paper || !parentUiid || !childUiid) {
			return false;
		}

		// child
		var nodeChild = paper.jointNodesDict[ childUiid ];
		if (nodeChild) {
			var index = nodeChild.parents.indexOf(parentUiid);
			if (index < 0) {
				return;
			}

			var links = graph.getConnectedLinks(childElement, {inbound: true});
			if (!links || links.length === 0) {
				nodeChild.parents = [];
			} else {
				nodeChild.parents = nodeChild.parents.splice(index, 1);
			}

			paper.jointNodesDict[ childUiid ] = nodeChild;
		}
	}

	function addConnection(paper, graph, parentUiid, childUiid) {
		if (!paper || !parentUiid || !childUiid) {
			return false;
		}

		if (!paper.jointNodesDict) {
			paper.jointNodesDict = {};
		}

		// parent
		var nodeParent = paper.jointNodesDict[ parentUiid ];
		if (nodeParent) {

		} else {
			nodeParent = {
				uuid: parentUiid
			};
			paper.jointNodesDict[ parentUiid ] = nodeParent;
		}

		// child
		var nodeChild = paper.jointNodesDict[ childUiid ];
		if (!nodeChild) {
			nodeChild = {
				uuid: childUiid
			};
		}

		if (!nodeChild.parents) {
			nodeChild.parents = [];
		}

		nodeChild.parents.push(nodeParent.uuid);
		paper.jointNodesDict[ childUiid ] = nodeChild;

		return true;
	}


	function isCycle(paper, parentUiid, childUiid) {
		var parentNode = paper.jointNodesDict[ parentUiid ];
		if (!parentNode || !parentNode.parents) {
			return false;
		}

		if (~parentNode.parents.indexOf(childUiid)) {
			return true;
		}

		for (var i = 0; i <= parentNode.parents.length; i++) {
			var res = isCycle(paper, parentNode.parents[ i ], childUiid);
			if (res) {
				return true;
			}
		}

		return false;
	}

	function validateConnection(paper, graph, parentUiid, childUiid, childModel) {
		if (!paper || !parentUiid || !childUiid) {
			return false;
		}

		if (!paper.jointNodesDict) {
			paper.jointNodesDict = {};
		}

		// node cant has more 2 parents
		var links = graph.getConnectedLinks(childModel, {inbound: true});
		if (links && links.length === 2) {
			return false;
		}

		var result = !isCycle(paper, parentUiid, childUiid);
		return result
	}

	function convertIdeJsonToServerJson(json, paper) {
		// 0 init
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
			var portTarget = viewTarget.$el.find(link.target.selector);

			node = nodes[ modelSource.attributes.uuid ];
			if (!node) {
				node = {};
				node.block_id = modelSource.attributes.uuid;
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
		rootObject.abort_block_id = "";
		rootObject.constraint_graph = nodesArray;
		rootObject.constraint_id = rootNode.attributes.uuid;
		rootObject.start_block_id = rootNode.attributes.uuid;
		rootObject.constraint_name = "Allow Admin transactions in business hours";
		rootObject.constraint_description = "This constraint allows a user with role admin to access API bewteen business hours";

		serverJson = JSON.stringify(rootObject, null, 4);
		return serverJson;
	}

	return {
		getCurrentId: getCurrentId,
		setId: setId,
		convertIdeJsonToServerJson: convertIdeJsonToServerJson,
		validateConnection: validateConnection,
		addConnection: addConnection,
		deleteConnection: deleteConnection
	}
});
