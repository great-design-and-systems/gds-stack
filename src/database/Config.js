import { MONGO_CONFIG, MONGO_CONNECT } from './Chain.info';

import { Chain } from 'fluid-chains';
import mongoose from 'mongoose';

const MongoConfigAction = (context, param, next) => {
    const port = param.port ? param.port() : 27017;
    const host = param.host ? param.host() : 'localhost';
    const databaseName = param.databaseName();
    const user = param.user ? param.user() : undefined;
    const password = param.password ? param.password() : undefined;
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
    context.set('url', url);
    next();
}

const MongoConfigChain = new Chain(MONGO_CONFIG, MongoConfigAction);
MongoConfigChain.addSpec('port', false);
MongoConfigChain.addSpec('host', false);
MongoConfigChain.addSpec('databaseName', true);
MongoConfigChain.addSpec('user', false);
MongoConfigChain.addSpec('password', false);


const MongoConnectAction = (context, param, next, tries) => {
    if (!tries) {
        tries = 0;
    }
    if (tries < param.retry()) {
        mongoose.connect(param.url(), err => {
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
MongoConnectChain.addSpec('url', true);
MongoConnectChain.addSpec('retry', true);