'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createChains = exports.getServiceActions = exports.checkAndGetApi = exports.changeDefaultProtocol = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fluidChains = require('fluid-chains');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _restler = require('restler');

var _restler2 = _interopRequireDefault(_restler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var changeDefaultProtocol = exports.changeDefaultProtocol = function changeDefaultProtocol(servicePort) {
    return servicePort.indexOf('tcp') > -1 ? servicePort.replace('tcp', 'http') : servicePort;
};
var checkAndGetApi = exports.checkAndGetApi = function checkAndGetApi(proxyHost, proxyPort, retryCount, timeout, url, callback) {
    var API_SERVICE_RETRY_COUNT = retryCount || 5;
    var API_SERVICE_RETRY_TIMEOUT = timeout || 10000;
    console.log('Connecting to ', url);
    var retry = 0;
    _restler2.default.get(url, {
        timeout: API_SERVICE_RETRY_TIMEOUT,
        proxy: {
            host: proxyHost,
            port: proxyPort
        }
    }).on('success', function (data) {
        callback(undefined, data);
    }).on('error', function (reason) {
        if (retry === API_SERVICE_RETRY_COUNT) {
            callback(reason);
        }
        retry++;
        this.retry(API_SERVICE_RETRY_TIMEOUT);
    }).on('fail', function (reason) {
        if (retry === API_SERVICE_RETRY_COUNT) {
            callback(reason);
        }
        retry++;
        this.retry(API_SERVICE_RETRY_TIMEOUT);
    }).on('timeout', function (reason) {
        if (retry === API_SERVICE_RETRY_COUNT) {
            callback(reason);
        }
        retry++;
        this.retry(API_SERVICE_RETRY_TIMEOUT);
    });
};
var getServiceActions = exports.getServiceActions = function getServiceActions(links) {
    var domainActions = [];
    _lodash2.default.forEach(links, function (service, field) {
        if (service.domain) {
            domainActions.push({ field: field, actions: getServiceActions(service.links) });
        } else {
            domainActions.push(_extends({}, service, { execute: action, field: field }));
        }
    });
    return domainActions;
};

function action(options, callback) {
    var link = this;
    var url = changeDefaultProtocol(link.url);
    if (options instanceof Function) {
        callback = options;
        options = undefined;
    }
    if (!options) {
        options = {};
    }
    if (!options.timeout) {
        options.timeout = 5000;
    }
    var method = 'get';
    if (link.method === 'POST') {
        method = 'post';
    } else if (link.method === 'PUT') {
        method = 'put';
    } else if (link.method === 'DELETE') {
        method = 'del';
    }
    if (options && options.params) {
        _lodash2.default.forEach(options.params, function (value, key) {
            url = url.replace(':' + key, value);
        });
    }
    console.log('request made: ' + url);
    if (options.multipart) {
        var file = _restler2.default.file(options.data.path, options.data.originalFilename, options.data.size, null, options.data.type);
        _lodash2.default.set(options, 'data', {});
        _lodash2.default.set(options.data, options.multipartField, file);
        console.log('data converted to rest file', options);
    }
    /* 
    TODO: find other ways to setup proxy
    if (PROXY_HOST && PROXY_PORT) {
         options.proxy = {
             host: PROXY_HOST,
             port: PROXY_PORT
         };
     }*/
    _lodash2.default.get(_restler2.default, method)(url, options).on('success', function (result, response) {
        console.log('request success: ' + url);
        callback(undefined, {
            data: result,
            response: response
        });
        if (options.multipart) {
            fs.unlink(_lodash2.default.get(options.data, options.multipartField).path);
        }
    }).on('error', function (reason, response) {
        console.error('ERROR: ' + url, reason);
        callback(reason, response);
    }).on('fail', function (reason, response) {
        console.error('FAIL: ' + url, reason);
        callback(reason, response);
    }).on('timeout', function (reason, response) {
        console.error('TIMEOUT: ' + link.url, reason);
        callback(reason, response);
    });
}

var createChains = exports.createChains = function createChains(domainName, domainActions) {
    domainActions.forEach(function (action) {
        if (action.actions) {
            createChains(domainName + '.' + action.field, action.actions);
        } else {
            var chainName = action.field;
            if (action.field == 1) {
                chainName = domainName;
            } else if (action.field.match(/^\d*$/)) {
                chainName = domainName + '.v' + action.field;
            } else {
                chainName = domainName + '.' + action.field;
            }
            var chainAction = new _fluidChains.Chain(chainName, function (context, param, next) {
                var options = param.options ? param.options() : {};
                action.execute(options, function (err, result) {
                    context.set('output', result);
                    next(err);
                });
            });
            console.log('creating chain...', chainAction.info());
            chainAction.addSpec('options');
        }
    });
};