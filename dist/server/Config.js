'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ExpressApp = undefined;

var _Chain = require('./Chain.info');

var _fluidChains = require('fluid-chains');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _httpProxy = require('http-proxy');

var _httpProxy2 = _interopRequireDefault(_httpProxy);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _connectMultiparty = require('connect-multiparty');

var _connectMultiparty2 = _interopRequireDefault(_connectMultiparty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENV = process.env.APP_ENV || 'dev';
var app = (0, _express2.default)();

var ExpressApp = exports.ExpressApp = app;

// ServerConfigChain
var ServerConfigChainAction = function ServerConfigChainAction(context, param, next) {
    app.use((0, _morgan2.default)(ENV));
    app.use(_bodyParser2.default.urlencoded({
        extended: true
    }));
    app.use((0, _cookieParser2.default)());
    app.use(_bodyParser2.default.json());
    app.use(_bodyParser2.default.json({
        type: 'application/vnd.api+json'
    }));
    app.get('/cluster-test', function (req, res) {
        if (_cluster2.default.worker) {
            res.status(200).send('Worker id - ' + _cluster2.default.worker.id);
        } else {
            res.status(200).send('Not configured with cluster.');
        }
    });
    if (param.server_domainApi) {
        app.get('/api', function (req, res) {
            res.status(200).send(param.server_domainApi());
        });
    }
    next();
};
var ServerConfigChain = new _fluidChains.Chain(_Chain.GDS_SERVER_CONFIG, ServerConfigChainAction);
ServerConfigChain.addSpec('server_domainApi');

//ServerConnectMultipartyChain
var ServerConnectMultipartyAction = function ServerConnectMultipartyAction(context, param, next) {

    app.use((0, _connectMultiparty2.default)({
        uploadDir: param.server_tempDir()
    }));

    next();
};

var ServerConnectMultipartyChain = new _fluidChains.Chain(_Chain.GDS_SERVER_CONNECT_MULTIPARTY, ServerConnectMultipartyAction);
ServerConnectMultipartyChain.addSpec('server_tempDir', true);

//ServerHTTPListenerChain
var ServerHTTPListenerChainAction = function ServerHTTPListenerChainAction(context, param, next) {
    var port = param.server_port ? param.server_port() : '80';
    _http2.default.createServer(app).listen(port);
    console.log('HTTP is listening to port', port);
    next();
};

var ServerHTTPListenerChain = new _fluidChains.Chain(_Chain.GDS_SERVER_HTTP_LISTENER, ServerHTTPListenerChainAction);
ServerHTTPListenerChain.addSpec('server_port', false);

//ServerHTTPSListenerChain
var ServerHTTPSListenerChainAction = function ServerHTTPSListenerChainAction(context, param, next) {
    var port = param.server_httpsPort ? param.server_httpsPort() : '443';
    var credentials = {
        key: _fs2.default.readFileSync(param.server_privateKey_path(), param.server_encoding ? param.server_encoding() : 'utf8'),
        cert: _fs2.default.readFileSync(param.server_certificate_path(), param.server_encoding ? param.server_encoding() : 'utf8')
    };
    _https2.default.createServer(credentials, app).listen(port);
    console.log('HTTPS is listening to port', port);
    next();
};
var ServerHTTPSListenerChain = new _fluidChains.Chain(_Chain.GDS_SERVER_HTTPS_LISTENER, ServerHTTPSListenerChainAction);
ServerHTTPSListenerChain.addSpec('server_httpsPort');
ServerHTTPSListenerChain.addSpec('server_privateKey_path', true);
ServerHTTPSListenerChain.addSpec('server_certificate_path', true);
ServerHTTPSListenerChain.addSpec('server_encoding', false);

//ServerHttpProxyListenerChain
var ServerHttpProxyListenerChain = new _fluidChains.Chain(_Chain.GDS_SERVER_HTTP_PROXY_LISTENER, function (context, param, next) {
    var port = param.server_proxyPort ? param.server_proxyPort() : '8080';
    var addresses = param.server_addresses ? param.server_addresses() : [];
    var currentAddress = 0;
    var proxy = _httpProxy2.default.createProxyServer({});
    _http2.default.createServer(function (req, res) {
        proxy.web(req, res, { target: addresses[currentAddress] });
        currentAddress = (currentAddress + 1) % addresses.length;
    }).listen(port);
    next();
});
ServerHttpProxyListenerChain.addSpec('server_proxyPort');
ServerHttpProxyListenerChain.addSpec('server_addresses', true);

//ServerHttpProxyListenerChain
var ServerHttpsProxyListenerChain = new _fluidChains.Chain(_Chain.GDS_SERVER_HTTPS_PROXY_LISTENER, function (context, param, next) {
    var port = param.server_proxyPort ? param.server_proxyPort() : '443';
    var addresses = param.server_addresses ? param.server_addresses() : [];
    var currentAddress = 0;
    var proxy = _httpProxy2.default.createProxyServer({});
    var credentials = {
        key: _fs2.default.readFileSync(param.server_privateKey_path(), param.server_encoding ? param.server_encoding() : 'utf8'),
        cert: _fs2.default.readFileSync(param.server_certificate_path(), param.server_encoding ? param.server_encoding() : 'utf8')
    };
    _https2.default.createServer(credentials, function (req, res) {
        proxy.web(req, res, { target: addresses[currentAddress] });
        currentAddress = (currentAddress + 1) % addresses.length;
    }).listen(port);
    next();
});
ServerHttpsProxyListenerChain.addSpec('server_proxyHttpsPort');
ServerHttpsProxyListenerChain.addSpec('server_addresses', true);
ServerHttpsProxyListenerChain.addSpec('server_privateKey_path', true);
ServerHttpsProxyListenerChain.addSpec('server_certificate_path', true);
ServerHttpsProxyListenerChain.addSpec('server_encoding', false);