/**
 * Created by administrator on 2/23/16.
 */

'use strict';

define(['angular'], function(angular) {
	angular.module('myApp.version.interpolate-filter', [])
		.filter('interpolate', ['version', function(version) {
			return function(text) {
				return String(text).replace(/\%VERSION\%/mg, version);
			};
		}]);
});
