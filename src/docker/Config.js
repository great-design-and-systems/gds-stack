import { DOCKER_CONFIG, DOCKER_CONNECT, DOCKER_CREATE_API_CHAINS } from './Chain.info';
import { changeDefaultProtocol, checkAndGetApi, createChains, getServiceActions } from './util';

import { Chain } from 'fluid-chains';
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
        context.set('microservices', microservices);
        next();
    } catch (err) {
        next(err);
    }
});

const DockerConnect = new Chain(DOCKER_CONNECT, (context, param, next) => {
    try {
        const domains = {};
        if (param.microservices) {
            batch(param.microservices())
                .sequential()
                .each((i, url, n) => {
                    checkAndGetApi(
                        param.proxyHost ? param.proxyHost() : undefined,
                        param.proxyPort ? param.proxyPort() : undefined,
                        param.serviceRetry ? param.serviceRetry() : undefined,
                        param.serviceTimeout ? param.serviceTimeout() : undefined,
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
                    context.set('domains', domains);
                    next();
                });
        }
    } catch (err) {
        next(err);
    }
});
DockerConnect.addSpec('proxyHost', false);
DockerConnect.addSpec('proxyPort', false);
DockerConnect.addSpec('serviceRetry', false);
DockerConnect.addSpec('serviceTimeout', false);
DockerConnect.addSpec('microservices', false);


const DockerCreateAPIChains = new Chain(DOCKER_CREATE_API_CHAINS, (context, param, next) => {
    const domains = param.domains();
    lodash.forIn(domains, (domain, field) => {
        createChains(field, domain);
    });
    next();
});

DockerCreateAPIChains.addSpec('domains', true);
