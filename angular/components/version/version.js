/**
 * Created by administrator on 2/23/16.
 */
'use strict';

define([ 'angular', './version-directive', './interpolate-filter' ],
	function (angular, versionDirective, interpolateFilter) {
		angular.module('myApp.version', [
				'myApp.version.interpolate-filter',
				'myApp.version.version-directive'
			])
			.value('version', '0.3');
	});
