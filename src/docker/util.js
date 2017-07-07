import { Chain } from 'fluid-chains';
import lodash from 'lodash';
import restler from 'restler';

export const changeDefaultProtocol = (servicePort) => {
    return servicePort.indexOf('tcp') > -1 ? servicePort.replace('tcp', 'http') : servicePort;
}
export const checkAndGetApi = (proxyHost, proxyPort, retryCount, timeout, url, callback) => {
    const API_SERVICE_RETRY_COUNT = retryCount || 5;
    const API_SERVICE_RETRY_TIMEOUT = timeout || 10000;
    console.log('Connecting to ', url);
    let retry = 0;
    restler.get(url, {
        timeout: API_SERVICE_RETRY_TIMEOUT,
        proxy: {
            host: proxyHost,
            port: proxyPort
        }
    }).on('success', function (data) {
        callback(undefined, data);
    }).on('error', function (reason) {
        if (retry === API_SERVICE_RETRY_COUNT) {
            callback(reason);
        }
        retry++;
        this.retry(API_SERVICE_RETRY_TIMEOUT);
    }).on('fail', function (reason) {
        if (retry === API_SERVICE_RETRY_COUNT) {
            callback(reason);
        }
        retry++;
        this.retry(API_SERVICE_RETRY_TIMEOUT);
    }).on('timeout', function (reason) {
        if (retry === API_SERVICE_RETRY_COUNT) {
            callback(reason);
        }
        retry++;
        this.retry(API_SERVICE_RETRY_TIMEOUT);
    });
}
export const getServiceActions = (links) => {
    const domainActions = [];
    lodash.forEach(links, (service, field) => {
        if (service.domain) {
            domainActions.push({ field, actions: getServiceActions(service.links) });
        } else {
            domainActions.push({ ...service, execute: action, field });
        }
    });
    return domainActions;
}

function action(options, callback) {
    let link = this;
    let url = changeDefaultProtocol(link.url);
    if (options instanceof Function) {
        callback = options;
        options = undefined;
    }
    if (!options) {
        options = {};
    }
    if (!options.timeout) {
        options.timeout = 5000;
    }
    let method = 'get';
    if (link.method === 'POST') {
        method = 'post';
    } else if (link.method === 'PUT') {
        method = 'put';
    } else if (link.method === 'DELETE') {
        method = 'del';
    }
    if (options && options.params) {
        lodash.forEach(options.params, function (value, key) {
            url = url.replace(':' + key, value);
        });
    }
    console.log('request made: ' + url);
    if (options.multipart) {
        var file = restler.file(options.data.path, options.data.originalFilename, options.data.size, null, options.data.type);
        lodash.set(options, 'data', {});
        lodash.set(options.data, options.multipartField, file);
        console.log('data converted to rest file', options);
    }
    /* 
    TODO: find other ways to setup proxy
    if (PROXY_HOST && PROXY_PORT) {
         options.proxy = {
             host: PROXY_HOST,
             port: PROXY_PORT
         };
     }*/
    lodash.get(restler, method)(url, options)
        .on('success', function (result, response) {
            console.log('request success: ' + url);
            callback(undefined, {
                data: result,
                response: response
            });
            if (options.multipart) {
                fs.unlink(lodash.get(options.data, options.multipartField).path);
            }
        })
        .on('error', function (reason, response) {
            console.error('ERROR: ' + url, reason);
            callback(reason, response);
        })
        .on('fail', function (reason, response) {
            console.error('FAIL: ' + url, reason);
            callback(reason, response);
        })
        .on('timeout', function (reason, response) {
            console.error('TIMEOUT: ' + link.url, reason);
            callback(reason, response);
        });
}


export const createChains = (domainName, domainActions) => {
    domainActions.forEach(action => {
        if (action.actions) {
            createChains(`${domainName}.${action.field}`, action.actions);
        } else {
            let chainName = action.field;
            if (action.field == 1) {
                chainName = domainName;
            } else if (action.field.match(/^\d*$/)) {
                chainName = `${domainName}.v${action.field}`;
            } else {
                chainName = `${domainName}.${action.field}`;
            }
            const chainAction = new Chain(chainName, (context, param, next) => {
                const options = param.options ? param.options() : {};
                action.execute(options, (err, result) => {
                    context.set('output', result);
                    next(err);
                });
            });
            console.log('creating chain...', chainAction.info());
            chainAction.addSpec('options');
        }
    })
}