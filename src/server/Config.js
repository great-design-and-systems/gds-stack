import { GDS_SERVER_CONFIG, GDS_SERVER_CONNECT_MULTIPARTY, GDS_SERVER_HTTPS_LISTENER, GDS_SERVER_HTTP_LISTENER } from './Chain.info';

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

// ServerConfigChain
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
    if (param.server_domainApi) {
        app.get('/api', (req, res) => {
            res.status(200).send(param.server_domainApi());
        });
    }
    next();
}
const ServerConfigChain = new Chain(GDS_SERVER_CONFIG, ServerConfigChainAction);
ServerConfigChain.addSpec('server_domainApi', false);

//ServerConnectMultipartyChain
const ServerConnectMultipartyAction = (context, param, next) => {
    app.use(multipart({
        uploadDir: param.server_tempDir()
    }));
    next();
}
const ServerConnectMultipartyChain = new Chain(GDS_SERVER_CONNECT_MULTIPARTY, ServerConnectMultipartyAction);
ServerConnectMultipartyChain.addSpec('server_tempDir', true);

//ServerHTTPListenerChain
const ServerHTTPListenerChainAction = (context, param, next) => {
    const port = param.server_port ? param.server_port() : '80';
    http.createServer(app).listen(port);
    console.log('HTTP is listening to port', port);
    next();
}
const ServerHTTPListenerChain = new Chain(GDS_SERVER_HTTP_LISTENER, ServerHTTPListenerChainAction);
ServerHTTPListenerChain.addSpec('server_port', false);

//ServerHTTPSListenerChain
const ServerHTTPSListenerChainAction = (context, param, next) => {
    const port = param.server_httpsPort ? param.server_httpsPort() : '443';
    https.createServer(app).listen(port);
    console.log('HTTPS is listening to port', port);
    next();
}
const ServerHTTPSListenerChain = new Chain(GDS_SERVER_HTTPS_LISTENER, ServerHTTPSListenerChainAction);
ServerHTTPSListenerChain.addSpec('server_httpsPort', false);