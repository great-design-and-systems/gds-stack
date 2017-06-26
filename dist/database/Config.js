'use strict';

var _Chain = require('./Chain.info');

var _fluidChains = require('fluid-chains');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoConfigAction = function MongoConfigAction(context, param, next) {
    var port = param.mongo_port ? param.mongo_port() : 27017;
    var host = param.mongo_host ? param.mongo_host() : 'localhost';
    var databaseName = param.mongo_databaseName();
    var user = param.mongo_user ? param.mongo_user() : undefined;
    var password = param.mongo_password ? param.mongo_password() : undefined;
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
    context.set('mongo_url', url);
    next();
};

var MongoConfigChain = new _fluidChains.Chain(_Chain.MONGO_CONFIG, MongoConfigAction);
MongoConfigChain.addSpec('mongo_port', false);
MongoConfigChain.addSpec('mongo_host', false);
MongoConfigChain.addSpec('mongo_databaseName', true);
MongoConfigChain.addSpec('mongo_user', false);
MongoConfigChain.addSpec('mongo_password', false);

var MongoConnectAction = function MongoConnectAction(context, param, next, tries) {
    if (!tries) {
        tries = 0;
    }
    if (tries < param.mongo_retry()) {
        _mongoose2.default.connect(param.mongo_url(), function (err) {
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
MongoConnectChain.addSpec('mongo_url', true);
MongoConnectChain.addSpec('mongo_retry', true);