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

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _connectMultiparty = require('connect-multiparty');

var _connectMultiparty2 = _interopRequireDefault(_connectMultiparty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 5000;
var ENV = process.env.APP_ENV || 'dev';
var app = (0, _express2.default)();
var ExpressApp = exports.ExpressApp = app;
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
    if (process.env.TEMP_DIR) {
        app.use((0, _connectMultiparty2.default)({
            uploadDir: process.env.TEMP_DIR || 'files'
        }));
    }
    if (param.domainApi) {
        app.get('/', function (req, res) {
            res.status(200).send(param.domainApi());
        });
    }
    next();
};
var ServerConfigChain = new _fluidChains.Chain(_Chain.GDS_SERVER_CONFIG, ServerConfigChainAction);
ServerConfigChain.addSpec('domainApi', false);

var ServerListenerChainAction = function ServerListenerChainAction(context, param, next) {
    var port = param.port ? param.port() : '8080';
    app.listen(port, function () {
        console.log('Express is listening to port ' + port);
        next();
    });
};
var ServerListenerChain = new _fluidChains.Chain(_Chain.GDS_SERVER_LISTENER, ServerListenerChainAction);
ServerListenerChain.addSpec('port', false);