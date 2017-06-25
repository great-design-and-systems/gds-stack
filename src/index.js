import { ExpressApp, GDS_SERVER_CONFIG, GDS_SERVER_CONNECT_MULTIPARTY, GDS_SERVER_HTTPS_LISTENER, GDS_SERVER_HTTP_LISTENER } from './server/';
import { DomainApi as GDSDomainApi, DomainDTO as GDSDomainDTO, DomainResource as GDSDomainResource } from './model';
import { LOGGER_CONFIG, Logger } from './logger/';
import { MONGO_CONFIG, MONGO_CONNECT } from './database/';

import { ExecuteChain } from 'fluid-chains';

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
    Logger,
    ExpressApp,
    GDSDomainApi,
    GDSDomainDTO,
    GDSDomainResource
}


ExecuteChain([LOGGER_CONFIG, MONGO_CONFIG, MONGO_CONNECT, GDS_SERVER_CONFIG, GDS_SERVER_CONNECT_MULTIPARTY, GDS_SERVER_HTTP_LISTENER, GDS_SERVER_HTTPS_LISTENER], {
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
});


