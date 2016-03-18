define([ 'joint', 'joint.shapes.devs', 'const', 'image!angular/joint/images/male.png', 'util' ],
	function (joint, Shapes, lugConst, male, util) {

		function calcWidthByName(text) {
			var defaults = {
				width: 160,
				fontSize: 19,
				text: text
			};

			if (!text) {
				defaults.width = defaults.width / 2;
				return defaults;
			}

			if (text.length > 25) {
				defaults.text = defaults.text.substring(0, 22) + "...";
				defaults.fontSize = 9;
				defaults.width = 200;
				return defaults;
			}

			if (text.length <= 10) {
				return defaults;
			}

			defaults.fontSize = (25 - text.length) / 3 + 9;
			defaults.width = 160 + ((text.length - 10) * 40) / 15;

			return defaults;
		}

		function initControls(dragGraph, dragPaper, drawGraph, drawPaper) {

			var label1 = calcWidthByName('Root node');
			var label2 = calcWidthByName('This is 25 length text ex');

			var root = new Shapes.Atomic({
				position: { x: 250, y: 25 },
				size: { width: Math.max(label1.width, label2.width), height: 60 },
				outPorts: [ 'red', 'green' ],
				attrs: {
					image: { 'xlink:href': male.src },
					'.label1': {
						text: label1.text,
						'font-size': label1.fontSize
					},
					'.label2': {
						text: label2.text,
						'font-size': label2.fontSize
					},
					title: { text: 'Root Static Tooltip' },
					'.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
					'.outPorts circle': { fill: '#E74C3C', type: 'output' },
					custom_attrs: {
						isRoot: true
					}
				}
			});

			var label1 = calcWidthByName('Child node');
			var label2 = calcWidthByName('This is 30 length text ex ex e');

			var child = new Shapes.Atomic({
				position: { x: 10, y: 10 },
				size: { width: Math.max(label1.width, label2.width), height: 60 },
				inPorts: [ 'blue' ],
				outPorts: [ 'red', 'green' ],
				attrs: {
					image: { 'xlink:href': male.src },
					'.label1': {
						text: label1.text,
						'font-size': label1.fontSize
					},
					'.label2': {
						text: label2.text,
						'font-size': label2.fontSize
					},
					title: { text: 'Child Static Tooltip' },
					'.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
					'.outPorts circle': { fill: '#E74C3C', type: 'output' },
					custom_attrs: {
						isRoot: false
					}
				}
			});

			var buttonShowHidePortsText = new Shapes.Atomic({
				position: { x: 570, y: 10 },
				size: { width: 110, height: 30 },
				attrs: {
					'.label1': {
						text: 'Show/Hide Text',
						'font-size': 12
					},
					custom_attrs: {
						isServiceButton: true
					}
				}
			});

			util.setId(drawGraph, root);
			util.setId(drawGraph, buttonShowHidePortsText);
			util.setId(dragGraph, child);

			dragGraph.addCells([
				child
			]);

			drawGraph.addCells([
				root,
				buttonShowHidePortsText
			]);

			var model = drawPaper.getModelById(buttonShowHidePortsText.attributes.id);
			var view = drawPaper.findViewByModel(model);
			view.options.interactive = false;
			// view.$el.attr({rect:{style:{'pointer-events':'none'}}});

			util.showElementPorts(drawPaper, root);
			dragPaper.scale(0.7);
		}

		function initButtons() {
			// 'btn_to_json_server_send',
			// 'btn_from_json_server',
			// 'btn_to_json_server',

			[
				'btn_to_json',
				'btn_from_json',
				'btn_save_to_json_file',
				'btn_clear_log'
			].forEach(function (item) {
				$('#' + item).css('visibility', 'visible');
			});
		}

		return {
			initControls: initControls,
			initButtons: initButtons
		};
	});
