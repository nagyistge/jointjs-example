require.config({
	baseUrl: 'angular',
	paths: {
		image: '../node_modules/requirejs-plugins/src/image',

		// angular vendors
		angular: '../node_modules/angular/angular',
		angularRoute: '../node_modules/angular-route/angular-route',
		layout_angular: 'css',

		// angular
		myApp: 'app',

		// joint vendors
		fs: '../node_modules/browser-filesaver/FileSaver.min',
		layout_vendor: 'joint/vendors/css',
		images: 'joint/images',
		jquery: 'joint/vendors/js/jquery.min',
		jquery_ui: 'joint/vendors/js/jquery-ui-1.10.4.custom',
		lodash: 'joint/vendors/js/lodash.min',
		backbone: 'joint/vendors/js/backbone',
		joint: 'joint/vendors/js/joint_096',

		// joints
		layout: 'joint/css',
		util: 'joint/util',
		editable: 'joint/editable',
		drag: 'joint/drag',
		paper: 'joint/paper',
		init: 'joint/init',
		api: 'joint/api',
		form: 'joint/form',
		'joint.shapes.devs': 'joint/joint.shapes.devs',
		'joint.shapes.html': 'joint/joint.shapes.html',
		const: 'joint/const',
		jointApp: 'joint/app'
	},
	priority: [
		'jquery', 'lodash', 'backbone'
	],
	shim: {
		'angular': {
			exports: 'angular'
		},
		'myApp': {
			exports: 'myApp',
			deps: [ 'angular', 'jointApp' ]
		},
		'angularRoute': [ 'angular' ],
		'backbone': {
			exports: 'backbone',
			deps: [ 'jquery', 'lodash' ]
		},
		'joint': {
			exports: 'joint',
			deps: [ 'jquery', 'lodash', 'backbone' ]
		},
		'jquery': {
			exports: '$'
		},
		'jquery_ui': {
			exports: '$ui',
			deps: [ 'jquery' ]
		}
	},
	map: {
		'*': {
			'underscore': 'lodash', // Backbone requires underscore. This forces requireJS to load lodash instead:
			'style': '../node_modules/require-css/css' // or whatever the path to require-css is
		}
	},
	priority: [
		'myApp', 'jointApp'
	],
	deps: [ 'myApp' ]
});

require([
		'angular',
		'myApp'
	], function (angular, app) {
		var $html = angular.element(document.getElementsByTagName('html')[ 0 ]);
		angular.element().ready(function () {
			// bootstrap the app manually
			angular.bootstrap(document, [ 'myApp' ]);
		});
	}
);
