'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Logger = undefined;

var _fluidChains = require('fluid-chains');

var _Chain = require('./Chain.info');

var _log4js = require('log4js');

var _log4js2 = _interopRequireDefault(_log4js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loggerName = void 0;
var Logger = exports.Logger = function Logger(loggerName) {
    return _log4js2.default.getLogger(loggerName);
};
var LoggerConfigAction = function LoggerConfigAction(context, param, next) {
    _log4js2.default.loadAppender('file');
    _log4js2.default.addAppender(_log4js2.default.appenders.file(param.loggerFilePath()), param.loggerName());
    if (param.level) {
        _log4js2.default.setLevel(param.level());
    }
    next();
};
var LoggerConfigChain = new _fluidChains.Chain(_Chain.LOGGER_CONFIG, LoggerConfigAction);

LoggerConfigChain.addSpec('loggerFilePath', true);
LoggerConfigChain.addSpec('loggerName', true);
LoggerConfigChain.addSpec('level', false);