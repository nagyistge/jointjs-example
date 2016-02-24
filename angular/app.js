'use strict';

define([
	'angular',
	'angularRoute',
	'./view1/view1',
	'./view2/view2',
	'./view3/view3',
	'./view3/joint-directive',
	'jointApp'
], function(angular, angularRoute, view1, view2, view3, jointDirective, jointApp) {
	// Declare app level module which depends on views, and components
	return angular.module('myApp', [
		'ngRoute',
		'myApp.view1',
		'myApp.view2',
		'myApp.view3',
		'myApp.joint-directive'
	]).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.otherwise({redirectTo: '/view1'});
	}]);
});
