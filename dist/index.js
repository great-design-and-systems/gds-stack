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
        GDS_SERVER_HTTP_LISTENER: _server.GDS_SERVER_HTTP_LISTENER,
        GDS_SERVER_CONNECT_MULTIPARTY: _server.GDS_SERVER_CONNECT_MULTIPARTY
    },
    DatabaseChains: {
        MONGO_CONFIG: _database.MONGO_CONFIG,
        MONGO_CONNECT: _database.MONGO_CONNECT
    },
    Logger: _logger.Logger,
    ExpressApp: _server.ExpressApp,
    GDSDomainApi: _model.DomainApi,
    GDSDomainDTO: _model.DomainDTO
};

(0, _fluidChains.ExecuteChain)([_logger.LOGGER_CONFIG, _database.MONGO_CONFIG, _database.MONGO_CONNECT, _server.GDS_SERVER_CONFIG, _server.GDS_SERVER_CONNECT_MULTIPARTY, _server.GDS_SERVER_HTTP_LISTENER, _server.GDS_SERVER_HTTPS_LISTENER], {
    databaseName: 'data-sample-db',
    retry: 5,
    loggerName: 'SampleLogger',
    loggerFilePath: 'sample-logger.log',
    tempDir: 'files'
}, function (result) {
    (0, _logger.Logger)('SampleLogger').info('done', 'hello');
    _server.ExpressApp.get('/', function (req, res) {
        res.send('nice');
    });
});