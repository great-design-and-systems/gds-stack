
# Gds-stack

Another utilization of NodeJS technologies in one package.
## Technologies supported and available
- [Fluid-chains](https://rickzx98.github.io/fluid-chains/)
- [Express](http://expressjs.com/)
- [Docker](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/)
- [Log4js](https://www.npmjs.com/package/log4js)

## Getting started

```
    npm install --save gds-stack
```

### Sample configuration

GDS-stack uses our very own [fluid-chains](https://rickzx98.github.io/fluid-chains/) for processing chain of configurations and for you to inject your own configuration.


```javascript
    var GDS = require('gds-stack');
    var fluidChains = require('fluid-chains');
    var ExecuteChain = fluidChains.ExecuteChain;
    var DockerChains = GDS.DockerChains;
    var DatabaseChains = GDS.DatabaseChains;
    var ServerChains = GDS.ServerChains;
    var LoggerChains = GDS.LoggerChains;
    var Logger = GDS.Logger;

    ExecuteChain([
        DockerChains.DOCKER_CONFIG,
        DockerChains.DOCKER_CONNECT,
        LoggerChains.LOGGER_CONFIG,
        DatabaseChains.MONGO_CONFIG,
        DatabaseChains.MONGO_CONNECT,
        ServerChains.GDS_SERVER_CONFIG,
        ServerChains.GDS_SERVER_CONNECT_MULTIPARTY,
        ServerChains.GDS_SERVER_HTTP_LISTENER,
        ServerChains. GDS_SERVER_HTTPS_LISTENER
    ],
     {
        mongo_databaseName: 'data-sample-db',
        mongo_retry: 5,
        logger_name: 'SampleLogger',
        logger_filePath: 'sample-logger.log',
        server_tempDir: 'files',
        server_port: 8080
     },
     function(result) {
        Logger('SampleLogger').info('Server in running Express on port 8080');
     });  


```
