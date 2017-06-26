'use strict';

var _docker = require('./docker/');

var _server = require('./server/');

var _model = require('./model');

var _logger = require('./logger/');

var _database = require('./database/');

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
    DockerChains: {
        DOCKER_CONFIG: _docker.DOCKER_CONFIG,
        DOCKER_CONNECT: _docker.DOCKER_CONNECT,
        DOCKER_CREATE_API_CHAINS: _docker.DOCKER_CREATE_API_CHAINS
    },
    Logger: _logger.Logger,
    ExpressApp: _server.ExpressApp,
    GDSDomainApi: _model.DomainApi,
    GDSDomainDTO: _model.DomainDTO,
    GDSDomainResource: _model.DomainResource

    /* TESTER 
    
    ExecuteChain([DOCKER_CONFIG,
        DOCKER_CONNECT,
        DOCKER_CREATE_API_CHAINS,
        LOGGER_CONFIG,
        MONGO_CONFIG,
        MONGO_CONNECT,
        GDS_SERVER_CONFIG,
        GDS_SERVER_CONNECT_MULTIPARTY,
        GDS_SERVER_HTTP_LISTENER,
        GDS_SERVER_HTTPS_LISTENER], {
            databaseName: 'data-sample-db',
            retry: 5,
            loggerName: 'SampleLogger',
            loggerFilePath: 'sample-logger.log',
            tempDir: 'files'
        }, result => {
            Logger('SampleLogger').info('done', 'hello');
            ExpressApp.get('/', (req, res) => {
                res.send('nice');
            })
            ExecuteChain('Logger.getLogger', {
                options: {
                    params: {
                        serviceName: 'STUDENTS'
                    }
                }
            }, result => {
                console.log('tryResult', result.output().data);
            });
        });
    
        */

};