'use strict';

var _fluidChains = require('fluid-chains');

var _Chain = require('./Chain.info');

var InputHandlerChain = new _fluidChains.Chain(_Chain.INPUT_HANDLER, function (context, param, next) {
  var inputMap = param.util_inputMap();
  process.argv.forEach(function (val, index, array) {
    if (inputMap[val]) {
      context.set(inputMap[val], array[++index]);
    }
  });
  next();
});
InputHandlerChain.addSpec('util_inputMap', true);