/**
 * Created by administrator on 2/23/16.
 */
'use strict';

define([ 'angular', 'jointApp' ],
	function (angular, jointApp) {
		//jointApp.initJoint();
		console.log('jointApp:' + jointApp);
		angular.module('myApp.joint-directive', [])
			.directive('jointDirective', [ function () {
				return {
					restrict: 'E',
					//template: '<div>template test</div>',
					templateUrl: './angular/view3/joint-directive.html',
					replace: true,
					link: function (scope, elm, attrs) {
						jointApp.initJoint();
						//console.log(elm.text());
					}
				};
			} ]);
	});
