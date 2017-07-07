'use strict';

var _fluidChains = require('fluid-chains');

new _fluidChains.ChainMiddleware(/({)([a-zA-Z]*)(\.)([a-zA-Z]*)(})/g, function (param, context, next) {
    console.log('context', context.$owner());
    next();
});