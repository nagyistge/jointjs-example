define([ 'util' ], function (util) {
	function initControls(joint) {

		var graph = new joint.dia.Graph;
		var V = joint.V;
		var paper = $('#paper');
		var paper = new joint.dia.Paper({
			el: paper,
			width: paper.width(),
			height: paper.height(),
			gridSize: 1,

			defaultLink: function (cellView, magnetDOMElement) {

				var link = new joint.dia.Link({
					attrs: {
						'.connection': {
							'stroke': '#3838A0'
						},
						'.marker-target': { d: 'M 10 0 L 0 5 L 10 10 z' }
					}
				});

				util.setId(graph, link);
				return link;
			},

			model: graph,
			snapLinks: true,
			embeddingMode: true,
			validateMagnet: function (cellView, magnet) {
				// allow only 2 outgoing connections
				var inLinks = graph.getConnectedLinks(cellView.model, {outbound: true});
				if (inLinks && inLinks.length >= 2) {
					return false;
				}

				return true;
			},

			validateEmbedding: function (childView, parentView) {
				return parentView.model instanceof joint.shapes.devs.Atomic;
			},

			validateConnection: function (cellViewSource, magnetS, cellViewTarget, magnetT, end, linkView) {
				// Prevent linking from input ports.
				if (magnetS && magnetS.getAttribute('type') === 'input') return false;
				// Prevent linking from output ports to input ports within one element.
				if (cellViewSource === cellViewTarget) return false;
				// Prevent linking to input ports.
				var result = magnetT && magnetT.getAttribute('type') === 'input';
				if (!result) {
					return result;
				}

				var res = graph.isPredecessor(cellViewSource.model, cellViewTarget.model);
				return !res;
			},

			markAvailable: true
		});

		graph.on('change:source change:target', function(link) {
			if (link.get('source').id && link.get('target').id) {
				util.linkConnected(paper, link);
			}
			if (link.get('source').id && !link.get('target').id) {
				//linkDisconnected(link);
			}
		});

		graph.on('remove', function (cell, collection, opt) {
			if (cell.isLink()) {
				//linkRemove(cell);
			}
		});

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
});
