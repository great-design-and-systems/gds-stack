import { GDS_SERVER_CONFIG, GDS_SERVER_HTTPS_LISTENER, GDS_SERVER_HTTP_LISTENER } from './Chain.info';

import { Chain } from 'fluid-chains';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import http from 'http';
import https from 'https';
import morgan from 'morgan';
import multipart from 'connect-multiparty';

const PORT = process.env.PORT || 5000;
const ENV = process.env.APP_ENV || 'dev';
const app = express();

export const ExpressApp = app;
const ServerConfigChainAction = (context, param, next) => {
    app.use(morgan(ENV));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.json({
        type: 'application/vnd.api+json'
    }));
    if (process.env.TEMP_DIR) {
        app.use(multipart({
            uploadDir: process.env.TEMP_DIR || 'files'
        }));
    }
    if (param.domainApi) {
        app.get('/', (req, res) => {
            res.status(200).send(param.domainApi());
        });
    }
    next();
}
const ServerConfigChain = new Chain(GDS_SERVER_CONFIG, ServerConfigChainAction);
ServerConfigChain.addSpec('domainApi', false);


const ServerHTTPListenerChainAction = (context, param, next) => {
    const port = param.port ? param.port() : '80';
    http.createServer(app).listen(port);
    console.log('HTTP is listening to port', port);
    next();
}
const ServerHTTPListenerChain = new Chain(GDS_SERVER_HTTP_LISTENER, ServerHTTPListenerChainAction);
ServerHTTPListenerChain.addSpec('port', false);

const ServerHTTPSListenerChainAction = (context, param, next) => {
    const port = param.httpsPort ? param.httpsPort() : '443';
    https.createServer(app).listen(port);
    console.log('HTTPS is listening to port', port);
    next();
}
const ServerHTTPSListenerChain = new Chain(GDS_SERVER_HTTPS_LISTENER, ServerHTTPSListenerChainAction);
ServerHTTPSListenerChain.addSpec('httpsPort', false);