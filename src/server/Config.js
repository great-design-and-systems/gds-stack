import { GDS_SERVER_CONFIG, GDS_SERVER_CONNECT_MULTIPARTY, GDS_SERVER_HTTPS_LISTENER, GDS_SERVER_HTTPS_PROXY_LISTENER, GDS_SERVER_HTTP_LISTENER, GDS_SERVER_HTTP_PROXY_LISTENER } from './Chain.info';

import { Chain } from 'fluid-chains';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import fs from 'fs';
import http from 'http';
import httpProxy from 'http-proxy';
import https from 'https';
import morgan from 'morgan';
import multipart from 'connect-multiparty';

const ENV = process.env.APP_ENV || 'dev';
const app = express();


export const ExpressApp = app;

// ServerConfigChain
const ServerConfigChainAction = (context, param) => {
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
}
const ServerConfigChain = new Chain(GDS_SERVER_CONFIG, ServerConfigChainAction);
ServerConfigChain.addSpec('server_domainApi');

//ServerConnectMultipartyChain
const ServerConnectMultipartyAction = (context, param) => {
    app.use(multipart({
        uploadDir: param.server_tempDir()
    }));
}

const ServerConnectMultipartyChain = new Chain(GDS_SERVER_CONNECT_MULTIPARTY, ServerConnectMultipartyAction);
ServerConnectMultipartyChain.addSpec('server_tempDir', true);

//ServerHTTPListenerChain
const ServerHTTPListenerChainAction = (context, param) => {
    const port = param.server_port();
    const host = param.server_host();
    http.createServer(app).listen(port);
    console.log('HTTP is listening to port', port, host);
};

const ServerHTTPListenerChain = new Chain(GDS_SERVER_HTTP_LISTENER, ServerHTTPListenerChainAction);
ServerHTTPListenerChain.addSpec('server_port', false).default('80');
ServerHTTPListenerChain.addSpec('server_host', false).default('localhost');
//ServerHTTPSListenerChain
const ServerHTTPSListenerChainAction = (context, param) => {
    const port = param.server_httpsPort();
    const host = param.server_httpsHost();
    const credentials = {
        key: fs.readFileSync(param.server_privateKey_path(), param.server_encoding ? param.server_encoding() : 'utf8'),
        cert: fs.readFileSync(param.server_certificate_path(), param.server_encoding ? param.server_encoding() : 'utf8')
    };
    https.createServer(credentials, app).listen(port, host);
    console.log('HTTPS is listening to port', port);
};
const ServerHTTPSListenerChain = new Chain(GDS_SERVER_HTTPS_LISTENER, ServerHTTPSListenerChainAction);
ServerHTTPSListenerChain.addSpec('server_httpsPort').default('443');
ServerHTTPSListenerChain.addSpec('sever_httpsHost').default('127.0.0.1');
ServerHTTPSListenerChain.addSpec('server_privateKey_path', true);
ServerHTTPSListenerChain.addSpec('server_certificate_path', true);
ServerHTTPSListenerChain.addSpec('server_encoding', false);

//ServerHttpProxyListenerChain
const ServerHttpProxyListenerChain = new Chain(GDS_SERVER_HTTP_PROXY_LISTENER, (context, param) => {
    const port = param.server_proxyPort ? param.server_proxyPort() : '8080';
    const addresses = param.server_addresses ? param.server_addresses() : [];
    let currentAddress = 0;
    const proxy = httpProxy.createProxyServer({});
    http.createServer((req, res) => {
        proxy.web(req, res, {target: addresses[currentAddress]});
        currentAddress = (currentAddress + 1) % addresses.length;
    }).listen(port);
});
ServerHttpProxyListenerChain.addSpec('server_proxyPort');
ServerHttpProxyListenerChain.addSpec('server_addresses', true);

//ServerHttpProxyListenerChain
const ServerHttpsProxyListenerChain = new Chain(GDS_SERVER_HTTPS_PROXY_LISTENER, (context, param) => {
    const port = param.server_proxyPort ? param.server_proxyHttpsPort() : '443';
    const addresses = param.server_addresses ? param.server_addresses() : [];
    let currentAddress = 0;
    const proxy = httpProxy.createProxyServer({});
    const credentials = {
        key: fs.readFileSync(param.server_privateKey_path(), param.server_encoding ? param.server_encoding() : 'utf8'),
        cert: fs.readFileSync(param.server_certificate_path(), param.server_encoding ? param.server_encoding() : 'utf8')
    }
    https.createServer(credentials, (req, res) => {
        proxy.web(req, res, {target: addresses[currentAddress]});
        currentAddress = (currentAddress + 1) % addresses.length;
    }).listen(port);
});
ServerHttpsProxyListenerChain.addSpec('server_proxyHttpsPort');
ServerHttpsProxyListenerChain.addSpec('server_addresses', true);
ServerHttpsProxyListenerChain.addSpec('server_privateKey_path', true);
ServerHttpsProxyListenerChain.addSpec('server_certificate_path', true);
ServerHttpsProxyListenerChain.addSpec('server_encoding', false);