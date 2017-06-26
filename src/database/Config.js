import { MONGO_CONFIG, MONGO_CONNECT } from './Chain.info';

import { Chain } from 'fluid-chains';
import mongoose from 'mongoose';

const MongoConfigAction = (context, param, next) => {
    const port = param.mongo_port ? param.mongo_port() : 27017;
    const host = param.mongo_host ? param.mongo_host() : 'localhost';
    const databaseName = param.mongo_databaseName();
    const user = param.mongo_user ? param.mongo_user() : undefined;
    const password = param.mongo_password ? param.mongo_password() : undefined;
    let url = 'mongodb://';
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
}

const MongoConfigChain = new Chain(MONGO_CONFIG, MongoConfigAction);
MongoConfigChain.addSpec('mongo_port', false);
MongoConfigChain.addSpec('mongo_host', false);
MongoConfigChain.addSpec('mongo_databaseName', true);
MongoConfigChain.addSpec('mongo_user', false);
MongoConfigChain.addSpec('mongo_password', false);


const MongoConnectAction = (context, param, next, tries) => {
    if (!tries) {
        tries = 0;
    }
    if (tries < param.mongo_retry()) {
        mongoose.connect(param.mongo_url(), err => {
            if (err) {
                console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
                tries++;
                setTimeout(() => {
                    MongoConnectAction(context, param, next, tries);
                }, 5000);
            } else {
                next();
            }
        });
    } else {
        next(new Error('Failed to connect to mongo db'));
    }
}

const MongoConnectChain = new Chain(MONGO_CONNECT, MongoConnectAction);
MongoConnectChain.addSpec('mongo_url', true);
MongoConnectChain.addSpec('mongo_retry', true);