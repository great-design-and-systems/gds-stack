'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ExpressApp = undefined;

var _Chain = require('./Chain.info');

var _fluidChains = require('fluid-chains');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _connectMultiparty = require('connect-multiparty');

var _connectMultiparty2 = _interopRequireDefault(_connectMultiparty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 5000;
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
    if (param.domainApi) {
        app.get('/', function (req, res) {
            res.status(200).send(param.domainApi());
        });
    }
    next();
};
var ServerConfigChain = new _fluidChains.Chain(_Chain.GDS_SERVER_CONFIG, ServerConfigChainAction);
ServerConfigChain.addSpec('domainApi', false);

//ServerConnectMultipartyChain
var ServerConnectMultipartyAction = function ServerConnectMultipartyAction(context, param, next) {
    app.use((0, _connectMultiparty2.default)({
        uploadDir: param.tempDir()
    }));
    next();
};
var ServerConnectMultipartyChain = new _fluidChains.Chain(_Chain.GDS_SERVER_CONNECT_MULTIPARTY, ServerConnectMultipartyAction);
ServerConnectMultipartyChain.addSpec('tempDir', true);

//ServerHTTPListenerChain
var ServerHTTPListenerChainAction = function ServerHTTPListenerChainAction(context, param, next) {
    var port = param.port ? param.port() : '80';
    _http2.default.createServer(app).listen(port);
    console.log('HTTP is listening to port', port);
    next();
};
var ServerHTTPListenerChain = new _fluidChains.Chain(_Chain.GDS_SERVER_HTTP_LISTENER, ServerHTTPListenerChainAction);
ServerHTTPListenerChain.addSpec('port', false);

//ServerHTTPSListenerChain
var ServerHTTPSListenerChainAction = function ServerHTTPSListenerChainAction(context, param, next) {
    var port = param.httpsPort ? param.httpsPort() : '443';
    _https2.default.createServer(app).listen(port);
    console.log('HTTPS is listening to port', port);
    next();
};
var ServerHTTPSListenerChain = new _fluidChains.Chain(_Chain.GDS_SERVER_HTTPS_LISTENER, ServerHTTPSListenerChainAction);
ServerHTTPSListenerChain.addSpec('httpsPort', false);