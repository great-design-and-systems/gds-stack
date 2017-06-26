import { DOCKER_CONFIG, DOCKER_CONNECT } from './Chain.info';

import { Chain } from 'fluid-chains';
import batch from 'batchflow';
import lodash from 'lodash';

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
        if (param.microservices) {

        }
        next();

    } catch (err) {
        next(err);
    }
});
DockerConnect.addSpec('microservices', false);