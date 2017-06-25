'use strict';

var _server = require('./server/');

var _model = require('./model');

var _logger = require('./logger/');

var _database = require('./database/');

var _fluidChains = require('fluid-chains');

module.exports = {
    ServerChains: {
        GDS_SERVER_CONFIG: _server.GDS_SERVER_CONFIG,
        GDS_SERVER_HTTPS_LISTENER: _server.GDS_SERVER_HTTPS_LISTENER,
        GDS_SERVER_HTTP_LISTENER: _server.GDS_SERVER_HTTP_LISTENER
    },
    DatabaseChains: {
        MONGO_CONFIG: _database.MONGO_CONFIG,
        MONGO_CONNECT: _database.MONGO_CONNECT
    },
    Logger: _logger.Logger,
    ExpressApp: _server.ExpressApp,
    GDSDomainApi: _model.DomainApi,
    GDSDomainDTO: _model.DomainDTO

    /* TESTER
    ExecuteChain([LOGGER_CONFIG, MONGO_CONFIG, MONGO_CONNECT, GDS_SERVER_CONFIG, GDS_SERVER_HTTP_LISTENER, GDS_SERVER_HTTPS_LISTENER], {
        databaseName: 'data-sample-db',
        retry: 5,
        loggerName: 'SampleLogger',
        loggerFilePath: 'sample-logger.log'
    }, result => {
        Logger('SampleLogger').info('done', 'hello');
        ExpressApp.get('/', (req, res) => {
            res.send('nice');
        })
    });
    
    */

};