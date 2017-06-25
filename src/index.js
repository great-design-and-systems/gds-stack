import { ExpressApp, GDS_SERVER_CONFIG, GDS_SERVER_HTTPS_LISTENER, GDS_SERVER_HTTP_LISTENER } from './server/';
import { DomainApi as GDSDomainApi, DomainDTO as GDSDomainDTO } from './model';
import { LOGGER_CONFIG, Logger } from './logger/';
import { MONGO_CONFIG, MONGO_CONNECT } from './database/';

import { ExecuteChain } from 'fluid-chains';

module.exports = {
    ServerChains: {
        GDS_SERVER_CONFIG,
        GDS_SERVER_HTTPS_LISTENER,
        GDS_SERVER_HTTP_LISTENER
    },
    DatabaseChains: {
        MONGO_CONFIG,
        MONGO_CONNECT
    },
    Logger,
    ExpressApp,
    GDSDomainApi,
    GDSDomainDTO
}

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

