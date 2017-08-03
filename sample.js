var GDS = require('./dist/');
var fluidChains = require('fluid-chains');
var ExecuteChain = fluidChains.ExecuteChain;
var ClusterChains = GDS.ClusterChains;
var DockerChains = GDS.DockerChains;
var DatabaseChains = GDS.DatabaseChains;
var ServerChains = GDS.ServerChains;
var LoggerChains = GDS.LoggerChains;
var Logger = GDS.Logger;
var ExpressApp = GDS.ExpressApp;

ExecuteChain([
    ClusterChains.CLUSER_CONFIG,
    DockerChains.DOCKER_CONFIG,
    DockerChains.DOCKER_CONNECT,
    LoggerChains.LOGGER_CONFIG,
    DatabaseChains.MONGO_CONFIG,
    DatabaseChains.MONGO_CONNECT,
    ServerChains.GDS_SERVER_CONFIG,
    ServerChains.GDS_SERVER_CONNECT_MULTIPARTY,
    ServerChains.GDS_SERVER_HTTP_LISTENER,
    ServerChains.GDS_SERVER_HTTPS_LISTENER
],
    {
        mongo_databaseName: 'data-sample-db',
        mongo_retry: 5,
        logger_name: 'SampleLogger',
        logger_filePath: 'sample-logger.log',
        server_tempDir: 'files',
        server_port: 8080
    },
    function (result) {
        Logger('SampleLogger').info('Server in running Express on port 8080');
        ExpressApp.get('/', function (req, res) {
            res.status(200).send('hello world');
        });
    }); 