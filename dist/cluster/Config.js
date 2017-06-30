'use strict';

var _Chain = require('./Chain.info');

var _fluidChains = require('fluid-chains');

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var clusterConfigChain = new _fluidChains.Chain(_Chain.CLUSTER_CONFIG, function (context, param, next) {
    context.set('server_cluster', true);
    if (_cluster2.default.isMaster) {
        var maxCpus = param.cluster_max_cpu ? param.cluster_max_cpu() : _os2.default.cpus().length;
        for (var i = 0; i < maxCpus; i += 1) {
            _cluster2.default.fork();
        }
        var messageHandler = function messageHandler(msg) {
            if (msg.cmd && msg.cmd === 'notifyRequest') {
                numReqs += 1;
            }
        };
        for (var id in _cluster2.default.workers) {
            _cluster2.default.workers[id].on('message', messageHandler);
        }
        _cluster2.default.on('exit', function (worker) {
            console.log('Worker %d died :(', worker.id);
            _cluster2.default.fork();
        });
    } else {
        next();
    }
});

clusterConfigChain.addSpec('cluster_max_cpu');