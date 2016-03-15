define([ 'util' ], function (util) {
	function initControls(joint, graph) {

		var V = joint.V;
		var paper = $('#paper');
		var paper = new joint.dia.Paper({
			el: paper,
			width: paper.width(),
			height: paper.height(),
			gridSize: 1,
			defaultLink: function (cellView, magnetDOMElement) {
				//joint.dia.LinkView.prototype.render.apply(this, arguments);

				var link = new joint.dia.Link({
					attrs: {
						'.connection': {
							'stroke': '#3838A0'
						},
						'.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
					}
				});

				link.on('change:target', function (link, target) {

					if (target.id) {
						console.log('change:source' + JSON.stringify(link));
						console.log('change:target' + JSON.stringify(target));
						var model = paper.getModelById(link.attributes.id);
						var view = paper.findViewByModel(model);
						var source = link.get('source');
						if (!source || !source.port) {
							return;
						}

						var target = link.get('target');
						var modelSource = paper.getModelById(source.id);
						var modelTarget = paper.getModelById(target.id);
						//util.addConnection(paper, graph, modelSource.attributes.uuid, modelTarget.attributes.uuid);
						util.addConnection(paper, graph, source.id, target.id);

						V(view.$el[ 0 ].firstChild).addClass(source.port);
					}
				});


				util.setId(graph, link);
				return link;

				//if (magnetDOMElement.getAttribute('port') === 'output') {
				//    var link = new joint.dia.Link({
				//        attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
				//    });
				//
				//    util.setId(graph, link);
				//    return link;
				//} else {
				//    var link = new joint.dia.Link({
				//        attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
				//    })
				//    util.setId(graph, link);
				//
				//    return link;
				//}
			},
			//new joint.dia.Link({
			//    attrs: { '.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' } }
			//}),
			model: graph,
			snapLinks: true,
			embeddingMode: true,
			validateEmbedding: function (childView, parentView) {
				return parentView.model instanceof joint.shapes.devs.Coupled;
			},
			//validateConnection: function(sourceView, sourceMagnet, targetView, targetMagnet) {
			//    return sourceMagnet != targetMagnet;
			//},
			validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
				// Prevent linking from input ports.
				if (magnetS && magnetS.getAttribute('type') === 'input') return false;
				// Prevent linking from output ports to input ports within one element.
				if (cellViewS === cellViewT) return false;
				// Prevent linking to input ports.
				var result = magnetT && magnetT.getAttribute('type') === 'input';

				if (!result) {
					return result;
				}


				// check if no cycles
				var sourceUiid = cellViewS.model.attributes.uuid;
				var targetUiid = cellViewT.model.attributes.uuid;

				//var valid = util.validateConnection(this, graph, sourceUiid, targetUiid);
				var valid = util.validateConnection(this, graph, cellViewS.model.id, cellViewT.model.id);
				return valid;
			},
			markAvailable: true
		});

		graph.on('remove', function(cell, collection, opt) {
			if (cell.isLink()) {
				console.log('remove link event');
				var target = cell.get('target');
				var modelSource = paper.getModelById(cell.attributes.source.id);
				var modelTarget = paper.getModelById(cell.attributes.target.id);
				//util.deleteConnection(paper, graph, modelSource.attributes.uuid, modelTarget.attributes.uuid);
				util.deleteConnection(paper, graph, cell.attributes.source.id, cell.attributes.target.id);
			}
		});

		/* rounded corners */
		/*
		 _.each([c1,a1,a2,a3], function(element) {
		 element.attr({ '.body': { 'rx': 6, 'ry': 6 }});
		 });
		 */
		/* custom highlighting */

		var highlighter = V('circle', {
			'r': 14,
			'stroke': '#ff7e5d',
			'stroke-width': '6px',
			'fill': 'transparent',
			'pointer-events': 'none'
		});

		paper.off('cell:highlight cell:unhighlight').on({

			'cell:highlight': function (cellView, el, opt) {

				if (opt.embedding) {
					V(el).addClass('highlighted-parent');
				}

				if (opt.connecting) {
					var bbox = V(el).bbox(false, paper.viewport);
					highlighter.translate(bbox.x + 10, bbox.y + 10, { absolute: true });
					V(paper.viewport).append(highlighter);
				}
			},

			'cell:unhighlight': function (cellView, el, opt) {

				if (opt.embedding) {
					V(el).removeClass('highlighted-parent');
				}

				if (opt.connecting) {
					highlighter.remove();
				}
			}
		});

		return {
			graph: graph,
			paper: paper
		};
	}

	return {
		init: initControls
	};

//paper.on('blank:pointerdown', function(evt, x, y) {
//    //alert('pointerdown on a blank area in the paper.')
//})
});
