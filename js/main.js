require.config({
    baseUrl: 'js',
    paths: {
        layout: '../css',
        layout_vendor: '../vendors/css',
        jquery: '../vendors/js/jquery.min',
        jquery_ui: '../vendors/js/jquery-ui-1.10.4.custom',
        lodash: '../vendors/js/lodash.min',
        backbone: '../vendors/js/backbone',
        joint: '../vendors/js/joint_096',
        fs: '../node_modules/browser-filesaver/FileSaver.min',
        app: 'app'
    },
    priority: [
        'jquery', 'lodash', 'backbone'
    ],
    shim: {
        'backbone': {
            exports: 'backbone',
            deps:['jquery', 'lodash']
        },
        'joint': {
            exports: 'joint',
            deps: ['jquery', 'lodash', 'backbone']
        },
        'jquery': {
            exports: '$'
        },
        'jquery_ui': {
            exports: '$ui',
            deps: ['jquery']
        }
    },
    map: {
        '*': {
            'underscore': 'lodash', // Backbone requires underscore. This forces requireJS to load lodash instead:
            'style': '../node_modules/require-css/css' // or whatever the path to require-css is
        }
    },
    deps:['app']
});
