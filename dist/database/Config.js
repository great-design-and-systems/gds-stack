'use strict';

var _Chain = require('./Chain.info');

var _fluidChains = require('fluid-chains');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoConfigAction = function MongoConfigAction(context, param, next) {
    var port = param.port ? param.port() : 27017;
    var host = param.host ? param.host() : 'localhost';
    var databaseName = param.databaseName();
    var user = param.user ? param.user() : undefined;
    var password = param.password ? param.password() : undefined;
    var url = 'mongodb://';
    if (user && password) {
        url += user;
        url += ':' + password;
        url += '@';
    }
    url += host;
    url += ':';
    url += port;
    url += '/';
    url += databaseName;
    context.set('url', url);
    next();
};

var MongoConfigChain = new _fluidChains.Chain(_Chain.MONGO_CONFIG, MongoConfigAction);
MongoConfigChain.addSpec('port', false);
MongoConfigChain.addSpec('host', false);
MongoConfigChain.addSpec('databaseName', true);
MongoConfigChain.addSpec('user', false);
MongoConfigChain.addSpec('password', false);

var MongoConnectAction = function MongoConnectAction(context, param, next, tries) {
    if (!tries) {
        tries = 0;
    }
    if (tries < param.retry()) {
        _mongoose2.default.connect(param.url(), function (err) {
            if (err) {
                console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
                tries++;
                setTimeout(function () {
                    MongoConnectAction(context, param, next, tries);
                }, 5000);
            } else {
                next();
            }
        });
    } else {
        next(new Error('Failed to connect to mongo db'));
    }
};

var MongoConnectChain = new _fluidChains.Chain(_Chain.MONGO_CONNECT, MongoConnectAction);
MongoConnectChain.addSpec('url', true);
MongoConnectChain.addSpec('retry', true);