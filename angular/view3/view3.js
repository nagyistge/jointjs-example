'use strict';
define([
	'angular',
	'angularRoute'
], function(angular) {
	angular.module('myApp.view3', ['ngRoute'])
		.config(['$routeProvider', function($routeProvider) {
			$routeProvider.when('/view3', {
				templateUrl: './angular/view3/view3.html',
				controller: 'View3Ctrl'
			});
		}])
		.controller('View3Ctrl', [function() {

		}]);
});
