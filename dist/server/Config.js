'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ExpressApp = undefined;

var _fluidChains = require('fluid-chains');

var _Chain = require('./Chain.info');

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

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
var ServerConfigChainAction = function ServerConfigChainAction(context, param) {
    app.use((0, _morgan2.default)(ENV));
    app.use(_bodyParser2.default.urlencoded({
        extended: true
    }));
    app.use((0, _cookieParser2.default)());
    app.use(_bodyParser2.default.json());
    app.use(_bodyParser2.default.json({
        type: 'application/vnd.api+json'
    }));
    if (param.server_domainApi) {
        app.get('/api', function (req, res) {
            res.status(200).send(param.server_domainApi());
        });
    }
};
var ServerConfigChain = new _fluidChains.Chain(_Chain.GDS_SERVER_CONFIG, ServerConfigChainAction);
ServerConfigChain.addSpec('server_domainApi');

//ServerConnectMultipartyChain
var ServerConnectMultipartyAction = function ServerConnectMultipartyAction(context, param) {
    app.use((0, _connectMultiparty2.default)({
        uploadDir: param.server_tempDir()
    }));
};

var ServerConnectMultipartyChain = new _fluidChains.Chain(_Chain.GDS_SERVER_CONNECT_MULTIPARTY, ServerConnectMultipartyAction);
ServerConnectMultipartyChain.addSpec('server_tempDir', true);

//ServerHTTPListenerChain
var ServerHTTPListenerChainAction = function ServerHTTPListenerChainAction(context, param) {
    var port = param.server_port();
    var host = param.server_host();
    _http2.default.createServer(app).listen(port, host);
    console.log('HTTP is listening to port', port, host);
};

var ServerHTTPListenerChain = new _fluidChains.Chain(_Chain.GDS_SERVER_HTTP_LISTENER, ServerHTTPListenerChainAction);
ServerHTTPListenerChain.addSpec('server_port', false).default('80');
ServerHTTPListenerChain.addSpec('server_host', false).default('localhost');
//ServerHTTPSListenerChain
var ServerHTTPSListenerChainAction = function ServerHTTPSListenerChainAction(context, param) {
    var port = param.server_httpsPort();
    var host = param.server_httpsHost();
    var credentials = {
        key: _fs2.default.readFileSync(param.server_privateKey_path(), param.server_encoding ? param.server_encoding() : 'utf8'),
        cert: _fs2.default.readFileSync(param.server_certificate_path(), param.server_encoding ? param.server_encoding() : 'utf8')
    };
    _https2.default.createServer(credentials, app).listen(port, host);
    console.log('HTTPS is listening to port', port);
};
var ServerHTTPSListenerChain = new _fluidChains.Chain(_Chain.GDS_SERVER_HTTPS_LISTENER, ServerHTTPSListenerChainAction);
ServerHTTPSListenerChain.addSpec('server_httpsPort').default('443');
ServerHTTPSListenerChain.addSpec('sever_httpsHost').default('127.0.0.1');
ServerHTTPSListenerChain.addSpec('server_privateKey_path', true);
ServerHTTPSListenerChain.addSpec('server_certificate_path', true);
ServerHTTPSListenerChain.addSpec('server_encoding', false);

//ServerHttpProxyListenerChain
var ServerHttpProxyListenerChain = new _fluidChains.Chain(_Chain.GDS_SERVER_HTTP_PROXY_LISTENER, function (context, param) {
    var port = param.server_proxyPort ? param.server_proxyPort() : '8080';
    var addresses = param.server_addresses ? param.server_addresses() : [];
    var currentAddress = 0;
    var proxy = _httpProxy2.default.createProxyServer({});
    _http2.default.createServer(function (req, res) {
        proxy.web(req, res, { target: addresses[currentAddress] });
        currentAddress = (currentAddress + 1) % addresses.length;
    }).listen(port);
});
ServerHttpProxyListenerChain.addSpec('server_proxyPort');
ServerHttpProxyListenerChain.addSpec('server_addresses', true);

//ServerHttpProxyListenerChain
var ServerHttpsProxyListenerChain = new _fluidChains.Chain(_Chain.GDS_SERVER_HTTPS_PROXY_LISTENER, function (context, param) {
    var port = param.server_proxyPort ? param.server_proxyHttpsPort() : '443';
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
});
ServerHttpsProxyListenerChain.addSpec('server_proxyHttpsPort');
ServerHttpsProxyListenerChain.addSpec('server_addresses', true);
ServerHttpsProxyListenerChain.addSpec('server_privateKey_path', true);
ServerHttpsProxyListenerChain.addSpec('server_certificate_path', true);
ServerHttpsProxyListenerChain.addSpec('server_encoding', false);

// using socket io server
var ServerSocketIOListener = new _fluidChains.Chain(_Chain.GDS_SERVER_SOCKET_IO_LISTENER, function (context, param) {
    var port = param.server_port();
    var host = param.server_host();
    var serverSocketEvents = param.server_socket_events();
    var server = _http2.default.createServer(app);
    var io = (0, _socket2.default)(server);
    server.listen(port, host);
    console.log('HTTP Socket Server is listening to port', port, host);
    io.on('connection', function (socket) {
        new _fluidChains.ChainMiddleware(/^(emit).+/gi, function (param, context, next) {
            socket.emit(param.event, param.emit_data);
            next();
        });

        var _loop = function _loop(field) {
            if (serverSocketEvents.hasOwnProperty(field)) {
                var chainName = serverSocketEvents[field];
                console.log('Socket listening to event', field);
                socket.on(field, function (data) {
                    (0, _fluidChains.ExecuteChain)(chainName, data, function (result) {
                        if (result.$err) {
                            console.error('Failed on socket event', field);
                            console.error(result.$err);
                        }
                    });
                });
            }
        };

        for (var field in serverSocketEvents) {
            _loop(field);
        }
    });
});

ServerSocketIOListener.addSpec('server_port').default('80');
ServerSocketIOListener.addSpec('server_host').default('localhost');
ServerSocketIOListener.addSpec('server_socket_events').default({});