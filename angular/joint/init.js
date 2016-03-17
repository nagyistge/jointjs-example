define([ 'joint', 'joint.shapes.devs', 'const', 'image!angular/joint/images/male.png' ], function (joint, Shapes, lugConst, male) {

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

		if (text.length >= 25) {
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

	function initControls(graph, paper) {

		var label1 = calcWidthByName('Root node');
		var label2 = calcWidthByName('This is 24 length text ex');

		var root = new Shapes.Atomic({
			position: { x: 10, y: 5 },
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
		var label2 = calcWidthByName('This is 25 length text ex');

		var child = new Shapes.Atomic({
			position: { x: 10, y: 80 },
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

		graph.addCells([
			root,
			child
		]);

		paper.scale(0.7);
	}

	function loadUrlParams() {
		var hash = location.hash;
		var items = hash.split('&');
		if (!items || items.length === 0) return;

		var values = {};
		items.forEach(function (item) {
			var kv = item.split('=');
			values[ kv[ 0 ].replace('#', '') ] = kv[ 1 ];
		});

		window.lugIDE = window.lugIDE || {};
		window.lugIDE.mode = values[ lugConst.MODE ];
		window.lugIDE.data = values[ lugConst.DATA ];

		if (window.lugIDE.mode === lugConst.MODE_DEVELOPMENT) {
			$('#get_url').val(lugConst.URL_GET_DEV);
			$('#post_url').val(lugConst.URL_POST_DEV);
		}
		else {
			$('#get_url').val(lugConst.URL_GET_DEMO);
			$('#post_url').val(lugConst.URL_POST_DEMO);
		}

		refreshLayout();
	}

	function refreshLayout() {
		var demo = [ 'btn_deploy', 'btn_load' ];
		var dev = [
			'btn_to_json',
			'btn_from_json',
			'btn_from_json_server',
			'btn_to_json_server_send',
			'btn_to_json_server',
			'btn_save_to_json_file',
			'btn_clear_log'
		];

		demo.forEach(function (item) {
			if (window.lugIDE.mode === lugConst.MODE_DEVELOPMENT) {
				$('#' + item).css('visibility', 'hidden');
			} else {
				$('#' + item).css('visibility', 'visible');
			}
		});
		dev.forEach(function (item) {
			if (window.lugIDE.mode === lugConst.MODE_DEVELOPMENT) {
				$('#' + item).css('visibility', 'visible');
			} else {
				$('#' + item).css('visibility', 'hidden');
			}
		});
	}

	function initFields() {
		var $serverKey = $(lugConst.$APP_METADATA_KEY);
		var $ideKey = $(lugConst.$IDE_METADATA_KEY);

		$ideKey.on('change keyup paste', function () {
			$serverKey.val($(this).val().replace('ide_', ''));
		});

		$ideKey.val(lugConst.IDE_METADATA_KEY);
		$serverKey.val(lugConst.APP_METADATA_KEY);

		loadUrlParams();
		$(window).on('hashchange', loadUrlParams);
	}

	return {
		initControls: initControls,
		initFields: initFields
	};
});
