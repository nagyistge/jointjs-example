define([], function () {
    return {
        MODE: 'mode',
        MODE_DEMO: 'demo',
        DATA: 'data',
        DATA_JSON: 'json',
        DATA_JSONP: 'jsonp',

        $APP_METADATA_KEY: '#application_metadata_key',
        $IDE_METADATA_KEY: '#ide_metadata_key',

        APP_METADATA_KEY: 'metadata_key',
        IDE_METADATA_KEY: 'ide_metadata_key',

        URL_GET_DEV: 'http://localhost:8888/getMetaData?key=',
        URL_POST_DEV: 'http://localhost:8888/setMetaData',
    }
});
