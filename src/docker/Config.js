import { CONVERT_TO_SERVER_ADDRESSES, DOCKER_CONFIG, DOCKER_CONNECT, DOCKER_CREATE_API_CHAINS, DOCKER_CREATE_CHAIN_MIDDLEWARE } from './Chain.info';
import { Chain, ChainMiddleware } from 'fluid-chains';
import { changeDefaultProtocol, checkAndGetApi, createChains, getServiceActions } from './util';

import batch from 'batchflow';
import lodash from 'lodash';
import restler from 'restler';

const DockerConfig = new Chain(DOCKER_CONFIG, (context, param, next) => {
    const microservices = [];
    try {
        lodash.forEach(process.env, (value, key) => {
            if (key.match(/SERVICE_PORT$/g) && !key.match(/.*_ENV_.*_SERVICE_PORT$/g)) {
                microservices.push(value);
            }
        });
        context.set('docker_microservices', microservices);
        next();
    } catch (err) {
        next(err);
    }
});

const ConvertToServerAddresssesChain = new Chain(CONVERT_TO_SERVER_ADDRESSES, (context, param, next) => {
    const serviceAddresses = [];
    try {
        const dockerServices = param.docker_microservices() || [];
        dockerServices.forEach(serviceUrl => {
            serviceUrl = changeDefaultProtocol(serviceUrl);
            const parsedUrl = serviceUrl.split(':');
            const host = parsedUrl[0];
            const port = parsedUrl[1];
            serviceAddresses.push({
                host,
                port
            });
        });
        context.set('server_addresses', serviceAddresses);
        next();
    } catch (err) {
        next(err);
    }
});
ConvertToServerAddresssesChain.addSpec('docker_microservices', true);

const DockerConnect = new Chain(DOCKER_CONNECT, (context, param, next) => {
    try {
        const domains = {};
        if (param.docker_microservices) {
            batch(param.docker_microservices())
                .sequential()
                .each((i, url, n) => {
                    checkAndGetApi(
                        param.docker_proxyHost ? param.docker_proxyHost() : undefined,
                        param.docker_proxyPort ? param.docker_proxyPort() : undefined,
                        param.docker_serviceRetry ? param.docker_serviceRetry() : undefined,
                        param.docker_serviceTimeout ? param.docker_serviceTimeout() : undefined,
                        url,
                        (err, data) => {
                            if (err) {
                                n();
                            } else {
                                if (data && data.domain) {
                                    lodash.set(domains, data.domain, getServiceActions(data.links));
                                }
                                n();
                            }
                        }
                    )
                })
                .end(() => {
                    context.set('docker_domains', domains);
                    next();
                });
        }
    } catch (err) {
        next(err);
    }
});
DockerConnect.addSpec('docker_proxyHost', false);
DockerConnect.addSpec('docker_proxyPort', false);
DockerConnect.addSpec('docker_serviceRetry', false);
DockerConnect.addSpec('docker_serviceTimeout', false);
DockerConnect.addSpec('docker_microservices', false);


const DockerCreateAPIChains = new Chain(DOCKER_CREATE_API_CHAINS, (context, param, next) => {
    const domains = param.docker_domains();
    lodash.forIn(domains, (domain, field) => {
        createChains(field, domain);
    });
    next();
});

DockerCreateAPIChains.addSpec('docker_domains', true);

const DockerCreateChainMiddleware = new Chain(DOCKER_CREATE_CHAIN_MIDDLEWARE, (context, param) => {
  const domains = param.docker_domains(); 
  new ChainMiddleware(/({)([a-zA-Z]*)(\.)([a-zA-Z]*)(})/g, (param, context, next) => {
        const owner = context.$owner();
        const options = param.options ? param.options() : {};
        next();
    });
});

DockerCreateChainMiddleware.addSpec('docker_domains',true);
