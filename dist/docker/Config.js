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
        context.set('microservices', microservices);
        next();
    } catch (err) {
        next(err);
    }
});

var DockerConnect = new _fluidChains.Chain(_Chain.DOCKER_CONNECT, function (context, param, next) {
    try {
        var domains = {};
        if (param.microservices) {
            (0, _batchflow2.default)(param.microservices()).sequential().each(function (i, url, n) {
                (0, _util.checkAndGetApi)(param.proxyHost ? param.proxyHost() : undefined, param.proxyPort ? param.proxyPort() : undefined, param.serviceRetry ? param.serviceRetry() : undefined, param.serviceTimeout ? param.serviceTimeout() : undefined, url, function (err, data) {
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
                context.set('domains', domains);
                next();
            });
        }
    } catch (err) {
        next(err);
    }
});
DockerConnect.addSpec('proxyHost', false);
DockerConnect.addSpec('proxyPort', false);
DockerConnect.addSpec('serviceRetry', false);
DockerConnect.addSpec('serviceTimeout', false);
DockerConnect.addSpec('microservices', false);

var DockerCreateAPIChains = new _fluidChains.Chain(_Chain.DOCKER_CREATE_API_CHAINS, function (context, param, next) {
    var domains = param.domains();
    _lodash2.default.forIn(domains, function (domain, field) {
        (0, _util.createChains)(field, domain);
    });
    next();
});

DockerCreateAPIChains.addSpec('domains', true);