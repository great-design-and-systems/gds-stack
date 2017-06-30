import { CLUSTER_CONFIG } from './Chain.info';
import { Chain } from 'fluid-chains';
import cluster from 'cluster';
import os from 'os';

const clusterConfigChain = new Chain(CLUSTER_CONFIG, (context, param, next) => {
    context.set('server_cluster', true);
    if (cluster.isMaster) {
        const maxCpus = param.cluster_max_cpu ? param.cluster_max_cpu() : os.cpus().length;
        for (var i = 0; i < maxCpus; i += 1) {
            cluster.fork();
        }
        const messageHandler = (msg) => {
            if (msg.cmd && msg.cmd === 'notifyRequest') {
                numReqs += 1;
            }
        };
        for (const id in cluster.workers) {
            cluster.workers[id].on('message', messageHandler);
        }
        cluster.on('exit', (worker) => {
            console.log('Worker %d died :(', worker.id);
            cluster.fork();
        });
    }
    else {
        next();
    }


});

clusterConfigChain.addSpec('cluster_max_cpu');