'use strict';

var _Chain = require('./Chain.info');

var _util = require('./util');

var _fluidChains = require('fluid-chains');

var _batchflow = require('batchflow');

var _batchflow2 = _interopRequireDefault(_batchflow);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _restler = require('restler');

var _restler2 = _interopRequireDefault(_restler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DockerConfig = new _fluidChains.Chain(_Chain.DOCKER_CONFIG, function (context, param, next) {
    var microservices = [];
    try {
        _lodash2.default.forEach(process.env, function (value, key) {
            if (key.match(/SERVICE_PORT$/g) && !key.match(/.*_ENV_.*_SERVICE_PORT$/g)) {
                microservices.push(value);
            }
        });
        context.set('docker_microservices', microservices);
        next();
    } catch (err) {
        next(err);
    }
});

var ConvertToServerAddresssesChain = new _fluidChains.Chain(_Chain.CONVERT_TO_SERVER_ADDRESSES, function (context, param, next) {
    var serviceAddresses = [];
    try {
        var dockerServices = param.docker_microservices() || [];
        dockerServices.forEach(function (serviceUrl) {
            serviceUrl = (0, _util.changeDefaultProtocol)(serviceUrl);
            var parsedUrl = serviceUrl.split(':');
            var host = parsedUrl[0];
            var port = parsedUrl[1];
            serviceAddresses.push({
                host: host,
                port: port
            });
        });
        context.set('server_addresses', serviceAddresses);
        next();
    } catch (err) {
        next(err);
    }
});
ConvertToServerAddresssesChain.addSpec('docker_microservices', true);

var DockerConnect = new _fluidChains.Chain(_Chain.DOCKER_CONNECT, function (context, param, next) {
    try {
        var domains = {};
        if (param.docker_microservices) {
            (0, _batchflow2.default)(param.docker_microservices()).sequential().each(function (i, url, n) {
                (0, _util.checkAndGetApi)(param.docker_proxyHost ? param.docker_proxyHost() : undefined, param.docker_proxyPort ? param.docker_proxyPort() : undefined, param.docker_serviceRetry ? param.docker_serviceRetry() : undefined, param.docker_serviceTimeout ? param.docker_serviceTimeout() : undefined, url, function (err, data) {
                    if (err) {
                        n();
                    } else {
                        if (data && data.domain) {
                            _lodash2.default.set(domains, data.domain, (0, _util.getServiceActions)(data.links));
                        }
                        n();
                    }
                });
            }).end(function () {
                context.set('docker_domains', domains);
                next();
            });
        }
    } catch (err) {
        next(err);
    }
});
DockerConnect.addSpec('docker_proxyHost', false);
DockerConnect.addSpec('docker_proxyPort', false);
DockerConnect.addSpec('docker_serviceRetry', false);
DockerConnect.addSpec('docker_serviceTimeout', false);
DockerConnect.addSpec('docker_microservices', false);

var DockerCreateAPIChains = new _fluidChains.Chain(_Chain.DOCKER_CREATE_API_CHAINS, function (context, param, next) {
    var domains = param.docker_domains();
    _lodash2.default.forIn(domains, function (domain, field) {
        (0, _util.createChains)(field, domain);
    });
    next();
});

DockerCreateAPIChains.addSpec('docker_domains', true);