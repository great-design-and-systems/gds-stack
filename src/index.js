import { DOCKER_CONFIG, DOCKER_CONNECT, DOCKER_CREATE_API_CHAINS } from './docker/';
import { ExpressApp, GDS_SERVER_CONFIG, GDS_SERVER_CONNECT_MULTIPARTY, GDS_SERVER_HTTPS_LISTENER, GDS_SERVER_HTTP_LISTENER } from './server/';
import { DomainApi as GDSDomainApi, DomainDTO as GDSDomainDTO, DomainResource as GDSDomainResource } from './model';
import { LOGGER_CONFIG, Logger } from './logger/';
import { MONGO_CONFIG, MONGO_CONNECT } from './database/';

module.exports = {
    ServerChains: {
        GDS_SERVER_CONFIG,
        GDS_SERVER_HTTPS_LISTENER,
        GDS_SERVER_HTTP_LISTENER,
        GDS_SERVER_CONNECT_MULTIPARTY
    },
    DatabaseChains: {
        MONGO_CONFIG,
        MONGO_CONNECT
    },
    DockerChains: {
        DOCKER_CONFIG,
        DOCKER_CONNECT,
        DOCKER_CREATE_API_CHAINS
    },
    Logger,
    ExpressApp,
    GDSDomainApi,
    GDSDomainDTO,
    GDSDomainResource
}


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