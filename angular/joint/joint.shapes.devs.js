/*! JointJS v0.9.3 - JavaScript diagramming library  2015-02-03


 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
define([ 'joint', 'lodash' ], function (joint, _) {

	//if (typeof exports === 'object') {
	//
	//	var joint = {
	//		util: require('../src/core').util,
	//		shapes: {
	//			basic: require('./joint.shapes.basic'),
	//			org: require('./joint.shapes.org'),
	//		},
	//		dia: {
	//			ElementView: require('../src/joint.dia.element').ElementView,
	//			Link: require('../src/joint.dia.link').Link
	//		}
	//	};
	//	var _ = require('lodash');
	//}

	joint.shapes.devs = {};
	joint.shapes.devs.Model = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {

		markup: '<g class="rotatable">' +
		'<g class="scalable">' +
		'<rect class="body"/>' +
		'<image/>' +
		'</g>' +
		'<text class="label1"/>' +
		'<text class="label2"/>' +
		'<g class="inPorts"/>' +
		'<g class="outPorts"/>' +
		'</g>',
		portMarkup: '<g class="port port<%= id %>">' +
		'<circle class="port-body"/>' +
		'<text class="port-label"/>' +
		'</g>',

		defaults: joint.util.deepSupplement({

			type: 'devs.Model',
			size: { width: 1, height: 1 },

			inPorts: [],
			outPorts: [],

			attrs: {

			  rect: { width: 170, height: 60 },

			  '.': {
					magnet: false
				},
				'.body': {
				  stroke: '#000000',
				  'stroke-width': 2,
				  'pointer-events': 'visiblePainted',
				  rx: 10,
				  ry: 10
				},
				image: {
				  width: 48, height: 48,
				  ref: '.body', 'ref-x': 10, 'ref-y': 5
				},

			  '.port-body': {
					r: 7,
					magnet: true,
					stroke: '#000000'
				},
				text: {
					'pointer-events': 'none'
				},
				'.label1': {
				  'font-weight': '800',
				  ref: '.body', 'ref-x': 0.9, 'ref-y': 0.2,
				  'font-family': 'Courier New', 'font-size': 14,
				  'text-anchor': 'end'
				},
				'.label2': {
				  'font-weight': '800',
				  ref: '.body', 'ref-x': 0.9, 'ref-y': 0.6,
				  'font-family': 'Courier New', 'font-size': 14,
				  'text-anchor': 'end'
				},
				'.inPorts .port-label': {
					x: -15,
					dy: 4,
					'text-anchor': 'end',
					fill: '#000000'
				},
				'.outPorts .port-label': {
					x: 15,
					dy: 4,
					fill: '#000000'
				}
			}

		}, joint.shapes.basic.Generic.prototype.defaults),

		getPortAttrs: function (portName, index, total, selector, type) {

			var attrs = {};

			var portClass = 'port' + index;
			var portSelector = selector + '>.' + portClass;
			var portLabelSelector = portSelector + '>.port-label';
			var portBodySelector = portSelector + '>.port-body';
			var portLabelSelectorTextY = portLabelSelector + '>.v-line';

			//attrs[ portLabelSelector ] = { text: portName };
			attrs[ portBodySelector ] = { port: { id: portName || _.uniqueId(type), type: type } };
			attrs[ portSelector ] = {
				ref: '.body',
				//'ref-y': (index + 0.5) * (1 / total),
				'ref-x': (index + 0.5) * (1 / total)
			};

			if (selector === '.outPorts') {
				attrs[ portSelector ][ 'ref-dy' ] = 1;
				//attrs[ portSelector ][ 'ref-dx' ] = 0;
				attrs[ portLabelSelector ] = {
					text: portName,
					//'ref-x': 30,
					'ref-y': 15
				};
				//attrs[ portLabelSelectorTextY ] = {
				//	text: portName,
				//	'x': 10,
				//	'y': 15
				//};
			}

			var offset = 15 + (portName.length > 5 ? portName.length - 1: portName.length) * 10;
			if (selector === '.inPorts') {
				attrs[ portLabelSelector ] = {
					text: portName,
					'ref-x': (index === 0 ? 10 : offset),
					'ref-y': -25
				};
				//attrs[ portLabelSelectorTextY ] = {
				//	text: portName,
				//	'x': (index === 0 ? 60 : -60),
				//	'y': -10
				//};
				//attrs[ portSelector ][ 'x-alignment' ] = 'middle';
				//attrs[ portSelector ][ 'y-alignment' ] = 'middle';
			}

			return attrs;
		}
	}));
	joint.shapes.devs.Atomic = joint.shapes.devs.Model.extend({

		defaults: joint.util.deepSupplement({

			type: 'devs.Atomic',
			size: { width: 80, height: 80 },
			attrs: {
				'.body': { fill: 'salmon' },
				'.label': { text: 'Atomic' },
				'.inPorts .port-body': { fill: 'PaleGreen' },
				'.outPorts .port-body': { fill: 'Tomato' }
			}

		}, joint.shapes.devs.Model.prototype.defaults)

	});
	joint.shapes.devs.Coupled = joint.shapes.devs.Model.extend({

		defaults: joint.util.deepSupplement({

			type: 'devs.Coupled',
			//size: { width: 200, height: 300 },
			attrs: {
				'.body': { fill: 'seaGreen' },
				'.label': { text: 'Coupled' },
				'.inPorts .port-body': { fill: 'PaleGreen' },
				'.outPorts .port-body': { fill: 'Tomato' }
			}

		}, joint.shapes.devs.Model.prototype.defaults)
	});
	joint.shapes.devs.Link = joint.dia.Link.extend({

		defaults: {
			type: 'devs.Link',
			attrs: {
				'.connection': { 'stroke-width': 2 },
				'.marker-target': {
					fill: 'black',
					d: 'M 10 0 L 0 5 L 10 10 z'
				}
			}
		}
	});

	joint.shapes.devs.ModelView = joint.dia.ElementView.extend(joint.shapes.basic.PortsViewInterface);
	joint.shapes.devs.AtomicView = joint.shapes.devs.ModelView;
	joint.shapes.devs.CoupledView = joint.shapes.devs.ModelView;

	///org.member
	joint.shapes.devs.Member = joint.shapes.org.Member;

	joint.shapes.devs.MemberCustom = joint.dia.Element.extend({

		markup: '<g class="rotatable">' +
		'<g class="scalable">' +
		'<rect class="card"/>' +
		'<image/></g><text class="rank"/>' +
		'<text class="name"/>' +
		'<g class="inPorts"/>' +
		'<g class="outPorts"/>' +
		'</g>',

		defaults: joint.util.deepSupplement({

			type: 'org.Member',
			size: { width: 180, height: 70 },
			attrs: {

				rect: { width: 170, height: 60 },

				'.card': {
					stroke: '#000000',
				  'stroke-width': 2,
					'pointer-events': 'visiblePainted',
				  rx: 10,
				  ry: 10
				},
				image: {
					width: 48, height: 48,
					ref: '.card', 'ref-x': 10, 'ref-y': 5
				},

			  '.rank': {
				'text-decoration': 'underline',
				ref: '.card', 'ref-x': 0.9, 'ref-y': 0.2,
				'font-family': 'Courier New', 'font-size': 14,
				'text-anchor': 'end'
			  },

			  '.name': {
				'font-weight': '800',
				ref: '.card', 'ref-x': 0.9, 'ref-y': 0.6,
				'font-family': 'Courier New', 'font-size': 14,
				'text-anchor': 'end'
			  },
			  '.inPorts .port-label': {
					x: -15,
					dy: 4,
					'text-anchor': 'end',
					fill: '#000000'
				},
				'.outPorts .port-label': {
					x: 15,
					dy: 4,
					fill: '#000000'
				}
			}
		}, joint.dia.Element.prototype.defaults)
	});

	if (typeof exports === 'object') {
		module.exports = joint.shapes.devs;
	}

	return joint.shapes.devs;
});
