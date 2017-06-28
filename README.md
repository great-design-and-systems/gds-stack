
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

GDS-stack uses our very own [fluid-chains](https://rickzx98.github.io/fluid-chains/) to process configurations and for you to add your own chain.


```javascript
    var GDS = require('gds-stack');
    var fluidChains = require('fluid-chains');
    var ExecuteChain = fluidChains.ExecuteChain;
    var DockerChains = GDS.DockerChains;
    var DatabaseChains = GDS.DatabaseChains;
    var ServerChains = GDS.ServerChains;
    var LoggerChains = GDS.LoggerChains;
    var Logger = GDS.Logger;
    var ExpressApp = GDS.ExpressApp;
    
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
        ExpressApp.get('/', function(req, res) {
            res.status(200).send('hello world');
        });
     });  

```

### Docker Configuration
  
For linked containers

Chain    |Parameter | Description | value   | default
---------|----------|------------|---------| ----------
DOCKER_CONNECT | docker_proxyHost| proxy host | ?String | none
DOCKER_CONNECT | docker_proxyPort| proxy port | ?Number | none
DOCKER_CONNECT | docker_serviceRetry| number of retries | *Number | none
DOCKER_CONNECT | docker_serviceTimeout| timeout in milisecond | ?Number | 5000

### Logger Configuration

For log4js configuration


Chain    |Parameter | Description | value   | default
---------|----------|-------------|---------| ----------
LOGGER_CONFIG | logger_name| name of logger | *String | none
LOGGER_CONFIG | logger_filePath| absolute path of the log file | *String | none
LOGGER_CONFIG | logger_level| level of logs to write | ?String | all

### Database Configuration


Chain    |Parameter | Description | value   | default
---------|----------|-------------|---------| ----------
MONGO_CONFIG | mongo_port | mongo database port| ?Number | 27017
MONGO_CONFIG | mongo_host | mongo database host |  *String | localhost
MONGO_CONFIG | mongo_databaseName | mongo database name | *String | none
MONGO_CONFIG | mongo_user | mongo database username | ?String | none
MONGO_CONFIG | mongo_password | mongo database password | ?String | none

### Server Configuration

Chain    |Parameter | Description | value   | default
---------|----------|-------------|---------| ----------
GDS_SERVER_CONFIG | server_domainApi | domain dto object of the current app service | ?GDSDomainDTO | none
GDS_SERVER_CONNECT_MULTIPARTY | server_tempDir | file directory path |  *String | none
GDS_SERVER_HTTP_LISTENER | server_port | express server http port | ?Number | 80
GDS_SERVER_HTTPS_LISTENER | server_httpsPort | express server https port| ?Number  | 443

