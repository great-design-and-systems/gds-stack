'use strict';

var _fluidChains = require('fluid-chains');

var _server = require('./server/');

var _model = require('./model');

(0, _fluidChains.ExecuteChain)([_server.GDS_SERVER_CONFIG, 'SAMPLE', _server.GDS_SERVER_LISTENER], {
    port: '9070'
}, function (result) {});

new _fluidChains.Chain('SAMPLE', function (context, param, next) {
    _server.ExpressApp.get('/', function (req, res) {
        res.status(200).send({
            message: 'Nice try!'
        });
    });
    next();
});

module.exports = {
    ServerChains: {
        GDS_SERVER_CONFIG: _server.GDS_SERVER_CONFIG,
        GDS_SERVER_LISTENER: _server.GDS_SERVER_LISTENER
    },
    ExpressApp: _server.ExpressApp,
    GDSDomainApi: _model.DomainApi,
    GDSDomainDTO: _model.DomainDTO
};