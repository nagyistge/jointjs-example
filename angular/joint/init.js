define([ 'joint', 'joint.shapes.devs', 'const', 'image!angular/joint/images/male.png' ], function (joint, Shapes, lugConst, male) {
	function initControls(graph, paper) {

		var root = new Shapes.Atomic({
			position: { x: 45, y: 5 },
			size: { width: 160, height: 80 },
			outPorts: [ 'red', 'green' ],
			attrs: {
				image: { 'xlink:href': male.src },
				'.label1': { text: 'Root node' },
				'.label2': { text: 'Some text' },
				title: { text: 'Root Static Tooltip' },
				'.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
				'.outPorts circle': { fill: '#E74C3C', type: 'output' },
				custom_attrs: {
					isRoot: true
				}
			}
		});

		var child = new Shapes.Atomic({
			position: { x: 45, y: 155 },
			size: { width: 160, height: 80 },
			inPorts: [ 'blue' ],
			outPorts: [ 'red', 'green' ],
			attrs: {
				image: { 'xlink:href': male.src },
				'.label1': { text: 'Child node' },
				'.label2': { text: 'Some text' },
				title: { text: 'Child Static Tooltip' },
				'.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
				'.outPorts circle': { fill: '#E74C3C', type: 'output' },
				custom_attrs: {
					isRoot: false
				}
			}
		});

		var memberCustom = new Shapes.MemberCustom({
			position: { x: 15, y: 530 },
			size: { width: 170, height: 100 },
			inPorts: [ 'period', 'up_time' ],
			attrs: {
				image: { 'xlink:href': male.src },
				'.card': {
					fill: '#7c68fd'
				},
				'.rank': {
					text: 'CEO'
				},
				'.name': { text: 'KOIU' }
			}
		});

		graph.addCells([
			root,
			child,
			memberCustom
		]);
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
